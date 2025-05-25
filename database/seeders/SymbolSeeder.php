<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Symbol;

class SymbolSeeder extends Seeder
{
    public function run(): void
    {
        $symbols = [
            [
                'name' => 'Bitcoin',
                'symbol' => 'BTC',
                'description' => 'Первая и самая известная криптовалюта',
                'is_active' => true,
            ],
            [
                'name' => 'Ethereum',
                'symbol' => 'ETH',
                'description' => 'Платформа для смарт-контрактов',
                'is_active' => true,
            ],
            [
                'name' => 'Binance Coin',
                'symbol' => 'BNB',
                'description' => 'Токен биржи Binance',
                'is_active' => true,
            ],
            [
                'name' => 'Cardano',
                'symbol' => 'ADA',
                'description' => 'Блокчейн с фокусом на устойчивость',
                'is_active' => false,
            ],
            [
                'name' => 'Solana',
                'symbol' => 'SOL',
                'description' => 'Высокопроизводительный блокчейн',
                'is_active' => true,
            ],
        ];

        foreach ($symbols as $symbol) {
            Symbol::create($symbol);
        }
    }
}
