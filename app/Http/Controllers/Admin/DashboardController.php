<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PhotographerSession;
use App\Models\Booking;
use App\Models\Review;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        // Stats for today only
        $stats = [
            'total_sessions' => PhotographerSession::where('date', $today)->count(),
            'new_bookings' => Booking::whereDate('created_at', $today)->count(),
            'reservations' => PhotographerSession::where('date', $today)
                ->where('status', 'booked')
                ->count(),
            'reviews' => Review::whereDate('created_at', $today)->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
