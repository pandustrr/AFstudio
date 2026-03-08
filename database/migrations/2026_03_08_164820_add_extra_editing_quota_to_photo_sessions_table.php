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
        Schema::table('photo_sessions', function (Blueprint $table) {
            $table->integer('extra_editing_quota')->default(0)->after('quota_request');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photo_sessions', function (Blueprint $table) {
            $table->dropColumn('extra_editing_quota');
        });
    }
};
