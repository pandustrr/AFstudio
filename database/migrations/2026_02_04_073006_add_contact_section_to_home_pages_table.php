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
            // Contact Section
            $table->string('contact_label')->default('Hubungi Kami')->after('gallery_subtitle');
            $table->string('contact_title')->default('HADIRKAN VISI ANDA.')->after('contact_label');
            $table->text('contact_description')->nullable()->after('contact_title');
            $table->string('operation_title')->default('Waktu Operasional')->after('contact_description');
            $table->string('operation_days')->default('Senin — Minggu')->after('operation_title');
            $table->string('operation_hours')->default('09:00 — 21:00 WIB')->after('operation_days');
            $table->string('response_title')->default('Respon Cepat')->after('operation_hours');
            $table->string('response_method')->default('WhatsApp Priority')->after('response_title');
            $table->string('response_time')->default('Rata-rata < 15 Menit')->after('response_method');
            $table->string('contact_form_title')->default('Pesan Anda')->after('response_time');
            $table->string('contact_form_placeholder')->default('Ceritakan sedikit tentang visi Anda...')->after('contact_form_title');
            $table->string('contact_button_text')->default('Kirim Pesan Sekarang')->after('contact_form_placeholder');
        });
    }

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
                'contact_button_text',
            ]);
        });
    }
};
