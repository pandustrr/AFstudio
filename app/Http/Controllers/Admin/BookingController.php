<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\PhotoEditing;
use App\Models\BookingItem;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\PaymentProof;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');
        $status = $request->input('status');
        $search = $request->input('search');
        $photographerId = $request->input('photographer_id');

        $query = \App\Models\BookingItem::query()
            ->with(['booking.user', 'booking.paymentProof', 'package.subCategory', 'photographer']);

        // Filter by Photographer
        if ($photographerId) {
            $query->where('photographer_id', $photographerId);
        }

        // Search in Booking metadata
        if ($search) {
            $query->whereHas('booking', function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by Booking status
        if ($status && $status !== 'all') {
            $query->whereHas('booking', function ($q) use ($status) {
                $q->where('status', $status);
            });
        } else {
            // Default: hide cancelled and request_edit bookings when viewing all (or as per project preference)
            // But let's show request_edit in 'all' if needed.
            $query->whereHas('booking', function ($q) {
                $q->whereNotIn('status', ['cancelled']);
            });
        }

        // Filter by Date Parts
        if ($year) {
            $query->whereYear('scheduled_date', $year);
        }
        if ($month) {
            $query->whereMonth('scheduled_date', $month);
        }
        if ($day) {
            $query->whereDay('scheduled_date', $day);
        }

        // Sorting: by date and then by time
        $query->orderBy('scheduled_date', 'asc')
            ->orderBy('start_time', 'asc');

        $items = $query->paginate(30)->withQueryString();

        // --- Conflict Detection Logic (Yellow Card) ---
        $items->getCollection()->transform(function ($item) {
            $isConflict = false;

            // Only check for Pending or Confirmed bookings
            if (in_array($item->booking->status, ['pending', 'confirmed'])) {
                $slots = $item->selected_times; // Array of strings like ["10:00:00", "10:30:00"]
                $date = $item->scheduled_date->toDateString();
                $photographerId = $item->photographer_id;

                if ($photographerId && $date && !empty($slots)) {
                    // 1. Check for Booked Sessions (Conflict with Confirmed)
                    $bookedCount = \App\Models\PhotographerSession::where('photographer_id', $photographerId)
                        ->where('date', $date)
                        ->whereIn('start_time', $slots)
                        ->where('status', 'booked')
                        // Ensure it's not booked for THIS same item (legitimate booking)
                        ->where('booking_item_id', '!=', $item->id)
                        ->count();

                    if ($bookedCount > 0) {
                        $isConflict = true;
                    } else {
                        // 2. Check for Multiple Pending Bookings (Conflict between Pendings)
                        // Find OTHER pending items for the same slots
                        $overlapPendingCount = \App\Models\BookingItem::where('id', '!=', $item->id)
                            ->where('photographer_id', $photographerId)
                            ->where('scheduled_date', $date)
                            ->whereHas('booking', function($q) {
                                $q->where('status', 'pending');
                            })
                            ->where(function($q) use ($slots) {
                                foreach ($slots as $slot) {
                                    $q->orWhereJsonContains('selected_times', $slot);
                                }
                            })
                            ->count();

                        if ($overlapPendingCount > 0) {
                            $isConflict = true;
                        }
                    }
                }
            }

            $item->is_conflict = $isConflict;
            return $item;
        });

        // Get Available Options
        $availableYears = \App\Models\BookingItem::selectRaw('YEAR(scheduled_date) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        $availableMonths = [];
        if ($year) {
            $availableMonths = \App\Models\BookingItem::whereYear('scheduled_date', $year)
                ->selectRaw('MONTH(scheduled_date) as month')
                ->distinct()
                ->orderBy('month', 'desc')
                ->pluck('month')
                ->toArray();
        }

        $availableDays = [];
        if ($year && $month) {
            $availableDays = \App\Models\BookingItem::whereYear('scheduled_date', $year)
                ->whereMonth('scheduled_date', $month)
                ->selectRaw('DAY(scheduled_date) as day')
                ->distinct()
                ->orderBy('day', 'desc')
                ->pluck('day')
                ->toArray();
        }

        return Inertia::render('Admin/Bookings/Index', [
            'bookingItems' => $items,
            'followUpTemplates' => \App\Models\FollowUpTemplate::orderBy('name')->get(),
            'filters' => [
                'year' => $year,
                'month' => $month,
                'day' => $day,
                'status' => $status ?? 'all',
                'search' => $search,
                'photographer_id' => $photographerId,
            ],
            'photographers' => \App\Models\User::where('role', 'photographer')->get(),
            'options' => [
                'years' => $availableYears,
                'months' => $availableMonths,
                'days' => $availableDays
            ]
        ]);
    }

    public function show(Booking $booking)
    {
        $booking->load(['items.package.subCategory', 'items.photographer', 'user', 'paymentProof']);

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking,
            'photographers' => \App\Models\User::where('role', 'photographer')->get(),
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        try {
            DB::transaction(function () use ($request, $booking) {
                $oldStatus = $booking->status;
                $newStatus = $request->status;

                $booking->update([
                    'status' => $newStatus,
                ]);

                // Handle photographer slots based on new status
                if (in_array($newStatus, ['confirmed', 'completed'])) {
                    // Lock sessions for confirmed/completed bookings
                    foreach ($booking->items as $item) {
                        if ($item->photographer_id && $item->scheduled_date && $item->start_time && $item->end_time) {
                            $startTime = \Carbon\Carbon::parse($item->start_time);
                            $endTime = \Carbon\Carbon::parse($item->end_time);
                            $date = $item->scheduled_date->toDateString();

                            $slots = [];
                            $tempTime = clone $startTime;
                            while ($tempTime->lt($endTime)) {
                                $slots[] = $tempTime->format('H:i:s');
                                $tempTime->addMinutes(30);
                            }

                            if (!empty($slots)) {
                                \App\Models\PhotographerSession::where('photographer_id', $item->photographer_id)
                                    ->where('date', $date)
                                    ->whereIn('start_time', $slots)
                                    ->update([
                                        'status' => 'booked',
                                        'booking_item_id' => $item->id,
                                        'updated_at' => now()
                                    ]);
                            }
                        }
                    }
                } elseif (in_array($newStatus, ['pending', 'cancelled'])) {
                    // Release sessions if the status is pending or cancelled
                    $this->releasePhotographerSessions($booking);
                }

                // Auto-create/Update Photo Session status
                $uid = $booking->guest_uid ?? $booking->booking_code;
                $photoSession = PhotoEditing::where('uid', $uid)->first();

                if ($newStatus === 'confirmed') {
                    if (!$photoSession) {
                        PhotoEditing::create([
                            'uid' => $uid,
                            'customer_name' => $booking->name,
                            'status' => 'pending',
                        ]);
                    }
                } elseif ($newStatus === 'completed') {
                    if ($photoSession) $photoSession->update(['status' => 'done']);
                } elseif ($newStatus === 'cancelled') {
                    if ($photoSession) $photoSession->update(['status' => 'cancelled']);
                }
            });

            return redirect()->back()->with('success', 'Booking status updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function updateItem(Request $request, BookingItem $item)
    {
        $validated = $request->validate([
            'photographer_id' => 'nullable|exists:users,id',
            'scheduled_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $item->update($validated);

        return redirect()->back()->with('success', 'Booking item updated successfully.');
    }

    public function downloadInvoice(Booking $booking)
    {
        $booking->load(['items.package.subCategory', 'items.photographer', 'user', 'paymentProof']);

        $pdf = PDF::loadView('pdf.invoice', compact('booking'))
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => false,
            ]);

        return $pdf->stream('Invoice-' . $booking->booking_code . '.pdf');
    }

    public function destroy(Booking $booking)
    {
        try {
            DB::transaction(function () use ($booking) {
                // Release photographer slots
                $this->releasePhotographerSessions($booking);

                foreach ($booking->paymentProof as $proof) {
                    if ($proof->file_path && Storage::disk('public')->exists($proof->file_path)) {
                        Storage::disk('public')->delete($proof->file_path);
                    }
                    $proof->delete();
                }

                // Delete associated photo session
                $uid = $booking->guest_uid ?? $booking->booking_code;
                PhotoEditing::where('uid', $uid)->delete();

                $booking->delete();
            });

            return redirect()->back()->with('success', 'Booking has been deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete booking: ' . $e->getMessage());
        }
    }

    public function deletePaymentProof(Booking $booking)
    {
        try {
            foreach ($booking->paymentProof as $proof) {
                if ($proof->file_path && Storage::disk('public')->exists($proof->file_path)) {
                    Storage::disk('public')->delete($proof->file_path);
                }
                $proof->delete();
            }

            return redirect()->back()->with('success', 'Payment proof(s) deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete payment proof: ' . $e->getMessage());
        }
    }

    public function bulkDelete(Request $request)
    {
        try {
            $status = $request->status;
            $search = $request->input('search');
            $year = $request->input('year');
            $month = $request->input('month');
            $day = $request->input('day');
            $photographerId = $request->input('photographer_id');

            if (!$status || $status === 'all') {
                return redirect()->back()->with('error', 'Pilih filter status terlebih dahulu (Pending, Done, atau Cancelled).');
            }

            // Build a query for Bookings that match the filtered BookingItems
            $query = Booking::where('status', $status);

            // Apply same filters as Index
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('booking_code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            if ($year || $month || $day || $photographerId) {
                $query->whereHas('items', function ($q) use ($year, $month, $day, $photographerId) {
                    if ($photographerId) {
                        $q->where('photographer_id', $photographerId);
                    }
                    if ($year) {
                        $q->whereYear('scheduled_date', $year);
                    }
                    if ($month) {
                        $q->whereMonth('scheduled_date', $month);
                    }
                    if ($day) {
                        $q->whereDay('scheduled_date', $day);
                    }
                });
            }

            $bookings = $query->with(['paymentProof', 'items'])->limit(500)->get();

            $count = 0;
            foreach ($bookings as $booking) {
                DB::transaction(function () use ($booking, &$count) {
                    // Release photographer slots
                    $this->releasePhotographerSessions($booking);

                    foreach ($booking->paymentProof as $proof) {
                        if ($proof->file_path && Storage::disk('public')->exists($proof->file_path)) {
                            Storage::disk('public')->delete($proof->file_path);
                        }
                        $proof->delete();
                    }

                    // Delete associated photo session
                    $uid = $booking->guest_uid ?? $booking->booking_code;
                    PhotoEditing::where('uid', $uid)->delete();

                    $booking->delete();
                    $count++;
                });
            }

            return redirect()->back()->with('success', "Berhasil menghapus $count data booking.");
        } catch (\Throwable $e) {
            Log::error('Bulk Delete Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus masal: ' . $e->getMessage());
        }
    }

    public function bulkDeleteProofs(Request $request)
    {
        try {
            $status = $request->status;
            if (!$status || $status === 'all') {
                return redirect()->back()->with('error', 'Pilih filter status terlebih dahulu (Pending, Done, atau Cancelled).');
            }

            $query = PaymentProof::query();
            $query->whereHas('booking', function ($q) use ($status) {
                $q->where('status', $status);
            });

            $proofs = $query->limit(500)->get();
            $count = 0;

            foreach ($proofs as $proof) {
                if ($proof->file_path && Storage::disk('public')->exists($proof->file_path)) {
                    Storage::disk('public')->delete($proof->file_path);
                }
                $proof->delete();
                $count++;
            }

            return redirect()->back()->with('success', "Berhasil menghapus $count gambar bukti pembayaran.");
        } catch (\Throwable $e) {
            Log::error('Bulk Delete Proofs Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus bukti masal: ' . $e->getMessage());
        }
    }

    /**
     * Release all photographer sessions associated with a booking.
     */
    private function releasePhotographerSessions(Booking $booking)
    {
        $itemIds = $booking->items->pluck('id')->toArray();
        $uid = $booking->guest_uid;

        // Condition 1: Find by booking_item_id
        $query = DB::table('photographer_sessions');
        
        $query->where(function($q) use ($itemIds, $uid) {
            if (!empty($itemIds)) {
                $q->whereIn('booking_item_id', $itemIds);
            }
            if ($uid) {
                $q->orWhere('cart_uid', $uid);
            }
        });

        $query->update([
            'booking_item_id' => null,
            'status' => 'open',
            'cart_uid' => null,
            'updated_at' => now()
        ]);
    }
}
