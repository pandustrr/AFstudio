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
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');

        $photographerId = Auth::id();

        // Determine the selected date
        if ($year && $month && $day) {
            $date = Carbon::createFromDate($year, $month, $day)->toDateString();
        } else {
            $date = Carbon::today()->toDateString();
        }

        $sessions = PhotographerSession::where('date', $date)
            ->where('photographer_id', $photographerId)
            ->with(['bookingItem.booking'])
            ->orderBy('start_time')
            ->get();

        // Get Available Options
        // Get years from data, but always include past and next year
        $dataYears = PhotographerSession::where('photographer_id', $photographerId)
            ->selectRaw('YEAR(date) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        $currentYear = Carbon::today()->year;
        $availableYears = array_unique(array_merge(
            $dataYears,
            [$currentYear, $currentYear - 1, $currentYear + 1]
        ));
        rsort($availableYears);
        $availableYears = array_values($availableYears);

        // Months: All 12 months if year is selected
        $availableMonths = [];
        if ($year) {
            // Get months that have data
            $dataMonths = PhotographerSession::where('photographer_id', $photographerId)
                ->whereYear('date', $year)
                ->selectRaw('MONTH(date) as month')
                ->distinct()
                ->orderBy('month', 'desc')
                ->pluck('month')
                ->toArray();

            // Always show all months (1-12) for the selected year
            $availableMonths = range(1, 12);
        }

        // Days: Available if Year and Month are selected
        $availableDays = [];
        if ($year && $month) {
            $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;

            // Get days that have data
            $dataDays = PhotographerSession::where('photographer_id', $photographerId)
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->selectRaw('DAY(date) as day')
                ->distinct()
                ->orderBy('day', 'desc')
                ->pluck('day')
                ->toArray();

            // Always show all days (1-31 or less based on month)
            $availableDays = range(1, $daysInMonth);
        }

        // Operasional 05:00 - 20:30 (31 sesi)
        $grid = $this->generateSessionGrid($date, $sessions);

        // Get Monthly Stats for Calendar Indicators
        $currentViewYear = $year ?: Carbon::today()->year;
        $currentViewMonth = $month ?: Carbon::today()->month;

        $monthlyStats = PhotographerSession::where('photographer_id', $photographerId)
            ->whereYear('date', $currentViewYear)
            ->whereMonth('date', $currentViewMonth)
            ->where('status', 'booked')
            ->whereHas('bookingItem.booking', function ($q) {
                $q->where('status', '!=', 'cancelled');
            })
            ->selectRaw('date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        return Inertia::render('Photographer/Sessions', [
            'grid' => $grid,
            'selectedDate' => $date,
            'monthlyStats' => $monthlyStats, // Add this
            'filters' => [
                'year' => (string) $year, // Cast to string for consistency
                'month' => (string) $month,
                'day' => (string) $day,
            ],
            'options' => [
                'years' => $availableYears,
                'months' => $availableMonths,
                'days' => $availableDays,
            ]
        ]);
    }

    public function adminIndex(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');
        $photographerId = $request->input('photographer_id');

        // Determine the selected date
        if ($year && $month && $day) {
            $date = Carbon::createFromDate($year, $month, $day)->toDateString();
        } else {
            $date = $request->input('date', Carbon::today()->toDateString());
            // If date is provided but not year/month/day, parse it to set filters
            $carbonDate = Carbon::parse($date);
            $year = $year ?: $carbonDate->year;
            $month = $month ?: $carbonDate->month;
            $day = $day ?: $carbonDate->day;
        }

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

        // Get Available Options
        $currentYear = Carbon::today()->year;
        $availableYears = range($currentYear - 1, $currentYear + 2);

        $availableMonths = range(1, 12);

        $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
        $availableDays = range(1, $daysInMonth);

        // Get Monthly Stats for Calendar Indicators if photographer is selected
        $monthlyStats = [];
        if ($photographerId) {
            $currentViewYear = $year ?: Carbon::today()->year;
            $currentViewMonth = $month ?: Carbon::today()->month;

            $monthlyStats = PhotographerSession::where('photographer_id', $photographerId)
                ->whereYear('date', $currentViewYear)
                ->whereMonth('date', $currentViewMonth)
                ->where('status', 'booked')
                ->whereHas('bookingItem.booking', function ($q) {
                    $q->where('status', '!=', 'cancelled');
                })
                ->selectRaw('date, count(*) as count')
                ->groupBy('date')
                ->pluck('count', 'date');
        }

        return Inertia::render('Admin/Photographers/PhotographerSessions', [
            'photographers' => $photographers,
            'grid' => $grid,
            'selectedDate' => $date,
            'selectedPhotographerId' => $photographerId,
            'monthlyStats' => $monthlyStats,
            'filters' => [
                'year' => (string)$year,
                'month' => (string)$month,
                'day' => (string)$day,
            ],
            'options' => [
                'years' => $availableYears,
                'months' => $availableMonths,
                'days' => $availableDays,
            ]
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
            // Session exists
            if ($session->status === 'booked') {
                // Cannot toggle booked sessions
                return back();
            }

            // Toggle between 'open' and 'off'
            $newStatus = $session->status === 'open' ? 'off' : 'open';
            $session->update(['status' => $newStatus]);
        } else {
            // No record exists -> Create as 'off' (photographer is closing this slot)
            // Since default is 'open', clicking means they want to close it
            PhotographerSession::create([
                'photographer_id' => $photographerId,
                'date' => $date,
                'start_time' => $startTime,
                'status' => 'off',
            ]);
        }

        // Redirect with filter params if provided
        if ($request->has('year') || $request->has('month') || $request->has('day')) {
            $params = [];
            if ($request->has('year')) $params['year'] = $request->input('year');
            if ($request->has('month')) $params['month'] = $request->input('month');
            if ($request->has('day')) $params['day'] = $request->input('day');
            return back()->with('filters', $params);
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

            // NEW Logic:
            // If session exists: use its status ('booked', 'open', 'off').
            // If session NULL: default to 'open' (Available by default).

            $status = 'open'; // Default: TERSEDIA (available)

            if ($session) {
                $status = $session->status; // Use actual status: 'booked', 'open', or 'off'
            }

            $grid[] = [
                'time' => $start->format('H:i'),
                'time_full' => $timeString,
                'status' => $status,
                'session_id' => $session ? $session->id : null,
                'booking_item_id' => $session ? $session->booking_item_id : null,
                'booking_info' => $session && $session->bookingItem && $session->bookingItem->booking->status !== 'cancelled' ? [
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

    public function reservations(Request $request)
    {
        $photographerId = Auth::id();
        $uidFilter = $request->input('uid');

        // Get all booked sessions for this photographer with booking details
        $query = PhotographerSession::where('photographer_id', $photographerId)
            ->where('status', 'booked')
            ->whereHas('bookingItem.booking', function ($q) {
                $q->where('status', '!=', 'cancelled');
            })
            ->with(['bookingItem.booking', 'bookingItem.package']);

        // Apply UID filter if provided
        if ($uidFilter) {
            $query->where('cart_uid', $uidFilter);
        }

        $sessions = $query->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();

        $reservations = $sessions->map(function ($session) {
            return [
                'id' => $session->id,
                'date' => $session->date,
                'time' => Carbon::createFromTimeString($session->start_time)->format('H:i'),
                'time_full' => $session->start_time,
                'customer_name' => $session->bookingItem?->booking?->name ?? 'GUEST',
                'customer_email' => $session->bookingItem?->booking?->email ?? '-',
                'customer_phone' => $session->bookingItem?->booking?->phone ?? '-',
                'package_name' => $session->bookingItem?->package?->name ?? 'N/A',
                'package_price' => $session->bookingItem?->package?->price ?? 0,
                'booking_id' => $session->bookingItem?->booking_id ?? null,
                'booking_item_id' => $session->booking_item_id,
                'cart_uid' => $session->cart_uid,
                'offset_minutes' => $session->offset_minutes,
                'offset_description' => $session->offset_description,
            ];
        });

        // Get all booked sessions for this photographer - build reservations array
        $allSessions = PhotographerSession::where('photographer_id', $photographerId)
            ->where('status', 'booked')
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get(['id', 'date', 'start_time']);

        return Inertia::render('Photographer/Reservations', [
            'reservations' => $reservations,
            'allSessions' => $allSessions->isEmpty() ? [] : $allSessions->toArray(),
            'selectedSessionId' => $uidFilter
        ]);
    }
}
