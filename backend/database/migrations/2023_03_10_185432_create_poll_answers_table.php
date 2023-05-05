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
        Schema::create('poll_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poll_id')->constrained()->onDelete('cascade');;
            $table->foreignId('poll_option_id')->constrained()->onDelete('cascade');;
            $table->foreignId('user_id')->constrained()->onDelete('cascade');;
            $table->timestamps();

            $table->unique(['poll_id','user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poll_answers');
    }
};
