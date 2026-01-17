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
        try {
            \Illuminate\Support\Facades\Log::info('Schedule Check Request:', $request->all());

            $request->validate([
                'date' => 'required|date|after_or_equal:today',
                'package_id' => 'required|exists:pricelist_packages,id',
                'room_id' => 'nullable|integer|in:1,2,3',
            ]);

            $date = Carbon::parse($request->date);
            $package = PricelistPackage::findOrFail($request->package_id);
            $durationMinutes = $package->duration ?? 60;
            $requestedRoomId = $request->room_id; // Added room_id support

            // Operating Hours
            $startOfDay = $date->copy()->setTime(9, 0, 0); // 09:00
            $endOfDay = $date->copy()->setTime(17, 0, 0); // 17:00

            // Get all booked slots for this date
            $query = BookingItem::whereHas('booking', function ($q) {
                    $q->whereIn('status', ['pending', 'confirmed', 'completed']);
                })
                ->whereDate('scheduled_date', $date->toDateString());
            
            // If specific room requested, filter by it
            if ($requestedRoomId) {
                $query->where('room_id', $requestedRoomId);
            }

            $bookedSlots = $query->get(['start_time', 'end_time', 'room_id']);

            \Illuminate\Support\Facades\Log::info('Booked Slots:', $bookedSlots->toArray());

            // Generate time slots
            $interval = 30;
            $availableStartTimes = [];

            $currentSlot = $startOfDay->copy();

            while ($currentSlot->copy()->addMinutes($durationMinutes)->lte($endOfDay)) {
                
                $checkTime = $currentSlot->copy();
                $endTime = $currentSlot->copy()->addMinutes($durationMinutes);

                // If room_id is specified, we ONLY check that room
                if ($requestedRoomId) {
                    $isRoomTaken = $bookedSlots->filter(function ($booking) use ($currentSlot, $endTime, $requestedRoomId) {
                        $bStart = Carbon::parse($booking->start_time);
                        $bEnd = Carbon::parse($booking->end_time);
                        return $bStart->lt($endTime) && $bEnd->gt($currentSlot);
                    })->isNotEmpty();

                    if (!$isRoomTaken) {
                        $availableStartTimes[] = $currentSlot->format('H:i');
                    }
                } else {
                    // Legend logic: check if ANY room is available
                    $rooms = [1, 2, 3];
                    $anyRoomAvailable = false;
                    foreach ($rooms as $roomId) {
                        $isTaken = $bookedSlots->filter(function ($booking) use ($currentSlot, $endTime, $roomId) {
                            if ($booking->room_id != $roomId) return false;
                            $bStart = Carbon::parse($booking->start_time);
                            $bEnd = Carbon::parse($booking->end_time);
                            return $bStart->lt($endTime) && $bEnd->gt($currentSlot);
                        })->isNotEmpty();

                        if (!$isTaken) {
                            $anyRoomAvailable = true;
                            break;
                        }
                    }
                    if ($anyRoomAvailable) {
                        $availableStartTimes[] = $currentSlot->format('H:i');
                    }
                }

                $currentSlot->addMinutes($interval);
            }

            return response()->json([
                'date' => $date->toDateString(),
                'duration' => $durationMinutes,
                'room_id' => $requestedRoomId,
                'available_slots' => $availableStartTimes,
                'operating_hours' => [
                    'start' => '09:00',
                    'end' => '17:00'
                ]
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Schedule Check Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
