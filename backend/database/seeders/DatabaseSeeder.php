<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Category;
use App\Models\Topic;
use App\Models\Post;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollAnswer;
use App\Models\PrivateMessage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->count(10)->create();
        Category::factory()->create([
            'id' => 1,
            'title' => 'privateMessages',
            'section' => 'none',
            'can_view' => 'ROLE_GOD',
        ]);
        Category::factory()->count(2)->create([
            'section' => 'Welcome',
        ]);
        Category::factory()->count(3)->create([
            'section' => 'HOLITA',
        ]);
        Category::factory()->count(4)->create([
            'section' => 'Cuatro',
        ]);
        Topic::factory()->count(15)->create();
        // PrivateMessage::factory()->count(5)->create();
        Post::factory()->count(45)->create();
        Poll::factory()->count(3)->create();
        PollOption::factory()->count(10)->create();
        PollAnswer::factory()->count(40)->create();
        



        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
