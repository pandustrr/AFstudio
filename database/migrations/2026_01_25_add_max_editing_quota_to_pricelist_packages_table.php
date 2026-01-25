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
            $table->integer('max_editing_quota')->default(0)->comment('Maximum number of edits allowed for this package (0 = no editing allowed)')->after('max_sessions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pricelist_packages', function (Blueprint $table) {
            $table->dropColumn('max_editing_quota');
        });
    }
};
