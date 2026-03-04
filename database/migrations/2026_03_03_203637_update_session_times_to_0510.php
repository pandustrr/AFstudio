<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Shift photographer_sessions start_time by 10 minutes
        DB::statement("UPDATE photographer_sessions SET start_time = DATE_ADD(start_time, INTERVAL 10 MINUTE)");

        // Shift booking_items start_time and end_time by 10 minutes for photography packages
        // Assuming photography packages are those without a room_id or we filter by category if possible
        // Actually, better to shift all if they were all following the 30-min block starting at 05:00
        DB::statement("UPDATE booking_items SET start_time = DATE_ADD(start_time, INTERVAL 10 MINUTE), end_time = DATE_ADD(end_time, INTERVAL 10 MINUTE)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("UPDATE photographer_sessions SET start_time = DATE_SUB(start_time, INTERVAL 10 MINUTE)");
        DB::statement("UPDATE booking_items SET start_time = DATE_SUB(start_time, INTERVAL 10 MINUTE), end_time = DATE_SUB(end_time, INTERVAL 10 MINUTE)");
    }
};
