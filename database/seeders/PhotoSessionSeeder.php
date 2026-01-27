<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PhotographerSession;
use App\Models\User;
use App\Services\PhotographerSessionService;
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

        // Generate default sessions for ALL photographers (60 days ahead, all 'open')
        $photographers = User::where('role', 'photographer')->get();

        if ($photographers->isEmpty()) {
            echo "No photographers found. Please create photographers first.\n";
            return;
        }

        foreach ($photographers as $photographer) {
            echo "Generating sessions for: {$photographer->name}\n";

            // Generate 60 days of sessions with status 'open' (available)
            $sessionsCreated = PhotographerSessionService::generateDefaultSessions($photographer->id, 60);

            echo "  ✓ Created {$sessionsCreated} sessions (all available by default)\n";
        }

        echo "\n✅ All photographers now have 60 days of available sessions!\n";
    }
}
