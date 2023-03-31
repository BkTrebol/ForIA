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
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained();
            $table->foreignId('user_id')->nullable()->nullOnDelete()->constrained();
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('can_view')->default('ROLE_GUEST');
            $table->string('can_post')->default('ROLE_USER');
            $table->timestamps();

            $table->index(['updated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
