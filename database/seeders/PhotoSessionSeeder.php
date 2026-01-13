<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PhotoSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\PhotoSession::updateOrCreate(
            ['uid' => 'AF-TEST-001'],
            [
                'customer_name' => 'User Dummy',
                'raw_folder_id' => '19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI', // Test folder
                'edited_folder_id' => null,
                'max_edit_requests' => 20,
                'status' => 'pending',
            ]
        );
    }
}
