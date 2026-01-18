<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Room;
use App\Models\PricelistPackage;
use Carbon\Carbon;

class DummyBookingSeeder extends Seeder
{
    public function run(): void
    {
        // cleanup old dummy
        Booking::where('name', 'Budi Santoso')->delete();

        $room = Room::first();
        if (!$room) {
            $room = Room::create(['name' => 'room-1', 'label' => 'Room 1']);
        }

        $package = PricelistPackage::first();
        if (!$package) {
            // fallback if no package
            return;
        }

        $scheduledDate = now()->addDays(7);

        $booking = Booking::create([
            'name' => 'Budi Santoso',
            'phone' => '08123456789',
            'university' => 'Universitas Jember',
            'domicile' => 'Jember',
            'booking_date' => $scheduledDate->format('Y-m-d'), // date of event
            'location' => 'Studio AF',
            'total_price' => $package->price_numeric,
            'status' => 'pending',
            'guest_uid' => uniqid('guest_'),
        ]);

        BookingItem::create([
            'booking_id' => $booking->id,
            'pricelist_package_id' => $package->id,
            'quantity' => 1,
            'price' => $package->price_numeric,
            'subtotal' => $package->price_numeric,
            'scheduled_date' => $scheduledDate->format('Y-m-d'),
            'start_time' => '10:00',
            'end_time' => '11:00',
            'room_id' => $room->id,
        ]);

        $this->command->info("Dummy Booking Created!");
        $this->command->info("Link: http://127.0.0.1:8000/booking/" . $booking->booking_code);
    }
}
