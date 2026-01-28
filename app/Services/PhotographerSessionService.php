<?php

namespace App\Services;

use App\Models\PhotographerSession;
use Carbon\Carbon;

class PhotographerSessionService
{
    /**
     * Generate default sessions for a photographer
     * Creates 'open' sessions for all time slots for the next N days
     * 
     * @param int $photographerId
     * @param int $daysAhead Number of days to generate (default 60)
     * @return int Total sessions created
     */
    public static function generateDefaultSessions($photographerId, $daysAhead = 60)
    {
        $times = self::getTimeSlots();
        $sessionsCreated = 0;

        // Generate sessions from today to N days ahead
        for ($dayOffset = 0; $dayOffset < $daysAhead; $dayOffset++) {
            $date = Carbon::now()->addDays($dayOffset)->toDateString();

            // Create sessions for each time slot
            foreach ($times as $time) {
                // Check if session already exists
                $exists = PhotographerSession::where('photographer_id', $photographerId)
                    ->where('date', $date)
                    ->where('start_time', $time . ':00')
                    ->exists();

                if (!$exists) {
                    PhotographerSession::create([
                        'photographer_id' => $photographerId,
                        'date' => $date,
                        'start_time' => $time . ':00',
                        'status' => 'open', // Default: TERSEDIA
                    ]);
                    $sessionsCreated++;
                }
            }
        }

        return $sessionsCreated;
    }

    /**
     * Get all available time slots
     * 
     * @return array
     */
    public static function getTimeSlots()
    {
        return [
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
        ];
    }

    /**
     * Extend sessions for a photographer (add more days ahead)
     * Useful for maintaining sessions as time passes
     * 
     * @param int $photographerId
     * @param int $daysToAdd
     * @return int Sessions created
     */
    public static function extendSessions($photographerId, $daysToAdd = 30)
    {
        // Find the latest date in existing sessions
        $latestSession = PhotographerSession::where('photographer_id', $photographerId)
            ->orderBy('date', 'desc')
            ->first();

        if (!$latestSession) {
            // No sessions exist, generate from today
            return self::generateDefaultSessions($photographerId, $daysToAdd);
        }

        $startDate = Carbon::parse($latestSession->date)->addDay();
        $times = self::getTimeSlots();
        $sessionsCreated = 0;

        for ($dayOffset = 0; $dayOffset < $daysToAdd; $dayOffset++) {
            $date = $startDate->copy()->addDays($dayOffset)->toDateString();

            foreach ($times as $time) {
                $exists = PhotographerSession::where('photographer_id', $photographerId)
                    ->where('date', $date)
                    ->where('start_time', $time . ':00')
                    ->exists();

                if (!$exists) {
                    PhotographerSession::create([
                        'photographer_id' => $photographerId,
                        'date' => $date,
                        'start_time' => $time . ':00',
                        'status' => 'open',
                    ]);
                    $sessionsCreated++;
                }
            }
        }

        return $sessionsCreated;
    }
}
