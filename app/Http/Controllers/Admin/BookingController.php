<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\PhotoEditing;
use App\Models\BookingItem;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

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
            // Default: hide cancelled bookings when viewing all
            $query->whereHas('booking', function ($q) {
                $q->where('status', '!=', 'cancelled');
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

        // Get Available Options
        $availableYears = \App\Models\BookingItem::selectRaw('YEAR(scheduled_date) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        // Ensure current filtered year is in options
        if ($year && !in_array((int)$year, $availableYears)) {
            $availableYears[] = (int)$year;
            rsort($availableYears);
        }

        $availableMonths = [];
        if ($year) {
            $availableMonths = \App\Models\BookingItem::whereYear('scheduled_date', $year)
                ->selectRaw('MONTH(scheduled_date) as month')
                ->distinct()
                ->orderBy('month', 'desc')
                ->pluck('month')
                ->toArray();

            // Ensure current filtered month is in options
            if ($month && !in_array((int)$month, $availableMonths)) {
                $availableMonths[] = (int)$month;
                rsort($availableMonths);
            }
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

            // Ensure current filtered day is in options
            if ($day && !in_array((int)$day, $availableDays)) {
                $availableDays[] = (int)$day;
                rsort($availableDays);
            }
        }

        return Inertia::render('Admin/Bookings/Index', [
            'bookingItems' => $items,
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
            \Illuminate\Support\Facades\DB::transaction(function () use ($request, $booking) {
                $oldStatus = $booking->status;
                $newStatus = $request->status;

                $booking->update([
                    'status' => $newStatus,
                ]);

                // Release photographer slots if the new status is cancelled
                if ($newStatus === 'cancelled') {
                    // Get ALL items associated with this booking
                    $itemIds = \Illuminate\Support\Facades\DB::table('booking_items')
                        ->where('booking_id', $booking->id)
                        ->pluck('id')
                        ->toArray();

                    if (!empty($itemIds)) {
                        // Use DB::table for maximum reliability and to bypass any Eloquent event issues
                        \Illuminate\Support\Facades\DB::table('photographer_sessions')
                            ->whereIn('booking_item_id', $itemIds)
                            ->update([
                                'booking_item_id' => null,
                                'status' => 'open',
                                'cart_uid' => null,
                                'updated_at' => now()
                            ]);
                    }

                    // Additional safety: Release any session with this guest UID
                    if ($booking->guest_uid) {
                        \Illuminate\Support\Facades\DB::table('photographer_sessions')
                            ->where('cart_uid', $booking->guest_uid)
                            ->where('status', 'booked')
                            ->update([
                                'booking_item_id' => null,
                                'status' => 'open',
                                'cart_uid' => null,
                                'updated_at' => now()
                            ]);
                    }
                }

                // Handle Reset: Cancelled -> Pending
                // We need to re-book the photographer slots if they are still available.
                if ($oldStatus === 'cancelled' && $newStatus === 'pending') {
                    $items = \App\Models\BookingItem::with('package')->where('booking_id', $booking->id)->get();
                    $bookingUid = $booking->guest_uid ?? $booking->booking_code;

                    foreach ($items as $item) {
                        // Calculate required sessions based on package duration
                        $durationMinutes = $item->package->duration ?? 60;
                        $sessionsNeeded = ceil($durationMinutes / 30);

                        // Generate required time slots
                        $slots = [];
                        $time = \Carbon\Carbon::createFromTimeString($item->start_time);
                        for ($i = 0; $i < $sessionsNeeded; $i++) {
                            $slots[] = $time->format('H:i:s');
                            $time->addMinutes(30);
                        }

                        // Check availability
                        $availableSessions = \App\Models\PhotographerSession::where('photographer_id', $item->photographer_id)
                            ->where('date', $item->scheduled_date)
                            ->whereIn('start_time', $slots)
                            ->where('status', 'open')
                            ->get();

                        if ($availableSessions->count() !== count($slots)) {
                            throw new \Exception("Gagal mereset booking: Slot waktu untuk fotografer sudah terisi oleh orang lain.");
                        }

                        // Re-book the sessions
                        \App\Models\PhotographerSession::whereIn('id', $availableSessions->pluck('id'))
                            ->update([
                                'status' => 'booked',
                                'booking_item_id' => $item->id,
                                'cart_uid' => $bookingUid
                            ]);
                    }
                }

                // Auto-create Photo Session if Confirmed
                if ($newStatus === 'confirmed' && $oldStatus !== 'confirmed') {
                    $uid = $booking->guest_uid ?? $booking->booking_code;

                    PhotoEditing::updateOrCreate(
                        ['uid' => $uid],
                        [
                            'customer_name' => $booking->name,
                            'status' => 'pending',
                        ]
                    );
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
                'isFontSubsettingEnabled' => false,
            ])
            ->setWarnings(false);

        return $pdf->stream('Invoice-' . $booking->booking_code . '.pdf');
    }

    public function destroy(Booking $booking)
    {
        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($booking) {
                // Release photographer slots
                $itemIds = \Illuminate\Support\Facades\DB::table('booking_items')
                    ->where('booking_id', $booking->id)
                    ->pluck('id')
                    ->toArray();

                if (!empty($itemIds)) {
                    \Illuminate\Support\Facades\DB::table('photographer_sessions')
                        ->whereIn('booking_item_id', $itemIds)
                        ->update([
                            'booking_item_id' => null,
                            'status' => 'open',
                            'cart_uid' => null,
                            'updated_at' => now()
                        ]);
                }

                // Delete Payment Proof Files
                foreach ($booking->paymentProof as $proof) {
                    if ($proof->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($proof->file_path)) {
                        \Illuminate\Support\Facades\Storage::disk('public')->delete($proof->file_path);
                    }
                    $proof->delete();
                }

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
                if ($proof->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($proof->file_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($proof->file_path);
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
            $query = Booking::query();

            // Apply same filters as in index() to determine what to delete
            if ($request->status && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('booking_code', 'like', "%{$request->search}%")
                        ->orWhere('name', 'like', "%{$request->search}%");
                });
            }

            $bookings = $query->get();

            \Illuminate\Support\Facades\DB::transaction(function () use ($bookings) {
                foreach ($bookings as $booking) {
                    // Release photographer slots
                    $itemIds = \Illuminate\Support\Facades\DB::table('booking_items')
                        ->where('booking_id', $booking->id)
                        ->pluck('id')
                        ->toArray();

                    if (!empty($itemIds)) {
                        \Illuminate\Support\Facades\DB::table('photographer_sessions')
                            ->whereIn('booking_item_id', $itemIds)
                            ->update([
                                'booking_item_id' => null,
                                'status' => 'open',
                                'cart_uid' => null,
                                'updated_at' => now()
                            ]);
                    }

                    // Delete Payment Proof Files
                    foreach ($booking->paymentProof as $proof) {
                        if ($proof->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($proof->file_path)) {
                            \Illuminate\Support\Facades\Storage::disk('public')->delete($proof->file_path);
                        }
                        $proof->delete();
                    }

                    $booking->delete();
                }
            });

            return redirect()->back()->with('success', 'Bulk delete successful.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Bulk delete failed: ' . $e->getMessage());
        }
    }

    public function bulkDeleteProofs(Request $request)
    {
        try {
            $query = \App\Models\PaymentProof::query();

            if ($request->status && $request->status !== 'all') {
                $query->whereHas('booking', function ($q) use ($request) {
                    $q->where('status', $request->status);
                });
            }

            $proofs = $query->get();

            foreach ($proofs as $proof) {
                if ($proof->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($proof->file_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($proof->file_path);
                }
                $proof->delete();
            }

            return redirect()->back()->with('success', 'Bulk proof deletion successful.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Bulk proof deletion failed: ' . $e->getMessage());
        }
    }
}
