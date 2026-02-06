<?php

namespace Database\Seeders;

use App\Models\JourneyStep;
use Illuminate\Database\Seeder;

class JourneyStepSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $steps = [
            [
                'step_number' => '01',
                'title' => 'Konsultasi',
                'description' => 'Mendiskusikan visi, gaya, dan esensi yang ingin Anda abadikan.',
                'order' => 1,
            ],
            [
                'step_number' => '02',
                'title' => 'Produksi',
                'description' => 'Sesi profesional dengan arahan artistik penuh.',
                'order' => 2,
            ],
            [
                'step_number' => '03',
                'title' => 'Mahakarya',
                'description' => 'Proses editing premium untuk hasil akhir yang abadi.',
                'order' => 3,
            ],
        ];

        foreach ($steps as $step) {
            JourneyStep::firstOrCreate(
                ['step_number' => $step['step_number']],
                $step
            );
        }
    }
}
