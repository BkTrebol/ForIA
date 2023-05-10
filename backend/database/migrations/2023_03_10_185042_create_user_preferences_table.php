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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('sidebar')->default(false);
            $table->boolean('filter_bad_words')->default(true);
            $table->boolean('allow_view_profile')->default(true);
            $table->boolean('allow_user_to_mp')->default(true);
            $table->boolean('hide_online_presence')->default(false);
            $table->boolean('two_fa')->default(false);
            $table->boolean('allow_music')->default(true);
            // $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
