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
        Schema::create('private_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->onDelete('cascada')->constraint();
            $table->foreignId('user_id')->onDelete('cascade')->constraint();
            $table->unsignedBigInteger('user2_id');
            $table->foreign('user2_id')->references('id')->on('users')->onDelete('cascade')->constraint();
            $table->unique(['user_id','user2_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('private_messages');
    }
};
