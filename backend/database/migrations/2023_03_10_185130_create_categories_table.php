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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->string('section')->nullable();
            $table->string('description')->nullable();
            $table->string('image')->nullable();
            $table->string('music')->nullable();
            $table->string('can_view')->default('ROLE_GUEST');
            $table->string('can_post')->default('ROLE_USER');
            $table->string('can_mod')->default('ROLE_MOD');
            $table->timestamps();

            $table->index(['section']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
