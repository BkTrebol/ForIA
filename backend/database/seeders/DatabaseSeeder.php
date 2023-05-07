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
use App\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $guestRole = Role::create([
            'name' => 'ROLE_GUEST'
        ]);
        $userRole =Role::create([
            'name' => 'ROLE_USER'
        ]);
        $modRole = Role::create([
            'name' => 'ROLE_MOD'
        ]);
        $adminRole = Role::create([
            'name' => 'ROLE_ADMIN',
            'admin' => true
        ]);

        $user = User::factory()->create(
            [
            'email' => 'admin@admin.com',
            ]
        );
        $user->roles()->attach([$adminRole->id]);

        $user = User::factory()->create(
            [
            'email' => 'mod@mod.com',

            ]
        );
        $user->roles()->attach([$modRole->id]);

        $user = User::factory()->create(
            [
            'email' => 'welcome@mod.com',

            ]
        );
        $modWelcomeRole = Role::create([
            'name' => 'WELCOME_MOD'
        ]);
        $user->roles()->attach([$modWelcomeRole->id]);

        User::factory()->create(
            [
            'email' => 'suspended@user.com',
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
            'order' => 1,
            'title' => 'Trash',
            'section' => 'ADMIN',
            'can_view' => 4,
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
            'can_mod' => $modWelcomeRole->id
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
                    ->count(100)
            )
        )->count(1)->create([
            'title' => 'PostPagination',
            'section' => 'Offtopic',
        ]);



        // Topic::factory()->count(15)->create();
        // Post::factory()->count(45)->create();
        Poll::factory()->count(5)->create()
        ->each(function ($poll){
            $users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
            shuffle($users);

            for($i = 0; $i < rand(2,5);$i++){
                PollOption::factory()->create([
                    'poll_id' => $poll->id,
                ]);
            }
            $poll->options->each(function ($option) use ($users,$poll) {
                for ($i = 0; $i < rand(5,9); $i++){
                    if(count($users) == 0) break;
                    $user = array_pop($users);
                    if($poll->voted($user)) continue;
                    PollAnswer::factory()->create([
                        'poll_id' => $poll->id,
                        'poll_option_id' => $option->id,
                        'user_id' => $user,
                    ]);
                }
            });
        });
                    // $poll->options()->saveMany(Factory::factoryForModel(PollOption::class)->count(rand(2, 5))->make());
        // $option->answers()->save(Factory::factoryForModel(PollAnswer::class)->count(rand(0, 2))->make(['user_id' => rand(1, 10)]));

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
