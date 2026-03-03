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
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->dropForeign(['room_id']);
            $blueprint->dropColumn('room_id');
            $blueprint->string('room_name')->nullable()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->dropColumn('room_name');
            $blueprint->unsignedBigInteger('room_id')->nullable()->after('phone');
            $blueprint->foreign('room_id')->references('id')->on('rooms')->onDelete('set null');
        });
    }
};
