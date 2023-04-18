<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        User::factory()->create(
            [
            'email' => 'admin@admin.com',
            'roles' => ['ROLE_ADMIN','ROLE_USER','ROLE_GUEST']
            ]
        );
        User::factory()->create(
            [
            'email' => 'mod@mod.com',
            'roles' => ['ROLE_MOD','ROLE_USER','ROLE_GUEST']
            ]
        );
        User::factory()->create(
            [
            'email' => 'welcome@mod.com',
            'roles' => ['MOD_WELCOME','ROLE_USER','ROLE_GUEST']
            ]
        );

        User::factory()->create(
            [
            'email' => 'suspended@user.com',
            'roles' => ['ROLE_USER','ROLE_GUEST'],
            'suspension' => fake()->dateTimeBetween('+1year', '+10 year'),
            ]
        );
        User::factory()->create(
            [
            'email' => 'notverified@user.com',
            'email_verified_at' => Null,
            ]
        );

        User::factory()->count(10)->create();
        Category::factory()->create([
            'id' => 1,
            'title' => 'privateMessages',
            'section' => 'none',
            'can_view' => 'NONE',
        ]);
        Category::factory()->create([
            'id' => 2,
            'title' => 'Trash',
            'section' => 'ADMIN',
            'can_view' => 'ROLE_ADMIN',
        ]);

        Category::factory()->count(3)->has(
            Topic::factory()
            ->count(rand(1,6))
            ->has(
                Post::factory()
                    ->count(rand(1,6))
            )
        )
        ->create([
            'section' => 'Welcome',
            'can_mod' => 'MOD_WELCOME'
        ])
        // ->afterCreating(function (Category $category){
        //     Topic::factory()->count(rand(1,6))->create([
        //         'category_id' => $category->id,
        //     ])->afterCreating(function (Topic $topic){
        //         Post::factory()->count(rand(1,6))->create([
        //             'topic_id' => $topic->id,
        //         ]);
        //     });
        // })
        ;
        Category::factory()->count(3)->has(
            Topic::factory()
            ->count(rand(1,6))
            ->has(
                Post::factory()
                    ->count(rand(1,6))
            )
        )->create([
            'section' => 'GPT',
        ]);

        Category::factory()->has(
            Topic::factory()
            ->count(rand(1,6))
            ->has(
                Post::factory()
                    ->count(rand(1,6))
            )
        )->count(4)->create([
            'section' => 'Imagenes',
        ]);

        Category::factory()->has(
            Topic::factory()
            ->count(rand(15,25))
            ->has(
                Post::factory()
                    ->count(rand(1,6))
            )
        )->count(1)->create([
            'title' => 'TopicPagination',
            'section' => 'Offtopic',
        ]);

        Category::factory()->has(
            Topic::factory()
            ->count(1)
            ->has(
                Post::factory()
                    ->count(rand(30,40))
            )
        )->count(1)->create([
            'title' => 'PostPagination',
            'section' => 'Offtopic',
        ]);



        // Topic::factory()->count(15)->create();
        // Post::factory()->count(45)->create();
        Poll::factory()->count(5)->create()
        ->each(function ($poll){
            $poll->options()->saveMany(Factory::factoryForModel(PollOption::class)->count(rand(2, 5))->make());
            $poll->options->each(function ($option) use ($poll) {
                $option->answers()->saveMany(Factory::factoryForModel(PollAnswer::class)->count(rand(0, 10))->make(['user_id' => rand(1, 10)]));
            });

        });

        // PollOption::factory()->count(10)->create();
        // PollAnswer::factory()->count(40)->create();

        // PrivateMessage::factory()->count(5)->create();


        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
