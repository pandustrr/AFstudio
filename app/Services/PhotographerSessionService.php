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
            '05:10',
            '05:40',
            '06:10',
            '06:40',
            '07:10',
            '07:40',
            '08:10',
            '08:40',
            '09:10',
            '09:40',
            '10:10',
            '10:40',
            '11:10',
            '11:40',
            '12:10',
            '12:40',
            '13:10',
            '13:40',
            '14:10',
            '14:40',
            '15:10',
            '15:40',
            '16:10',
            '16:40',
            '17:10',
            '17:40',
            '18:10',
            '18:40',
            '19:10',
            '19:40',
            '20:10',
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
