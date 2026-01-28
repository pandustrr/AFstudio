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
        $tomorrow = now()->addDay()->toDateString();

        // Stats for Dashboard
        $stats = [
            'pending_payments' => \App\Models\PaymentProof::where('status', 'pending')->count(),
            'today_sessions' => PhotographerSession::where('date', $today)
                ->where('status', 'booked')
                ->count(),
            'tomorrow_sessions' => PhotographerSession::where('date', $tomorrow)
                ->where('status', 'booked')
                ->count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
        ];

        // Recent Bookings
        $recentBookings = Booking::with(['items.photographer'])
            ->latest()
            ->take(5)
            ->get();

        // Recent Reviews
        $recentReviews = Review::latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'recentReviews' => $recentReviews,
        ]);
    }
}
