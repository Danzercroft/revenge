<?php

namespace Database\Seeders;

use App\Models\ExchangeConfiguration;
use App\Models\Exchange;
use App\Models\CurrencyPair;
use App\Models\TimePeriod;
use Illuminate\Database\Seeder;

class ExchangeConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Получаем необходимые данные
        $binance = Exchange::where('name', 'Binance')->first();
        $bybit = Exchange::where('name', 'Bybit')->first();
        $okx = Exchange::where('name', 'OKX')->first();

        $btcUsdt = CurrencyPair::whereHas('baseSymbol', function($q) {
            $q->where('symbol', 'BTC');
        })->whereHas('quoteSymbol', function($q) {
            $q->where('symbol', 'USDT');
        })->where('type', 'spot')->first();

        $ethUsdt = CurrencyPair::whereHas('baseSymbol', function($q) {
            $q->where('symbol', 'ETH');
        })->whereHas('quoteSymbol', function($q) {
            $q->where('symbol', 'USDT');
        })->where('type', 'spot')->first();

        $btcUsdtFutures = CurrencyPair::whereHas('baseSymbol', function($q) {
            $q->where('symbol', 'BTC');
        })->whereHas('quoteSymbol', function($q) {
            $q->where('symbol', 'USDT');
        })->where('type', 'futures')->first();

        $timePeriods = TimePeriod::whereIn('name', ['1 минута', '5 минут', '15 минут', '1 час', '4 часа', '1 день'])->get();

        if (!$binance || !$bybit || !$okx || !$btcUsdt || !$ethUsdt || !$btcUsdtFutures || $timePeriods->count() == 0) {
            $this->command->warn('Необходимые данные не найдены. Убедитесь, что выполнены сидеры для бирж, валютных пар и временных периодов.');
            return;
        }

        $configurations = [];

        // Конфигурации для Binance
        foreach ($timePeriods as $period) {
            $configurations[] = [
                'exchange_id' => $binance->id,
                'currency_pair_id' => $btcUsdt->id,
                'time_period_id' => $period->id,
                'is_active' => true,
                'additional_config' => [
                    'min_notional' => 10,
                    'tick_size' => 0.01,
                    'step_size' => 0.00001,
                ]
            ];

            $configurations[] = [
                'exchange_id' => $binance->id,
                'currency_pair_id' => $ethUsdt->id,
                'time_period_id' => $period->id,
                'is_active' => true,
                'additional_config' => [
                    'min_notional' => 10,
                    'tick_size' => 0.01,
                    'step_size' => 0.0001,
                ]
            ];

            // Фьючерсы только для некоторых периодов
            if (in_array($period->name, ['5m', '15m', '1h', '4h', '1d'])) {
                $configurations[] = [
                    'exchange_id' => $binance->id,
                    'currency_pair_id' => $btcUsdtFutures->id,
                    'time_period_id' => $period->id,
                    'is_active' => true,
                    'additional_config' => [
                        'leverage_max' => 125,
                        'min_notional' => 5,
                        'maintenance_margin_rate' => 0.004,
                    ]
                ];
            }
        }

        // Конфигурации для Bybit (меньше периодов)
        $bybitPeriods = $timePeriods->whereIn('name', ['1m', '5m', '1h', '1d']);
        foreach ($bybitPeriods as $period) {
            $configurations[] = [
                'exchange_id' => $bybit->id,
                'currency_pair_id' => $btcUsdt->id,
                'time_period_id' => $period->id,
                'is_active' => true,
                'additional_config' => [
                    'min_order_qty' => 0.001,
                    'tick_size' => 0.1,
                ]
            ];

            $configurations[] = [
                'exchange_id' => $bybit->id,
                'currency_pair_id' => $ethUsdt->id,
                'time_period_id' => $period->id,
                'is_active' => $period->name !== '1m', // 1m отключен для ETH на Bybit
            ];
        }

        // Конфигурации для OKX (только основные периоды)
        $okxPeriods = $timePeriods->whereIn('name', ['15m', '1h', '4h', '1d']);
        foreach ($okxPeriods as $period) {
            $configurations[] = [
                'exchange_id' => $okx->id,
                'currency_pair_id' => $btcUsdt->id,
                'time_period_id' => $period->id,
                'is_active' => true,
            ];

            $configurations[] = [
                'exchange_id' => $okx->id,
                'currency_pair_id' => $ethUsdt->id,
                'time_period_id' => $period->id,
                'is_active' => true,
            ];
        }

        // Создаем конфигурации
        foreach ($configurations as $config) {
            ExchangeConfiguration::firstOrCreate(
                [
                    'exchange_id' => $config['exchange_id'],
                    'currency_pair_id' => $config['currency_pair_id'],
                    'time_period_id' => $config['time_period_id'],
                ],
                $config
            );
        }

        $this->command->info('Конфигурации бирж созданы успешно.');
    }
}
