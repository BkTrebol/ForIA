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
        return [
            'topic_id' => $this->faker->unique()->randomElement(Topic::pluck('id')),
            'user_id' => $this->faker->randomElement(User::pluck('id')),
            'user2_id' => $this->faker->randomElement(User::pluck('id'))
        ];
    }
}
