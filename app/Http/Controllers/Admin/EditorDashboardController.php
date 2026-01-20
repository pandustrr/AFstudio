<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PhotoEditing;
use App\Models\EditRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EditorDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_sessions' => PhotoEditing::count(),
            'pending_sessions' => PhotoEditing::where('status', 'pending')->count(),
            'processing_sessions' => PhotoEditing::where('status', 'processing')->count(),
            'done_sessions' => PhotoEditing::where('status', 'done')->count(),
        ];

        $latest_requests = PhotoEditing::with(['editRequests'])
            ->withCount('editRequests')
            ->latest()
            ->take(5)
            ->get();

        $activity = DB::table('edit_requests')
            ->join('photo_sessions', 'edit_requests.photo_session_id', '=', 'photo_sessions.id')
            ->select('edit_requests.*', 'photo_sessions.customer_name', 'photo_sessions.uid')
            ->orderBy('edit_requests.created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Editor/Dashboard', [
            'stats' => $stats,
            'latestSessions' => $latest_requests,
            'recentActivity' => $activity
        ]);
    }
}
