<?php

namespace Database\Seeders;

use App\Models\Exchange;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExchangeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exchanges = [
            [
                'name' => 'Binance',
                'code' => 'BINANCE',
                'environment' => 'production',
                'api_key' => 'demo_api_key_binance_prod',
                'api_secret' => 'demo_api_secret_binance_prod',
                'is_active' => true
            ],
            [
                'name' => 'Binance Testnet',
                'code' => 'BINANCE_TESTNET',
                'environment' => 'sandbox',
                'api_key' => 'demo_api_key_binance_test',
                'api_secret' => 'demo_api_secret_binance_test',
                'is_active' => true
            ],
            [
                'name' => 'Bybit',
                'code' => 'BYBIT',
                'environment' => 'production',
                'api_key' => 'demo_api_key_bybit_prod',
                'api_secret' => 'demo_api_secret_bybit_prod',
                'is_active' => true
            ],
            [
                'name' => 'OKX',
                'code' => 'OKX',
                'environment' => 'production',
                'api_key' => 'demo_api_key_okx_prod',
                'api_secret' => 'demo_api_secret_okx_prod',
                'api_passphrase' => 'demo_passphrase_okx',
                'is_active' => true
            ],
            [
                'name' => 'Coinbase',
                'code' => 'COINBASE',
                'environment' => 'sandbox',
                'api_key' => 'demo_api_key_coinbase_test',
                'api_secret' => 'demo_api_secret_coinbase_test',
                'api_passphrase' => 'demo_passphrase_coinbase',
                'is_active' => false
            ]
        ];

        foreach ($exchanges as $exchange) {
            Exchange::create($exchange);
        }
    }
}
