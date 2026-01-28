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
        Schema::create('photographer_date_marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->string('color')->nullable();
            $table->string('label')->nullable();
            $table->timestamps();

            $table->unique(['photographer_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photographer_date_marks');
    }
};
