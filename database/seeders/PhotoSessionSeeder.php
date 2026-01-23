<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PhotographerSession;
use App\Models\User;
use Carbon\Carbon;

class PhotoSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\PhotoEditing::updateOrCreate(
            ['uid' => 'AF-' . rand(10000, 99999)],
            [
                'customer_name' => 'User Dummy',
                'raw_folder_id' => '19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI', // Test folder
                'edited_folder_id' => null,
                'status' => 'pending',
            ]
        );

        // Create photographer sessions for next 30 days
        $photographer = User::where('role', 'photographer')->first();
        if ($photographer) {
            $times = [
                '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
                '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
            ];

            // Create sessions for next 30 days (starting tomorrow)
            for ($dayOffset = 1; $dayOffset <= 30; $dayOffset++) {
                $date = Carbon::now()->addDays($dayOffset)->toDateString();
                
                // Delete existing sessions for this date first
                PhotographerSession::where('photographer_id', $photographer->id)
                    ->where('date', $date)
                    ->delete();

                // Create sessions for each time slot
                foreach ($times as $time) {
                    PhotographerSession::create([
                        'photographer_id' => $photographer->id,
                        'date' => $date,
                        'start_time' => $time . ':00',
                        'status' => 'open',
                    ]);
                }
            }

            $totalSessions = count($times) * 30;
            echo "Photographer sessions created for {$photographer->name}: {$totalSessions} sessions for next 30 days\n";
        }
    }
}
