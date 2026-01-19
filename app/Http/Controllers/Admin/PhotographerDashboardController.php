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
        // Simple stats for photographer
        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
            'completed_bookings' => Booking::where('status', 'completed')->count(),
        ];

        // Recent bookings for the photographer
        $recent_bookings = Booking::with(['items.package', 'items.room'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Photographer/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recent_bookings,
        ]);
    }
}
