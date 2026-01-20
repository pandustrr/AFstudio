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

        // Stats for this photographer
        $stats = [
            'total_sessions' => \App\Models\PhotographerSession::where('photographer_id', $photographerId)->count(),
            'booked_sessions' => \App\Models\PhotographerSession::where('photographer_id', $photographerId)->where('status', 'booked')->count(),
            'open_sessions' => \App\Models\PhotographerSession::where('photographer_id', $photographerId)->where('status', 'open')->count(),
            'upcoming_sessions' => \App\Models\PhotographerSession::where('photographer_id', $photographerId)
                ->where('status', 'booked')
                ->where('date', '>=', now()->toDateString())
                ->count(),
        ];

        // Recent bookings involving this photographer
        $recent_bookings = \App\Models\Booking::whereHas('items', function ($q) use ($photographerId) {
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
            'recentBookings' => $recent_bookings,
        ]);
    }
}
