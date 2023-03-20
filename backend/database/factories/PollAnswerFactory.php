<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\User;
use App\Models\PollOption;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PollAnswer>
 */
class PollAnswerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'poll_option_id' => $this->faker->randomElement(PollOption::pluck('id')),
            'user_id' => $this->faker->randomElement(User::pluck('id'))
        ];
    }
}
