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
                'email' => 'admin@afstudio.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['username' => 'editor'],
            [
                'name' => 'Editor AFstudio',
                'email' => 'editor@afstudio.com',
                'password' => Hash::make('editor123'),
                'role' => 'editor',
            ]
        );

        User::updateOrCreate(
            ['username' => 'photographer'],
            [
                'name' => 'Photographer AFstudio',
                'email' => 'photographer@afstudio.com',
                'password' => Hash::make('photo123'),
                'role' => 'photographer',
            ]
        );
    }
}
