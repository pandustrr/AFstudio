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
        Schema::table('photographer_sessions', function (Blueprint $table) {
            $table->time('override_start_time')->nullable()->after('offset_description');
            $table->time('override_end_time')->nullable()->after('override_start_time');
            $table->boolean('is_customized')->default(false)->after('override_end_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photographer_sessions', function (Blueprint $table) {
            $table->dropColumn(['override_start_time', 'override_end_time', 'is_customized']);
        });
    }
};
