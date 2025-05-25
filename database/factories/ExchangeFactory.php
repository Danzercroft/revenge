<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exchange>
 */
class ExchangeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $exchanges = [
            ['name' => 'Binance', 'code' => 'BINANCE'],
            ['name' => 'Bybit', 'code' => 'BYBIT'],
            ['name' => 'OKX', 'code' => 'OKX'],
            ['name' => 'Coinbase', 'code' => 'COINBASE'],
            ['name' => 'Kraken', 'code' => 'KRAKEN'],
            ['name' => 'Gate.io', 'code' => 'GATE'],
        ];
        
        $exchange = $this->faker->randomElement($exchanges);
        
        return [
            'name' => $exchange['name'],
            'code' => $exchange['code'],
            'environment' => $this->faker->randomElement(['sandbox', 'production']),
            'api_key' => $this->faker->regexify('[A-Za-z0-9]{32}'),
            'api_secret' => $this->faker->regexify('[A-Za-z0-9]{64}'),
            'api_passphrase' => $this->faker->optional(0.3)->regexify('[A-Za-z0-9]{16}'), // 30% имеют passphrase
            'is_active' => $this->faker->boolean(80), // 80% активных
        ];
    }
}
