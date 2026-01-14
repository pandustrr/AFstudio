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
        Schema::create('pricelist_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('pricelist_sub_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('pricelist_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->timestamps();
        });

        Schema::create('pricelist_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sub_category_id')->constrained('pricelist_sub_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('price_display');
            $table->decimal('price_numeric', 12, 2)->nullable();
            $table->json('features')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricelist_packages');
        Schema::dropIfExists('pricelist_sub_categories');
        Schema::dropIfExists('pricelist_categories');
    }
};
