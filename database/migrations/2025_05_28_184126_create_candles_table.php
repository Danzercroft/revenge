<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candles', function (Blueprint $table) {
            $table->id();
            
            // Связи с другими таблицами
            $table->foreignId('currency_pair_id')->constrained()->onDelete('cascade');
            $table->foreignId('exchange_id')->constrained()->onDelete('cascade');
            $table->foreignId('time_period_id')->constrained()->onDelete('cascade');
            
            // Временные метки свечи
            $table->timestamp('open_time');
            $table->timestamp('close_time');
            
            // OHLCV данные
            $table->decimal('open_price', 20, 8);
            $table->decimal('high_price', 20, 8);
            $table->decimal('low_price', 20, 8);
            $table->decimal('close_price', 20, 8);
            $table->decimal('volume', 20, 8);
            
            // Дополнительные данные
            $table->decimal('quote_volume', 20, 8)->nullable(); // Объем в котируемой валюте
            $table->integer('trades_count')->nullable(); // Количество сделок
            
            $table->timestamps();
            
            // Индексы для быстрого поиска
            $table->index(['currency_pair_id', 'exchange_id', 'time_period_id', 'open_time']);
            $table->index(['open_time']);
            $table->unique(['currency_pair_id', 'exchange_id', 'time_period_id', 'open_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candles');
    }
};
