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
        Schema::create('abouts', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('About AF Studio');
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->text('vision')->nullable();
            $table->text('mission')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('instagram')->nullable();
            $table->text('address')->nullable();
            $table->text('maps_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abouts');
    }
};
