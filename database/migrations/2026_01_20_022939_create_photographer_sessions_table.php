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
        Schema::create('photographer_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->time('start_time');
            $table->enum('status', ['open', 'booked', 'off'])->default('open');
            $table->foreignId('booking_item_id')->nullable()->constrained('booking_items')->onDelete('set null');
            $table->integer('offset_minutes')->default(0); // For Admin offset
            $table->string('offset_description')->nullable();
            $table->string('block_identifier')->nullable(); // e.g. "akad", "resepsi"
            $table->timestamps();

            $table->unique(['photographer_id', 'date', 'start_time'], 'fg_session_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photographer_sessions');
    }
};
