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
            $table->integer('order')->nullable();
            $table->string('title')->unique();
            $table->string('section')->nullable();
            $table->string('description')->nullable();
            $table->string('image')->nullable();
            $table->string('music')->nullable();
            // $table->string('can_view')->default('ROLE_GUEST');
            // $table->string('can_post')->default('ROLE_USER');
            // $table->string('can_mod')->default('ROLE_MOD');
            $table->unsignedBigInteger('can_view')->default(1);
            $table->unsignedBigInteger('can_post')->default(2);
            $table->unsignedBigInteger('can_mod')->default(3);

            $table->foreign('can_view')->references('id')->on('roles')->onUpdate('cascade')->onDelete('set default');
            $table->foreign('can_post')->references('id')->on('roles')->onUpdate('cascade')->onDelete('set default');
            $table->foreign('can_mod')->references('id')->on('roles')->onUpdate('cascade')->onDelete('set default');

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
