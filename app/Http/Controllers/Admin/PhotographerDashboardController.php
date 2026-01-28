<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PhotographerDashboardController extends Controller
{
    public function index()
    {
        $photographerId = \Illuminate\Support\Facades\Auth::id();
        $today = now()->toDateString();
        $tomorrow = now()->addDay()->toDateString();

        // Stats for this photographer
        $stats = [
            'today_booked' => \App\Models\PhotographerSession::where('photographer_id', $photographerId)
                ->where('date', $today)
                ->where('status', 'booked')
                ->whereHas('bookingItem.booking', function ($q) {
                    $q->where('status', 'confirmed');
                })
                ->count(),
            'tomorrow_booked' => \App\Models\PhotographerSession::where('photographer_id', $photographerId)
                ->where('date', $tomorrow)
                ->where('status', 'booked')
                ->whereHas('bookingItem.booking', function ($q) {
                    $q->where('status', 'confirmed');
                })
                ->count(),
            'today_open' => \App\Models\PhotographerSession::where('photographer_id', $photographerId)
                ->where('date', $today)
                ->where('status', 'open')
                ->count(),
            'total_upcoming' => \App\Models\PhotographerSession::where('photographer_id', $photographerId)
                ->where('status', 'booked')
                ->where('date', '>=', $today)
                ->whereHas('bookingItem.booking', function ($q) {
                    $q->where('status', 'confirmed');
                })
                ->count(),
        ];

        // Next Upcoming Session - ONLY CONFIRMED
        $nextSession = \App\Models\PhotographerSession::with([
            'bookingItem' => function ($q) {
                $q->withCount('sessions');
            },
            'bookingItem.booking',
            'bookingItem.package'
        ])
            ->where('photographer_id', $photographerId)
            ->where('status', 'booked')
            ->whereHas('bookingItem.booking', function ($q) {
                $q->where('status', 'confirmed');
            })
            ->where(function ($q) use ($today) {
                $q->where('date', '>', $today)
                    ->orWhere(function ($q2) use ($today) {
                        $q2->where('date', $today)
                            ->where('start_time', '>=', now()->toTimeString());
                    });
            })
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->first();

        // Recent bookings involving this photographer
        $recentBookings = \App\Models\Booking::where('status', 'confirmed')
            ->whereHas('items', function ($q) use ($photographerId) {
                $q->where('photographer_id', $photographerId);
            })
            ->with(['items' => function ($q) use ($photographerId) {
                $q->where('photographer_id', $photographerId)->with('package');
            }])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Photographer/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'nextSession' => $nextSession,
        ]);
    }
}
