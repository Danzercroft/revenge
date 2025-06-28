<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SymbolSeeder::class,
            TimePeriodSeeder::class,
            ExchangeSeeder::class,
            CurrencyPairSeeder::class,
            ExchangeConfigurationSeeder::class,
            CandleSeeder::class,
        ]);
    }
}
