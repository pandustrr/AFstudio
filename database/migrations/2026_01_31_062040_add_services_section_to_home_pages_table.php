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
        Schema::table('home_pages', function (Blueprint $table) {
            $table->string('services_title')->nullable()->default('LAYANAN YANG MENGINSPIRASI.');
            $table->string('services_subtitle')->nullable()->default('Layanan Pilihan');
            $table->text('services_description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_pages', function (Blueprint $table) {
            $table->dropColumn(['services_title', 'services_subtitle', 'services_description']);
        });
    }
};
