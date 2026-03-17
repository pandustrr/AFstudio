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
            $table->string('stat1_value')->nullable()->default('2+');
            $table->string('stat1_label')->nullable()->default('Total Booking');
            $table->string('stat1_desc')->nullable()->default('Momen berharga yang telah kami abadikan.');
            
            $table->string('stat2_value')->nullable()->default('1+');
            $table->string('stat2_label')->nullable()->default('Pilihan Paket');
            $table->string('stat2_desc')->nullable()->default('Pilihan paket menarik yang kami sediakan.');
            
            $table->string('stat3_value')->nullable()->default('5');
            $table->string('stat3_label')->nullable()->default('Rating Klien');
            $table->string('stat3_desc')->nullable()->default('Hasil akhir yang memuaskan dari para klien.');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_pages', function (Blueprint $table) {
            $table->dropColumn([
                'stat1_value', 'stat1_label', 'stat1_desc',
                'stat2_value', 'stat2_label', 'stat2_desc',
                'stat3_value', 'stat3_label', 'stat3_desc'
            ]);
        });
    }
};
