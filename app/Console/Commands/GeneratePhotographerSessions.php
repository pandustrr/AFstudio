<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Services\PhotographerSessionService;

class GeneratePhotographerSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'photographer:generate-sessions 
                            {photographer_id? : ID of specific photographer (optional)}
                            {--days=60 : Number of days to generate}
                            {--extend : Extend existing sessions instead of generating from today}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate default available sessions for photographers';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $photographerId = $this->argument('photographer_id');
        $days = $this->option('days');
        $extend = $this->option('extend');

        if ($photographerId) {
            // Generate for specific photographer
            $photographer = User::where('role', 'photographer')->find($photographerId);

            if (!$photographer) {
                $this->error("Photographer with ID {$photographerId} not found!");
                return 1;
            }

            $this->info("Generating sessions for: {$photographer->name}");

            if ($extend) {
                $sessionsCreated = PhotographerSessionService::extendSessions($photographer->id, $days);
                $this->info("✓ Extended {$sessionsCreated} sessions");
            } else {
                $sessionsCreated = PhotographerSessionService::generateDefaultSessions($photographer->id, $days);
                $this->info("✓ Created {$sessionsCreated} sessions");
            }
        } else {
            // Generate for all photographers
            $photographers = User::where('role', 'photographer')->get();

            if ($photographers->isEmpty()) {
                $this->warn('No photographers found!');
                return 0;
            }

            $this->info("Found {$photographers->count()} photographer(s)");
            $bar = $this->output->createProgressBar($photographers->count());
            $bar->start();

            $totalSessions = 0;
            foreach ($photographers as $photographer) {
                if ($extend) {
                    $sessionsCreated = PhotographerSessionService::extendSessions($photographer->id, $days);
                } else {
                    $sessionsCreated = PhotographerSessionService::generateDefaultSessions($photographer->id, $days);
                }
                $totalSessions += $sessionsCreated;
                $bar->advance();
            }

            $bar->finish();
            $this->newLine(2);
            $this->info("✅ Generated {$totalSessions} total sessions for {$photographers->count()} photographer(s)");
        }

        return 0;
    }
}
