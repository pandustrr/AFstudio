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
        Schema::table('page_views', function (Blueprint $table) {
            // Hash dari IP + User Agent untuk identifikasi device
            $table->string('device_hash')->nullable()->index();
            // Tanggal view (tanpa jam) untuk tracking unique per hari
            $table->date('viewed_date')->nullable()->index();
            // Index kombinasi untuk query unique daily visitors
            $table->index(['page_name', 'device_hash', 'viewed_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('page_views', function (Blueprint $table) {
            $table->dropIndex(['page_name', 'device_hash', 'viewed_date']);
            $table->dropIndex(['device_hash']);
            $table->dropIndex(['viewed_date']);
            $table->dropColumn(['device_hash', 'viewed_date']);
        });
    }
};
