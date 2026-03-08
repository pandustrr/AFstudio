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
        Schema::table('photo_sessions', function (Blueprint $table) {
            $table->boolean('is_raw_accessible')->default(false)->after('raw_folder_id');
            $table->boolean('is_edited_accessible')->default(false)->after('edited_folder_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photo_sessions', function (Blueprint $table) {
            $table->dropColumn(['is_raw_accessible', 'is_edited_accessible']);
        });
    }
};
