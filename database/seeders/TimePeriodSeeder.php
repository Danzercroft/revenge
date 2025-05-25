<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TimePeriod;

class TimePeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timePeriods = [
            [
                'name' => '1 минута',
                'minutes' => 1,
                'is_active' => true,
            ],
            [
                'name' => '5 минут',
                'minutes' => 5,
                'is_active' => true,
            ],
            [
                'name' => '15 минут',
                'minutes' => 15,
                'is_active' => true,
            ],
            [
                'name' => '30 минут',
                'minutes' => 30,
                'is_active' => true,
            ],
            [
                'name' => '1 час',
                'minutes' => 60,
                'is_active' => true,
            ],
            [
                'name' => '4 часа',
                'minutes' => 240,
                'is_active' => true,
            ],
            [
                'name' => '1 день',
                'minutes' => 1440,
                'is_active' => true,
            ],
            [
                'name' => '1 неделя',
                'minutes' => 10080,
                'is_active' => false,
            ],
            [
                'name' => '1 месяц',
                'minutes' => 43200,
                'is_active' => false,
            ],
        ];

        foreach ($timePeriods as $period) {
            TimePeriod::create($period);
        }
    }
}
