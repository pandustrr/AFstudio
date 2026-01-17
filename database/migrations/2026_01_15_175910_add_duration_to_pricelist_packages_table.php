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
        Schema::table('pricelist_packages', function (Blueprint $table) {
            $table->integer('duration')->after('price_numeric')->default(60)->comment('Duration in minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pricelist_packages', function (Blueprint $table) {
            //
        });
    }
};
