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
        Schema::create('edit_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photo_session_id')->constrained('photo_sessions')->onDelete('cascade');
            $table->json('selected_photos');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('edit_requests');
    }
};
