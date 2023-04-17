<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\User;
use App\Models\Topic;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PrivateMessage>
 */
class PrivateMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user1 = User::inRandomOrder()->first();
        $user2 = User::where('id', '<>', $user1->id)->inRandomOrder()->first();
        $users = [$user1->id,$user2->id];
        $topic = Topic::create([
            'user_id' => $user1->id,
            'category_id' => 1,
            'title' => 'Private Message from'.$user1->nick." to ".$user2->nick,
        ])->afterCreating(function (Topic $top){
            Post::factory()->count(rand(1,6))->create([
                'topic_id' => $top->id,
                'user_id' => $users[$faker->numberBetween(1,2)],
            ]);
        });
        return [
            'topic_id' => $topic->id,
            'user_id' => $user1,
            'user2_id' => $user2,
            
        ];
    }
}
