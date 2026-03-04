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
            $table->boolean('allow_split_session')->default(false)->after('max_editing_quota');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pricelist_packages', function (Blueprint $table) {
            $table->dropColumn('allow_split_session');
        });
    }
};
