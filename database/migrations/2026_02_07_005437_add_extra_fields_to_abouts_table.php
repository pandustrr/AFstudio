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
        Schema::table('abouts', function (Blueprint $table) {
            $table->string('story_subtitle')->nullable()->after('description');
            $table->string('story_title')->nullable()->after('story_subtitle');
            $table->json('stats')->nullable()->after('story_title');
            $table->json('dna')->nullable()->after('stats');
            $table->string('cta_title')->nullable()->after('dna');
            $table->string('cta_subtitle')->nullable()->after('cta_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('abouts', function (Blueprint $table) {
            $table->dropColumn(['story_subtitle', 'story_title', 'stats', 'dna', 'cta_title', 'cta_subtitle']);
        });
    }
};
