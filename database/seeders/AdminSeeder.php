<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin AFstudio',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'phone' => '6281230487469',
            ]
        );

        User::updateOrCreate(
            ['username' => 'editor'],
            [
                'name' => 'Editor AFstudio',
                'password' => Hash::make('editor123'),
                'role' => 'editor',
                'phone' => '6281234567890',
            ]
        );

        User::updateOrCreate(
            ['username' => 'photographer'],
            [
                'name' => 'Photographer AFstudio',
                'password' => Hash::make('photo123'),
                'role' => 'photographer',
                'phone' => '6281111111111',
            ]
        );
    }
}
