<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BookingItem;
use App\Models\PricelistPackage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{
    /**
     * Check availability for a specific date and package.
     * Returns valid start times.
     */
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'package_id' => 'required|exists:pricelist_packages,id',
            'room_id' => 'nullable|integer|in:1,2,3',
        ]);

        try {
            \Illuminate\Support\Facades\Log::info('Schedule Check Request:', $request->all());

            $date = Carbon::parse($request->date);
            $package = PricelistPackage::findOrFail($request->package_id);
            $durationMinutes = $package->duration ?? 60;
            $requestedRoomId = $request->room_id;

            // 1. Fetch ALL rooms for metadata
            $allRooms = \App\Models\Room::all();

            // 2. Pre-fetch schedules for ALL rooms
            $dayOfWeek = $date->dayOfWeek;
            $schedules = \App\Models\RoomSchedule::whereIn('room_id', $allRooms->pluck('id'))
                ->where(function ($q) use ($date, $dayOfWeek) {
                    $q->where('date', $date->toDateString())
                        ->orWhere(function ($q2) use ($dayOfWeek) {
                            $q2->whereNull('date')->where('day_of_week', $dayOfWeek);
                        });
                })->get()->groupBy('room_id');

            $perRoomInfo = [];
            $allRoomAvailability = [];

            foreach ($allRooms as $room) {
                $roomSchedules = isset($schedules[$room->id]) ? $schedules[$room->id] : collect();

                // Check overrides then weekly
                $activeSchedules = $roomSchedules->where('date', $date->toDateString());
                if ($activeSchedules->isEmpty()) {
                    $activeSchedules = $roomSchedules->whereNull('date')->where('day_of_week', $dayOfWeek);
                }

                $windows = [];
                $minW = null;
                $maxW = null;

                if ($activeSchedules->isNotEmpty()) {
                    foreach ($activeSchedules as $sched) {
                        if ($sched->is_active) {
                            $start = Carbon::parse($date->toDateString() . ' ' . $sched->start_time);
                            $end = Carbon::parse($date->toDateString() . ' ' . $sched->end_time);
                            $windows[] = ['start' => $start, 'end' => $end];

                            if (!$minW || $start->lt($minW)) $minW = $start;
                            if (!$maxW || $end->gt($maxW)) $maxW = $end;
                        }
                    }
                }

                $allRoomAvailability[$room->id] = $windows;

                // Format for frontend
                if (!empty($windows) && $minW && $maxW) {
                    $perRoomInfo[] = [
                        'id' => $room->id,
                        'name' => $room->label ?? $room->name,
                        'start' => $minW->format('H:i'),
                        'end' => $maxW->format('H:i'),
                        'is_open' => true // Simplified, if windows exist it's likely open unless explicitly closed (which results in empty windows if we handled is_active=false correctly above? actually we checked is_active)
                        // Wait, in the loop above we only add if is_active. 
                        // If activeSchedules exists but valid ones have is_active=false, windows might be empty.
                        // So windows empty means closed.
                    ];
                    if (empty($windows)) {
                        // Correct the entry to show closed
                        array_pop($perRoomInfo);
                        $perRoomInfo[] = [
                            'id' => $room->id,
                            'name' => $room->label ?? $room->name,
                            'start' => '-',
                            'end' => '-',
                            'is_open' => false
                        ];
                    }
                } else {
                    $perRoomInfo[] = [
                        'id' => $room->id,
                        'name' => $room->label ?? $room->name,
                        'start' => '-',
                        'end' => '-',
                        'is_open' => false
                    ];
                }
            }

            // 3. Generate slots for REQUESTED room(s)
            $targetRooms = $requestedRoomId ? $allRooms->where('id', $requestedRoomId) : $allRooms;

            // Get all booked slots
            $query = BookingItem::whereHas('booking', function ($q) {
                $q->whereIn('status', ['pending', 'confirmed', 'completed']);
            })
                ->whereDate('scheduled_date', $date->toDateString());
            $bookedSlots = $query->get(['start_time', 'end_time', 'room_id']);

            $availableStartTimes = [];

            foreach ($targetRooms as $room) {
                $windows = $allRoomAvailability[$room->id] ?? [];

                foreach ($windows as $window) {
                    $currentSlot = $window['start']->copy();

                    // Iterate within this specific window
                    // Step by duration to create clean slots aligned with window start
                    while ($currentSlot->copy()->addMinutes($durationMinutes)->lte($window['end'])) {
                        $slotEnd = $currentSlot->copy()->addMinutes($durationMinutes);

                        // Check booking overlap
                        $isTaken = $bookedSlots->filter(function ($booking) use ($room, $currentSlot, $slotEnd) {
                            if ($booking->room_id != $room->id) return false;
                            $bStart = Carbon::parse($booking->start_time);
                            $bEnd = Carbon::parse($booking->end_time);
                            return $bStart->lt($slotEnd) && $bEnd->gt($currentSlot);
                        })->isNotEmpty();

                        if (!$isTaken) {
                            $timeStr = $currentSlot->format('H:i');
                            if (!in_array($timeStr, $availableStartTimes)) {
                                $availableStartTimes[] = $timeStr;
                            }
                        }

                        $currentSlot->addMinutes($durationMinutes);
                    }
                }
            }

            sort($availableStartTimes);

            return response()->json([
                'date' => $date->toDateString(),
                'duration' => $durationMinutes,
                'room_id' => $requestedRoomId,
                'available_slots' => $availableStartTimes,
                'per_room_info' => $perRoomInfo
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Schedule Check Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkPhotographerAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'package_id' => 'required|exists:pricelist_packages,id',
            'photographer_id' => 'nullable|exists:users,id',
        ]);

        $date = $request->date;
        $package = PricelistPackage::findOrFail($request->package_id);
        $maxSessions = $package->max_sessions;

        // Fetch photographers who have "open" sessions on this date
        $photographers = \App\Models\User::where('role', 'photographer')
            ->whereHas('photographerSessions', function ($q) use ($date) {
                $q->where('date', $date)->where('status', 'open');
            })
            ->get(['id', 'name']);

        $grid = [];
        if ($request->photographer_id) {
            $sessions = \App\Models\PhotographerSession::where('photographer_id', $request->photographer_id)
                ->where('date', $date)
                ->orderBy('start_time')
                ->get();

            // Format sessions for selection
            foreach ($sessions as $session) {
                $grid[] = [
                    'id' => $session->id,
                    'time' => Carbon::parse($session->start_time)->format('H:i'),
                    'status' => $session->status,
                    'block' => $session->block_identifier,
                ];
            }
        }

        return response()->json([
            'date' => $date,
            'max_sessions' => $maxSessions,
            'photographers' => $photographers,
            'sessions' => $grid,
        ]);
    }
}
