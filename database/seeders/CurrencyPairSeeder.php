<?php

namespace Database\Seeders;

use App\Models\CurrencyPair;
use App\Models\Symbol;
use Illuminate\Database\Seeder;

class CurrencyPairSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Получаем символы
        $btc = Symbol::where('symbol', 'BTC')->first();
        $eth = Symbol::where('symbol', 'ETH')->first();
        $usdt = Symbol::where('symbol', 'USDT')->first();
        $usdc = Symbol::where('symbol', 'USDC')->first();

        if (!$btc || !$eth || !$usdt || !$usdc) {
            $this->command->warn('Необходимые символы не найдены. Запустите сначала SymbolSeeder.');
            return;
        }

        $pairs = [
            // Спот пары
            [
                'base_symbol_id' => $btc->id,
                'quote_symbol_id' => $usdt->id,
                'type' => 'spot',
                'is_active' => true,
            ],
            [
                'base_symbol_id' => $eth->id,
                'quote_symbol_id' => $usdt->id,
                'type' => 'spot',
                'is_active' => true,
            ],
            [
                'base_symbol_id' => $btc->id,
                'quote_symbol_id' => $usdc->id,
                'type' => 'spot',
                'is_active' => true,
            ],
            [
                'base_symbol_id' => $eth->id,
                'quote_symbol_id' => $usdc->id,
                'type' => 'spot',
                'is_active' => true,
            ],
            [
                'base_symbol_id' => $eth->id,
                'quote_symbol_id' => $btc->id,
                'type' => 'spot',
                'is_active' => true,
            ],

            // Фьючерсные пары
            [
                'base_symbol_id' => $btc->id,
                'quote_symbol_id' => $usdt->id,
                'type' => 'futures',
                'is_active' => true,
            ],
            [
                'base_symbol_id' => $eth->id,
                'quote_symbol_id' => $usdt->id,
                'type' => 'futures',
                'is_active' => true,
            ],
            [
                'base_symbol_id' => $btc->id,
                'quote_symbol_id' => $usdc->id,
                'type' => 'futures',
                'is_active' => false,
            ],
        ];

        foreach ($pairs as $pairData) {
            CurrencyPair::firstOrCreate(
                [
                    'base_symbol_id' => $pairData['base_symbol_id'],
                    'quote_symbol_id' => $pairData['quote_symbol_id'],
                    'type' => $pairData['type'],
                ],
                $pairData
            );
        }

        $this->command->info('Валютные пары созданы успешно.');
    }
}
