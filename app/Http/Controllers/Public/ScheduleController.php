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
     * For room packages: Returns available start times from room schedules
     * For photographer packages: Returns photographer sessions with 'open' status
     */
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'package_id' => 'required|exists:pricelist_packages,id',
        ]);

        try {
            $date = Carbon::parse($request->date)->toDateString();
            $package = PricelistPackage::with('subCategory.category')->findOrFail($request->package_id);
            $durationMinutes = $package->duration ?? 60;

            // Check if this is a photographer package or room package
            $isPhotographer = $package->subCategory?->category?->type === 'photographer';

            if ($isPhotographer) {
                // Fetch photographer sessions with 'open' status
                $sessionsNeeded = ceil($durationMinutes / 30);
                
                $sessions = \App\Models\PhotographerSession::where('date', $date)
                    ->where('status', 'open')
                    ->orderBy('photographer_id')
                    ->orderBy('start_time')
                    ->get(['id', 'photographer_id', 'start_time', 'status']);

                // Group by photographer and find who has consecutive available slots
                $photographerSlots = $sessions->groupBy('photographer_id');
                $availableSlots = [];

                foreach ($photographerSlots as $photographerId => $slots) {
                    $slotTimes = $slots->pluck('start_time')->map(function($time) {
                        return substr($time, 0, 5); // H:i format
                    })->toArray();

                    // Find consecutive slots that match duration needed
                    foreach ($slotTimes as $index => $startTime) {
                        $isConsecutive = true;
                        $endIndex = $index + $sessionsNeeded;
                        
                        if ($endIndex <= count($slotTimes)) {
                            for ($i = $index; $i < $endIndex; $i++) {
                                $expectedTime = Carbon::createFromFormat('H:i', $slotTimes[$index])
                                    ->addMinutes(($i - $index) * 30)
                                    ->format('H:i');
                                
                                if ($slotTimes[$i] !== $expectedTime) {
                                    $isConsecutive = false;
                                    break;
                                }
                            }

                            if ($isConsecutive) {
                                $availableSlots[] = [
                                    'start_time' => $startTime,
                                    'photographer_id' => $photographerId,
                                    'sessions_needed' => $sessionsNeeded,
                                ];
                            }
                        }
                    }
                }

                return response()->json([
                    'date' => $date,
                    'package_type' => 'photographer',
                    'duration_minutes' => $durationMinutes,
                    'sessions_needed' => $sessionsNeeded,
                    'available_slots' => array_values(array_unique($availableSlots, SORT_REGULAR)),
                ]);
            } else {
                // Room package: fetch from RoomSchedule
                $allRooms = \App\Models\Room::all();
                $dayOfWeek = Carbon::parse($date)->dayOfWeek;

                $schedules = \App\Models\RoomSchedule::whereIn('room_id', $allRooms->pluck('id'))
                    ->where(function ($q) use ($date, $dayOfWeek) {
                        $q->where('date', $date)
                            ->orWhere(function ($q2) use ($dayOfWeek) {
                                $q2->whereNull('date')->where('day_of_week', $dayOfWeek);
                            });
                    })->get()->groupBy('room_id');

                $allRoomAvailability = [];
                foreach ($allRooms as $room) {
                    $roomSchedules = isset($schedules[$room->id]) ? $schedules[$room->id] : collect();
                    $activeSchedules = $roomSchedules->where('date', $date);
                    
                    if ($activeSchedules->isEmpty()) {
                        $activeSchedules = $roomSchedules->whereNull('date')->where('day_of_week', $dayOfWeek);
                    }

                    $windows = [];
                    if ($activeSchedules->isNotEmpty()) {
                        foreach ($activeSchedules as $sched) {
                            if ($sched->is_active) {
                                $start = Carbon::parse($date . ' ' . $sched->start_time);
                                $end = Carbon::parse($date . ' ' . $sched->end_time);
                                $windows[] = ['start' => $start, 'end' => $end];
                            }
                        }
                    }

                    $allRoomAvailability[$room->id] = $windows;
                }

                // Get booked slots
                $bookedSlots = BookingItem::whereHas('booking', function ($q) {
                    $q->whereIn('status', ['pending', 'confirmed', 'completed']);
                })
                    ->whereDate('scheduled_date', $date)
                    ->get(['start_time', 'end_time', 'room_id']);

                $availableStartTimes = [];
                foreach ($allRooms as $room) {
                    $windows = $allRoomAvailability[$room->id] ?? [];

                    foreach ($windows as $window) {
                        $currentSlot = $window['start']->copy();

                        while ($currentSlot->copy()->addMinutes($durationMinutes)->lte($window['end'])) {
                            $slotEnd = $currentSlot->copy()->addMinutes($durationMinutes);

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
                    'date' => $date,
                    'package_type' => 'room',
                    'duration' => $durationMinutes,
                    'available_slots' => $availableStartTimes,
                ]);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Schedule Check Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get available time slots for photographer booking (without selecting specific photographer)
     * Returns all time slots in operational hours
     */
    public function getPhotographerTimeSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'package_id' => 'required|exists:pricelist_packages,id',
        ]);

        $date = Carbon::parse($request->date)->toDateString();
        $package = PricelistPackage::with('subCategory.category')->findOrFail($request->package_id);
        
        if ($package->subCategory?->category?->type !== 'photographer') {
            return response()->json(['error' => 'Package is not photographer type'], 400);
        }

        $maxSessions = $package->max_sessions ?? 1;

        // Generate all operational time slots (05:00 - 20:00, every 30 minutes)
        $timeSlots = [];
        $start = Carbon::createFromTimeString('05:00');
        $end = Carbon::createFromTimeString('20:00');
        
        while ($start <= $end) {
            $timeSlots[] = $start->format('H:i');
            $start->addMinutes(30);
        }

        return response()->json([
            'time_slots' => $timeSlots,
            'max_sessions' => $maxSessions,
        ]);
    }

    /**
     * Get available rooms for a specific date (rooms where photographers have open sessions)
     */
    public function getAvailableRooms(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'package_id' => 'required|exists:pricelist_packages,id',
        ]);

        $date = Carbon::parse($request->date)->toDateString();
        
        // Find rooms (room_name) from photographers who have 'open' sessions on this date
        $rooms = \App\Models\User::where('role', 'photographer')
            ->whereHas('sessions', function($query) use ($date) {
                $query->where('date', $date)
                    ->where('status', 'open');
            })
            ->whereNotNull('room_name')
            ->pluck('room_name')
            ->unique()
            ->values()
            ->all();

        return response()->json([
            'rooms' => $rooms
        ]);
    }

    /**
     * Check if photographer is available for specific time slot
     * Auto-find photographer with consecutive open sessions
     */
    public function checkPhotographerAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required',
            'sessions_needed' => 'required|integer|min:1',
            'package_id' => 'required|exists:pricelist_packages,id',
            'room_name' => 'nullable|string',
        ]);

        $date = Carbon::parse($request->date)->toDateString();
        $startTime = $request->start_time; // Format: H:i
        $sessionsNeeded = $request->sessions_needed;
        $roomName = $request->room_name;

        // Generate consecutive time slots needed (convert H:i to H:i:s for database queries)
        $slots = [];
        $time = Carbon::createFromFormat('H:i', $startTime);
        for ($i = 0; $i < $sessionsNeeded; $i++) {
            $slots[] = $time->format('H:i:s');
            $time->addMinutes(30);
        }

        // Find photographer who has ALL these slots available (open status)
        $query = \App\Models\User::where('role', 'photographer')
            ->whereHas('sessions', function($query) use ($date, $slots) {
                $query->where('date', $date)
                    ->whereIn('start_time', $slots)
                    ->where('status', 'open');
            }, '=', count($slots));

        if ($roomName) {
            $query->where('room_name', $roomName);
        }

        $photographer = $query->first();
        $available = $photographer !== null;

        return response()->json([
            'available' => $available,
            'photographer_id' => $available ? $photographer->id : null,
            'slots_checked' => $slots,
        ]);
    }

    /**
     * Check if photographer/room is available for specific start time
     */
    public function checkTimeAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'package_id' => 'required|exists:pricelist_packages,id',
            'cart_uid' => 'nullable|string',
            'room_name' => 'nullable|string',
        ]);

        try {
            $date = Carbon::parse($request->date)->toDateString();
            $startTime = $request->start_time; // H:i format
            $endTime = $request->end_time; // H:i format (from frontend for rooms)
            $package = PricelistPackage::with('subCategory.category')->findOrFail($request->package_id);
            $durationMinutes = $package->duration ?? 60;
            $isPhotographer = $package->subCategory?->category?->type === 'photographer';

            if ($isPhotographer) {
                // Check if photographer has consecutive open sessions for this duration
                $sessionsNeeded = ceil($durationMinutes / 30);
                
                // Generate required time slots (H:i:s format for DB query)
                $slots = [];
                $time = Carbon::createFromFormat('H:i', $startTime);
                for ($i = 0; $i < $sessionsNeeded; $i++) {
                    $slots[] = $time->format('H:i:s');
                    $time->addMinutes(30);
                }

                // Get session IDs already in cart with same cart_uid (to exclude them)
                $cartSessionIds = [];
                if ($request->cart_uid) {
                    $cartsWithSessions = \App\Models\Cart::where('cart_uid', $request->cart_uid)
                        ->whereNotNull('session_ids')
                        ->get();
                    
                    foreach ($cartsWithSessions as $cart) {
                        $sessionIds = $cart->session_ids ?? [];
                        $cartSessionIds = array_merge($cartSessionIds, $sessionIds);
                    }
                }

                // Find photographer with ALL slots available (excluding sessions already in cart)
                $query = \App\Models\User::where('role', 'photographer')
                    ->whereHas('sessions', function($query) use ($date, $slots, $cartSessionIds) {
                        $query->where('date', $date)
                            ->whereIn('start_time', $slots)
                            ->where('status', 'open');
                        
                        // Exclude sessions already in customer's cart
                        if (!empty($cartSessionIds)) {
                            $query->whereNotIn('id', $cartSessionIds);
                        }
                    }, '=', count($slots));

                if ($request->room_name) {
                    $query->where('room_name', $request->room_name);
                }

                $photographer = $query->first();

                return response()->json([
                    'available' => $photographer !== null,
                    'photographer_id' => $photographer?->id,
                ]);
            } else {
                // For room booking, use customer-provided end_time or calculate from duration
                $endTimeFormatted = $endTime 
                    ? $endTime . ':00'
                    : Carbon::createFromFormat('H:i', $startTime)->addMinutes($durationMinutes)->format('H:i:s');
                $startTimeFormatted = $startTime . ':00';

                // Check room schedules
                $dayOfWeek = Carbon::parse($date)->dayOfWeek;
                $schedules = \App\Models\RoomSchedule::where(function($q) use ($date, $dayOfWeek) {
                    $q->where('date', $date)->orWhere(function($q2) use ($dayOfWeek) {
                        $q2->whereNull('date')->where('day_of_week', $dayOfWeek);
                    });
                })
                ->where('is_active', true)
                ->get();

                // Check if requested time falls within any active schedule window
                $isInWindow = false;
                foreach ($schedules as $sched) {
                    if ($startTimeFormatted >= $sched->start_time && $endTime <= $sched->end_time) {
                        $isInWindow = true;
                        break;
                    }
                }

                if (!$isInWindow) {
                    return response()->json(['available' => false]);
                }

                // Check for booking conflicts
                $conflict = BookingItem::whereHas('booking', function($q) {
                    $q->whereIn('status', ['pending', 'confirmed', 'completed']);
                })
                    ->whereDate('scheduled_date', $date)
                    ->where(function($q) use ($startTimeFormatted, $endTime) {
                        $q->whereBetween('start_time', [$startTimeFormatted, $endTime])
                            ->orWhereBetween('end_time', [$startTimeFormatted, $endTime])
                            ->orWhere(function($q2) use ($startTimeFormatted, $endTime) {
                                $q2->where('start_time', '<=', $startTimeFormatted)
                                    ->where('end_time', '>=', $endTime);
                            });
                    })
                    ->exists();

                return response()->json(['available' => !$conflict]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
