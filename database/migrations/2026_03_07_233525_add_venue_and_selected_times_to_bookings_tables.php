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
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('venue_name')->nullable()->after('location');
        });

        Schema::table('booking_items', function (Blueprint $table) {
            $table->json('selected_times')->nullable()->after('end_time');
        });

        Schema::table('carts', function (Blueprint $table) {
            $table->json('selected_times')->nullable()->after('sessions_needed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('venue_name');
        });

        Schema::table('booking_items', function (Blueprint $table) {
            $table->dropColumn('selected_times');
        });

        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn('selected_times');
        });
    }
};
