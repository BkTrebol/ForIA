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
            $table->foreignId('category_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->onUpdate('cascade');
            $table->string('title');
            $table->string('description')->nullable();
            $table->text('content')->nullable();
            // $table->string('can_view')->default('ROLE_GUEST');
            // $table->string('can_post')->default('ROLE_USER');

            $table->unsignedBigInteger('can_view')->default(1);
            $table->unsignedBigInteger('can_post')->default(2);

            $table->foreign('can_view')->references('id')->on('roles')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('can_post')->references('id')->on('roles')->onDelete('cascade')->onUpdate('cascade');

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
