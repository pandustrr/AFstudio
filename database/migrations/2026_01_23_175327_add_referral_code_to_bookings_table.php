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
            $table->foreignId('referral_code_id')->nullable()->constrained('referral_codes')->onDelete('set null')->after('status');
            $table->decimal('discount_amount', 15, 2)->default(0)->after('referral_code_id');
            $table->decimal('final_price', 15, 2)->nullable()->after('discount_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeignKeyConstraints();
            $table->dropColumn(['referral_code_id', 'discount_amount', 'final_price']);
        });
    }
};
