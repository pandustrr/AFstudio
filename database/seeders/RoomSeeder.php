<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            ['name' => 'room-1', 'label' => 'Room 1'],
            ['name' => 'room-2', 'label' => 'Room 2'],
            ['name' => 'room-3', 'label' => 'Room 3'],
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }
    }
}
