<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PhotographerSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class PhotographerSessionController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());
        $photographerId = Auth::id();

        $sessions = PhotographerSession::where('date', $date)
            ->where('photographer_id', $photographerId)
            ->orderBy('start_time')
            ->get();

        // Operasional 05:00 - 20:30 (31 sesi)
        $grid = $this->generateSessionGrid($date, $sessions);

        return Inertia::render('Photographer/Sessions', [
            'grid' => $grid,
            'selectedDate' => $date,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());
        $photographerId = $request->input('photographer_id');

        $photographers = \App\Models\User::where('role', 'photographer')->get();

        $sessions = [];
        if ($photographerId) {
            $sessions = PhotographerSession::where('date', $date)
                ->where('photographer_id', $photographerId)
                ->with(['bookingItem.booking', 'bookingItem.package'])
                ->orderBy('start_time')
                ->get();
        }

        $grid = $photographerId ? $this->generateSessionGrid($date, $sessions) : [];

        return Inertia::render('Admin/Photographers/PhotographerSessions', [
            'photographers' => $photographers,
            'grid' => $grid,
            'selectedDate' => $date,
            'selectedPhotographerId' => $photographerId,
        ]);
    }

    public function updateOffset(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:photographer_sessions,id',
            'offset_minutes' => 'required|integer',
            'offset_description' => 'nullable|string',
        ]);

        $session = PhotographerSession::findOrFail($request->session_id);
        $session->update([
            'offset_minutes' => $request->offset_minutes,
            'offset_description' => $request->offset_description,
        ]);

        return back()->with('success', 'Offset berhasil diperbarui');
    }

    public function reschedule(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:photographer_sessions,id',
            'new_start_time' => 'required',
        ]);

        $session = PhotographerSession::findOrFail($request->session_id);

        // Ensure the new time is in 30min increments and within operational hours
        $newTime = Carbon::createFromTimeString($request->new_start_time);
        if ($newTime->minute % 30 !== 0) {
            return back()->withErrors(['new_start_time' => 'Waktu harus kelipatan 30 menit']);
        }

        // Check availability
        $exists = PhotographerSession::where('photographer_id', $session->photographer_id)
            ->where('date', $session->date)
            ->where('start_time', $request->new_start_time)
            ->where('id', '!=', $session->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['new_start_time' => 'Slot tujuan sudah terpakai']);
        }

        $session->update([
            'start_time' => $request->new_start_time
        ]);

        return back()->with('success', 'Sesi berhasil di-reschedule');
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'start_time' => 'required',
        ]);

        $photographerId = Auth::id();
        $date = $request->date;
        $startTime = $request->start_time;

        $session = PhotographerSession::where('photographer_id', $photographerId)
            ->where('date', $date)
            ->where('start_time', $startTime)
            ->first();

        if ($session) {
            if ($session->status === 'open') {
                $session->delete();
            }
            // If booked, cannot toggle here
        } else {
            PhotographerSession::create([
                'photographer_id' => $photographerId,
                'date' => $date,
                'start_time' => $startTime,
                'status' => 'open',
            ]);
        }

        return back();
    }

    private function generateSessionGrid($date, $existingSessions)
    {
        $grid = [];
        $existingByTime = $existingSessions->keyBy('start_time');

        $start = Carbon::createFromTimeString('05:00');
        $end = Carbon::createFromTimeString('20:00'); // Last session start time

        while ($start <= $end) {
            $timeString = $start->format('H:i:s');
            $session = $existingByTime->get($timeString);

            $grid[] = [
                'time' => $start->format('H:i'),
                'time_full' => $timeString,
                'status' => $session ? $session->status : 'off',
                'session_id' => $session ? $session->id : null,
                'booking_item_id' => $session ? $session->booking_item_id : null,
                'booking_info' => $session && $session->bookingItem ? [
                    'customer_name' => $session->bookingItem->booking->name ?? 'GUEST',
                    'package_name' => $session->bookingItem->package->name ?? 'N/A',
                ] : null,
                'offset_minutes' => $session ? $session->offset_minutes : 0,
                'offset_description' => $session ? $session->offset_description : '',
            ];

            $start->addMinutes(30);
        }

        return $grid;
    }
}
