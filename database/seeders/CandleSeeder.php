<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Создание тестовых данных для свечей...');

        // Получаем существующие данные
        $currencyPairs = \App\Models\CurrencyPair::all();
        $exchanges = \App\Models\Exchange::all();
        $timePeriods = \App\Models\TimePeriod::all();

        if ($currencyPairs->isEmpty() || $exchanges->isEmpty() || $timePeriods->isEmpty()) {
            $this->command->warn('Сначала необходимо заполнить таблицы торговых пар, бирж и тайм-фреймов');
            return;
        }

        // Создаем свечи для каждой комбинации
        foreach ($currencyPairs->take(3) as $pair) { // Берем только 3 пары для тестирования
            foreach ($exchanges->take(2) as $exchange) { // Берем только 2 биржи
                foreach ($timePeriods->take(3) as $timePeriod) { // Берем только 3 тайм-фрейма
                    $this->createCandlesForCombination($pair, $exchange, $timePeriod);
                }
            }
        }

        $totalCandles = \App\Models\Candle::count();
        $this->command->info("Создано {$totalCandles} тестовых свечей");
    }

    /**
     * Создает свечи для заданной комбинации торговой пары, биржи и тайм-фрейма.
     */
    private function createCandlesForCombination(\App\Models\CurrencyPair $pair, \App\Models\Exchange $exchange, \App\Models\TimePeriod $timePeriod): void
    {
        if (property_exists($pair, 'symbol')) {
            $symbol = $pair->symbol;
        } elseif (property_exists($pair, 'name')) {
            $symbol = $pair->name;
        } else {
            $symbol = 'N/A';
        }
        $this->command->info("Создание свечей для {$symbol} на {$exchange->name} ({$timePeriod->name})");

        // Создаем последовательность свечей за последние 30 дней
        $startTime = now()->subDays(30);
        $intervalMinutes = $timePeriod->minutes;

        // Вычисляем количество свечей
        $totalMinutes = 30 * 24 * 60; // 30 дней в минутах
        $candleCount = min(100, intval($totalMinutes / $intervalMinutes)); // Максимум 100 свечей

        // Генерируем базовую цену для этой пары
        if (property_exists($pair, 'symbol')) {
            $symbol = $pair->symbol;
        } elseif (property_exists($pair, 'name')) {
            $symbol = $pair->name;
        } else {
            $symbol = null;
        }
        $basePrice = match($symbol) {
            'BTC/USDT' => 45000,
            'ETH/USDT' => 3000,
            'BNB/USDT' => 300,
            default => 100
        };

        // Создаем свечи
        for ($i = 0; $i < $candleCount; $i++) {
            $openTime = (clone $startTime)->addMinutes($i * $intervalMinutes);
            $closeTime = (clone $openTime)->addMinutes($intervalMinutes);

            // Генерируем реалистичные OHLC данные
            $volatility = 0.02; // 2% волатильность
            $priceChange = (mt_rand(-100, 100) / 10000) * $volatility;

            $open = $basePrice * (1 + $priceChange);
            $high = $open * (1 + abs($priceChange) + (mt_rand(0, 50) / 10000));
            $low = $open * (1 - abs($priceChange) - (mt_rand(0, 50) / 10000));
            $close = $low + mt_rand(0, 100) / 100 * ($high - $low);

            $volume = mt_rand(100, 10000) / 100;

            \App\Models\Candle::create([
                'currency_pair_id' => $pair->id,
                'exchange_id' => $exchange->id,
                'time_period_id' => $timePeriod->id,
                'open_time' => $openTime,
                'close_time' => $closeTime,
                'open_price' => round($open, 8),
                'high_price' => round($high, 8),
                'low_price' => round($low, 8),
                'close_price' => round($close, 8),
                'volume' => round($volume, 8),
                'quote_volume' => round($volume * $close, 8),
                'trades_count' => mt_rand(10, 500),
            ]);

            // Обновляем базовую цену для следующей свечи
            $basePrice = $close;
        }
    }
}
