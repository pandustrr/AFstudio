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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('guest_uid')->nullable()->index();
            $table->string('booking_code')->unique();
            $table->string('name');
            $table->string('university')->nullable();
            $table->string('domicile')->nullable();
            $table->string('phone');
            $table->date('booking_date');
            $table->string('location');
            $table->text('notes')->nullable();
            $table->decimal('total_price', 15, 2);
            $table->decimal('down_payment', 15, 2)->default(0);
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
