<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomSchedule;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RoomScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // Get all rooms
        $rooms = Room::all();

        if ($rooms->isEmpty()) {
            $this->command->warn('No rooms found. Please seed rooms first.');
            return;
        }

        // Create weekly recurring schedules for each room
        // 09:00 - 18:00, Monday to Sunday (all days)
        foreach ($rooms as $room) {
            for ($dayOfWeek = 0; $dayOfWeek < 7; $dayOfWeek++) { // 0=Sunday, 6=Saturday
                RoomSchedule::create([
                    'room_id' => $room->id,
                    'day_of_week' => $dayOfWeek,
                    'date' => null, // null = recurring weekly
                    'start_time' => '09:00:00',
                    'end_time' => '18:00:00',
                    'is_active' => true,
                ]);
            }
        }

        $this->command->info('Room schedules seeded successfully! All rooms: 09:00-18:00 every day');
    }
}
