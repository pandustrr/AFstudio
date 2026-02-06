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
            $table->string('contact_label')->nullable()->default('Hubungi Kami');
            $table->string('contact_title')->nullable()->default('HADIRKAN VISI ANDA.');
            $table->text('contact_description')->nullable();
            $table->string('operation_title')->nullable()->default('Waktu Operasional');
            $table->string('operation_days')->nullable()->default('Senin — Minggu');
            $table->string('operation_hours')->nullable()->default('09:00 — 21:00 WIB');
            $table->string('response_title')->nullable()->default('Respon Cepat');
            $table->string('response_method')->nullable()->default('WhatsApp Priority');
            $table->string('response_time')->nullable()->default('Rata-rata < 15 Menit');
            $table->string('contact_form_title')->nullable()->default('Pesan Anda');
            $table->string('contact_form_placeholder')->nullable()->default('Ceritakan sedikit tentang visi Anda...');
            $table->string('contact_button_text')->nullable()->default('Kirim Pesan Sekarang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_pages', function (Blueprint $table) {
            $table->dropColumn([
                'contact_label',
                'contact_title',
                'contact_description',
                'operation_title',
                'operation_days',
                'operation_hours',
                'response_title',
                'response_method',
                'response_time',
                'contact_form_title',
                'contact_form_placeholder',
                'contact_button_text'
            ]);
        });
    }
};
