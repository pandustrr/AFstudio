<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\BookingItem::query()
            ->with(['booking.user', 'package.subCategory']);

        // Filter by Room
        if ($request->has('room_id') && $request->room_id != '') {
            $query->where('room_id', $request->room_id);
        }

        // Search in Booking metadata
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('booking', function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by Booking status
        if ($request->has('status') && $request->status != '') {
            $query->whereHas('booking', function ($q) use ($request) {
                $q->where('status', $request->status);
            });
        }
        
        // Filter by Scheduled Date (per item)
        if ($request->has('date') && $request->date != '') {
             $query->whereDate('scheduled_date', $request->date);
        }

        // Sorting: by date and then by time
        $query->orderBy('scheduled_date', 'asc')
              ->orderBy('start_time', 'asc');

        $items = $query->paginate(30)->withQueryString();

        return Inertia::render('Admin/Bookings/Index', [
            'bookingItems' => $items,
            'filters' => $request->only(['search', 'status', 'date', 'room_id']),
        ]);
    }

    public function show(Booking $booking)
    {
        $booking->load(['items.package.subCategory', 'user']);

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking,
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

        return redirect()->back()->with('success', 'Booking status updated successfully.');
    }
}
