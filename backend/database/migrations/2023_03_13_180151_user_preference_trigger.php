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
        DB::unprepared('CREATE TRIGGER add_user_preference AFTER INSERT ON `users` FOR EACH ROW
        BEGIN
           INSERT INTO `user_preferences` (`user_id`) VALUES (NEW.id);
        END');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        DB::unprepared('DROP TRIGGER `add_user_preference`');
    }
};
