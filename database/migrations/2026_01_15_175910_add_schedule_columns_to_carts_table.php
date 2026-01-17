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
        Schema::table('carts', function (Blueprint $table) {
            $table->date('scheduled_date')->nullable()->after('quantity');
            $table->time('start_time')->nullable()->after('scheduled_date');
            $table->time('end_time')->nullable()->after('start_time');
            $table->integer('room_id')->nullable()->after('end_time')->comment('1, 2, or 3');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            //
        });
    }
};
