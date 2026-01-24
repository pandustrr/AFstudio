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
        $booking->load(['items.package.subCategory', 'user', 'paymentProof']);

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

        $booking->update([
            'status' => $request->status,
        ]);

        // Auto-create Photo Session if Confirmed
        if ($request->status === 'confirmed') {
            $uid = $booking->guest_uid ?? $booking->booking_code;

            // Register to Photo Selector system
            PhotoEditing::updateOrCreate(
                ['uid' => $uid],
                [
                    'customer_name' => $booking->name,
                    'status' => 'pending',
                    // raw_folder_id is nullable now, Admin will fill it later
                ]
            );
        }

        return redirect()->back()->with('success', 'Booking status updated successfully.');
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
        $booking->load(['items.package.subCategory', 'user', 'paymentProof']);

        $pdf = PDF::loadView('pdf.invoice', compact('booking'))
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => false,
                'isFontSubsettingEnabled' => false,
            ])
            ->setWarnings(false);

        return $pdf->stream('Invoice-' . $booking->booking_code . '.pdf');
    }
}
