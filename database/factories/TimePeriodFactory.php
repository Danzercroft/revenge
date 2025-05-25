<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimePeriod>
 */
class TimePeriodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $periods = [
            ['name' => '1 минута', 'minutes' => 1],
            ['name' => '5 минут', 'minutes' => 5],
            ['name' => '15 минут', 'minutes' => 15],
            ['name' => '30 минут', 'minutes' => 30],
            ['name' => '1 час', 'minutes' => 60],
            ['name' => '4 часа', 'minutes' => 240],
            ['name' => '1 день', 'minutes' => 1440],
        ];
        
        $period = $this->faker->randomElement($periods);
        
        return [
            'name' => $period['name'],
            'minutes' => $period['minutes'],
            'description' => $this->faker->sentence(),
            'is_active' => $this->faker->boolean(70), // 70% активные
        ];
    }
}
