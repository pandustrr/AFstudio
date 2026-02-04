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
        Schema::create('journey_steps', function (Blueprint $table) {
            $table->id();
            $table->string('step_number')->default('01'); // 01, 02, 03
            $table->string('title')->default('Konsultasi');
            $table->text('description')->nullable();
            $table->unsignedInteger('order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journey_steps');
    }
};
