<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BookingItem;
use App\Models\PricelistPackage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
                    $slotTimes = $slots->pluck('start_time')->map(function ($time) {
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

        // Generate all operational time slots (05:10 - 20:10, every 30 minutes)
        $timeSlots = [];
        $start = Carbon::createFromTimeString('05:10');
        $end = Carbon::createFromTimeString('20:10');

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

        // Find rooms from photographers who don't have all sessions marked as 'off' for this date
        // Actually, just returning all rooms with photographers is simpler and safer.
        $rooms = \App\Models\User::where('role', 'photographer')
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

        // Find photographer who DOES NOT have any conflicts (booked or off)
        $query = \App\Models\User::where('role', 'photographer')
            ->whereDoesntHave('sessions', function ($query) use ($date, $slots) {
                $query->where('date', $date)
                    ->whereIn('start_time', $slots)
                    ->whereIn('status', ['booked', 'off']);
            });

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
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'package_id' => 'required|exists:pricelist_packages,id',
            'cart_uid' => 'nullable|string',
            'room_name' => 'nullable|string',
            'selected_times' => 'nullable|array', // For split session
        ]);

        try {
            $date = Carbon::parse($request->date)->toDateString();
            $startTime = $request->start_time; // H:i format
            $endTime = $request->end_time; // H:i format (from frontend for rooms)
            $package = PricelistPackage::with('subCategory.category')->findOrFail($request->package_id);
            $durationMinutes = $package->duration ?? 60;
            $isPhotographer = $package->subCategory?->category?->type === 'photographer';

            if ($isPhotographer) {
                // If selected_times is provided (Split Session), use it
                // Otherwise calculate consecutive slots (Traditional)
                if ($request->has('selected_times') && !empty($request->selected_times)) {
                    $slots = collect($request->selected_times)->map(function ($t) {
                        return Carbon::createFromFormat('H:i', $t)->format('H:i:s');
                    })->toArray();
                } else {
                    $sessionsNeeded = ceil($durationMinutes / 30);
                    $slots = [];
                    $time = Carbon::createFromFormat('H:i', $startTime);
                    for ($i = 0; $i < $sessionsNeeded; $i++) {
                        $slots[] = $time->format('H:i:s');
                        $time->addMinutes(30);
                    }
                }

                // Find photographer who DOES NOT have any conflicts (booked or off)
                $query = \App\Models\User::where('role', 'photographer');

                if ($request->room_name) {
                    $query->where('room_name', $request->room_name);
                }

                $query->whereDoesntHave('sessions', function ($query) use ($date, $slots) {
                    $query->where('date', $date)
                        ->whereIn('start_time', $slots)
                        ->whereIn('status', ['booked', 'off']);
                });

                $photographer = $query->first();

                // Optional: Check if these sessions are already in this user's cart (for UI notice)
                $inCart = false;
                if ($request->cart_uid || Auth::check()) {
                    $inCartQuery = \App\Models\Cart::query();
                    
                    if (Auth::check()) {
                        $inCartQuery->where(function($q) use ($request) {
                            $q->where('user_id', Auth::id());
                            if ($request->cart_uid) {
                                $q->orWhere('cart_uid', $request->cart_uid);
                            }
                        });
                    } else {
                        $inCartQuery->where('cart_uid', $request->cart_uid);
                    }

                    $inCart = $inCartQuery->where('scheduled_date', $date)
                        ->where('photographer_id', $photographer->id)
                        ->where('pricelist_package_id', $request->package_id) // Match specific package
                        ->where('is_direct', false) // Only check regular cart items
                        ->where(function($q) use ($slots) {
                            if (empty($slots)) {
                                $q->whereRaw('1=0'); // Force false if no slots provided
                            } else {
                                foreach($slots as $slot) {
                                    $q->orWhereJsonContains('selected_times', substr($slot, 0, 5));
                                }
                            }
                        })
                        ->exists();
                }

                return response()->json([
                    'available' => $photographer !== null,
                    'photographer_id' => $photographer?->id,
                    'in_cart' => $inCart,
                ]);
            } else {
                // For room booking, use customer-provided end_time or calculate from duration
                $endTimeFormatted = $endTime
                    ? $endTime . ':00'
                    : Carbon::createFromFormat('H:i', $startTime)->addMinutes($durationMinutes)->format('H:i:s');
                $startTimeFormatted = $startTime . ':00';

                // Check room schedules
                $dayOfWeek = Carbon::parse($date)->dayOfWeek;
                $schedules = \App\Models\RoomSchedule::where(function ($q) use ($date, $dayOfWeek) {
                    $q->where('date', $date)->orWhere(function ($q2) use ($dayOfWeek) {
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
                $conflict = BookingItem::whereHas('booking', function ($q) {
                    $q->whereIn('status', ['pending', 'confirmed', 'completed']);
                })
                    ->whereDate('scheduled_date', $date)
                    ->where(function ($q) use ($startTimeFormatted, $endTime) {
                        $q->whereBetween('start_time', [$startTimeFormatted, $endTime])
                            ->orWhereBetween('end_time', [$startTimeFormatted, $endTime])
                            ->orWhere(function ($q2) use ($startTimeFormatted, $endTime) {
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

    /**
     * Get session grid for a specific room and date
     */
    public function getRoomSessionGrid(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'room_name' => 'required|string',
            'package_id' => 'required|exists:pricelist_packages,id',
        ]);

        $date = Carbon::parse($request->date)->toDateString();
        $roomName = $request->room_name;
        $packageId = $request->package_id;

        // Find photographer for this room
        $photographer = \App\Models\User::where('role', 'photographer')
            ->where('room_name', $roomName)
            ->first();

        if (!$photographer) {
            return response()->json(['error' => 'No photographer assigned to this room'], 404);
        }

        $sessions = \App\Models\PhotographerSession::where('date', $date)
            ->where('photographer_id', $photographer->id)
            ->with(['bookingItem.booking', 'bookingItem.package'])
            ->orderBy('start_time')
            ->get();

        // Use same logic as admin grid but simplified for customer
        $grid = $this->generateSessionGrid($date, $sessions);

        return response()->json([
            'date' => $date,
            'room_name' => $roomName,
            'photographer_id' => $photographer->id,
            'grid' => $grid
        ]);
    }

    private function generateSessionGrid($date, $existingSessions)
    {
        $grid = [];
        $existingByTime = $existingSessions->keyBy('start_time');

        $start = Carbon::createFromTimeString('05:10');
        $end = Carbon::createFromTimeString('20:10');

        $cumulativeOffset = 0;

        while ($start <= $end) {
            $timeString = $start->format('H:i:s');
            $session = $existingByTime->get($timeString);
            $status = 'open'; // Default status if no session exists

            if ($session) {
                $status = $session->status; // Use the actual status from the session record
                // Offset persists and accumulates through booked and open sessions
                if ($status === 'booked' || $status === 'open') {
                    $cumulativeOffset += ($session->offset_minutes ?? 0);
                } else {
                    $cumulativeOffset = 0; // Reset on 'off'
                }
            }

            $grid[] = [
                'time' => $start->format('H:i'),
                'time_full' => $timeString,
                'status' => $status, // Return the actual status (open, booked, off)
                'session_id' => $session ? $session->id : null,
                'booking_item_id' => $session ? $session->booking_item_id : null,
                'booking_status' => $session && $session->bookingItem ? $session->bookingItem->booking->status : null,
                'booking_info' => $session && $session->bookingItem && $session->bookingItem->booking->status === 'confirmed' ? [
                    'customer_name' => $session->bookingItem->booking->name ?? 'GUEST',
                    'package_name' => $session->bookingItem->package->name ?? 'N/A',
                ] : null,
                'offset_minutes' => $session ? $session->offset_minutes : 0,
                'cumulative_offset' => $cumulativeOffset,
                'offset_description' => $session ? $session->offset_description : '',
                'override_start_time' => $session && $session->override_start_time ? substr($session->override_start_time, 0, 5) : null,
                'override_end_time' => $session && $session->override_end_time ? substr($session->override_end_time, 0, 5) : null,
                'is_customized' => $session ? $session->is_customized : false,
            ];

            $start->addMinutes(30);
        }

        return $grid;
    }
}
