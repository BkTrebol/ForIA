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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nick')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('location')->nullable();
            $table->date('birthday')->nullable();
            $table->string('avatar')->nullable();
            $table->json('roles')->default(json_encode(['ROLE_USER','ROLE_GUEST']));
            $table->string('rol')->default('User');
            $table->boolean('google_auth')->default(false); 
            $table->date('suspension')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
