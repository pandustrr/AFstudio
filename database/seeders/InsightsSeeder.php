<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PageView;
use App\Models\Interaction;
use App\Models\User;
use Carbon\Carbon;

class InsightsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding PageViews and Interactions...');

        // Get some users (or create if not exist)
        $users = User::all();
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Creating sample users...');
            $users = collect([
                User::create([
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'customer',
                ]),
                User::create([
                    'name' => 'Jane Smith',
                    'email' => 'jane@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'customer',
                ]),
            ]);
        }

        // Sample pages
        $pages = [
            ['name' => 'Home', 'url' => 'http://127.0.0.1:8000'],
            ['name' => 'About', 'url' => 'http://127.0.0.1:8000/about'],
            ['name' => 'Pricelist', 'url' => 'http://127.0.0.1:8000/pricelist'],
            ['name' => 'Portfolio', 'url' => 'http://127.0.0.1:8000/portfolio'],
            ['name' => 'Gallery', 'url' => 'http://127.0.0.1:8000/gallery'],
        ];

        // Sample IPs and User Agents for diversity
        $ips = [
            '192.168.1.100',
            '192.168.1.101',
            '192.168.1.102',
            '10.0.0.50',
            '10.0.0.51',
            '172.16.0.10',
            '172.16.0.11',
        ];

        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ];

        // Generate PageViews for the last 30 days
        $startDate = Carbon::now()->subDays(30);
        $pageViewCount = 0;

        for ($day = 0; $day < 30; $day++) {
            $date = $startDate->copy()->addDays($day);

            // Random number of views per day (10-50)
            $viewsPerDay = rand(10, 50);

            for ($i = 0; $i < $viewsPerDay; $i++) {
                $page = $pages[array_rand($pages)];
                $ip = $ips[array_rand($ips)];
                $ua = $userAgents[array_rand($userAgents)];
                $deviceHash = md5($ip . $ua);

                // 30% chance user is logged in
                $user = (rand(1, 100) <= 30 && $users->isNotEmpty()) ? $users->random() : null;

                // Random time during the day
                $viewedAt = $date->copy()->addHours(rand(8, 22))->addMinutes(rand(0, 59));

                PageView::create([
                    'page_name' => $page['name'],
                    'url' => $page['url'],
                    'ip_address' => $ip,
                    'user_agent' => $ua,
                    'device_hash' => $deviceHash,
                    'viewed_date' => $viewedAt->toDateString(),
                    'viewed_at' => $viewedAt,
                    'user_id' => $user?->id,
                ]);

                $pageViewCount++;
            }
        }

        $this->command->info("Created {$pageViewCount} page views");

        // Generate Interactions
        $interactionTypes = [
            'category_view',
            'subcategory_view',
            'package_click',
            'contact_click',
            'form_submit',
        ];

        $categoryNames = [
            'Wedding Photography',
            'Pre-wedding Photography',
            'Birthday Photography',
            'Corporate Event',
            'Product Photography',
        ];

        $packageNames = [
            'Wedding Premium Package',
            'Wedding Standard Package',
            'Pre-wedding Outdoor',
            'Birthday Party Basic',
            'Corporate Event Full Day',
        ];

        $interactionCount = 0;

        for ($day = 0; $day < 30; $day++) {
            $date = $startDate->copy()->addDays($day);

            // Random number of interactions per day (5-25)
            $interactionsPerDay = rand(5, 25);

            for ($i = 0; $i < $interactionsPerDay; $i++) {
                $eventType = $interactionTypes[array_rand($interactionTypes)];
                $ip = $ips[array_rand($ips)];
                $ua = $userAgents[array_rand($userAgents)];
                $deviceHash = md5($ip . $ua);
                $user = (rand(1, 100) <= 30 && $users->isNotEmpty()) ? $users->random() : null;

                $createdAt = $date->copy()->addHours(rand(8, 22))->addMinutes(rand(0, 59));

                $itemName = null;
                $payload = null;

                // Set item name and payload based on event type
                switch ($eventType) {
                    case 'category_view':
                    case 'subcategory_view':
                        $itemName = $categoryNames[array_rand($categoryNames)];
                        break;
                    case 'package_click':
                        $itemName = $packageNames[array_rand($packageNames)];
                        $payload = ['mode' => rand(0, 1) ? 'photography' : 'videography'];
                        break;
                    case 'contact_click':
                        $itemName = rand(0, 1) ? 'WhatsApp Contact' : 'Email Contact';
                        $payload = ['mode' => rand(0, 1) ? 'whatsapp' : 'email'];
                        break;
                    case 'form_submit':
                        $itemName = 'Contact Form';
                        break;
                }

                Interaction::create([
                    'event_type' => $eventType,
                    'page_name' => $eventType === 'form_submit' ? 'Home' : 'Pricelist',
                    'url' => 'http://127.0.0.1:8000/' . ($eventType === 'form_submit' ? '' : 'pricelist'),
                    'item_id' => rand(1, 10),
                    'item_name' => $itemName,
                    'payload' => $payload,
                    'ip_address' => $ip,
                    'user_agent' => $ua,
                    'device_hash' => $deviceHash,
                    'user_id' => $user?->id,
                    'session_id' => 'session_' . uniqid(),
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                $interactionCount++;
            }
        }

        $this->command->info("Created {$interactionCount} interactions");
        $this->command->info('✅ Insights seeding completed!');
    }
}
