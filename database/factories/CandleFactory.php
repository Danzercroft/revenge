<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Candle>
 */
class CandleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Генерируем базовую цену
        $basePrice = $this->faker->randomFloat(8, 0.0001, 100000);
        
        // Генерируем OHLC данные с реалистичными значениями
        $open = $basePrice;
        $volatility = $this->faker->randomFloat(4, 0.001, 0.05); // 0.1% - 5% волатильность
        
        $high = $open * (1 + $volatility * $this->faker->randomFloat(2, 0.1, 1));
        $low = $open * (1 - $volatility * $this->faker->randomFloat(2, 0.1, 1));
        $close = $this->faker->randomFloat(8, $low, $high);
        
        // Генерируем объем
        $volume = $this->faker->randomFloat(8, 0.1, 10000);
        $quoteVolume = $volume * (($open + $close) / 2); // Приблизительный объем в котируемой валюте
        
        $openTime = $this->faker->dateTimeBetween('-1 year', 'now');
        
        return [
            'currency_pair_id' => \App\Models\CurrencyPair::factory(),
            'exchange_id' => \App\Models\Exchange::factory(),
            'time_period_id' => \App\Models\TimePeriod::factory(),
            'open_time' => $openTime,
            'close_time' => (clone $openTime)->modify('+1 hour'), // Предполагаем 1-часовые свечи
            'open_price' => $open,
            'high_price' => $high,
            'low_price' => $low,
            'close_price' => $close,
            'volume' => $volume,
            'quote_volume' => $quoteVolume,
            'trades_count' => $this->faker->numberBetween(10, 1000),
        ];
    }

    /**
     * Создать свечу для конкретной пары, биржи и тайм-фрейма
     */
    public function forPair($currencyPairId, $exchangeId, $timePeriodId): static
    {
        return $this->state(fn (array $attributes) => [
            'currency_pair_id' => $currencyPairId,
            'exchange_id' => $exchangeId,
            'time_period_id' => $timePeriodId,
        ]);
    }

    /**
     * Создать последовательность свечей
     */
    public function sequence($startTime, $interval, $count): static
    {
        $candles = [];
        $currentTime = clone $startTime;
        
        for ($i = 0; $i < $count; $i++) {
            $candles[] = [
                'open_time' => clone $currentTime,
                'close_time' => (clone $currentTime)->modify($interval),
            ];
            $currentTime->modify($interval);
        }
        
        return $this->sequence(...$candles);
    }
}
