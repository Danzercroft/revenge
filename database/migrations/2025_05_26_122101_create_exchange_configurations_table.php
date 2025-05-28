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
        Schema::create('exchange_configurations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exchange_id')->constrained()->onDelete('cascade');
            $table->foreignId('currency_pair_id')->constrained()->onDelete('cascade');
            $table->foreignId('time_period_id')->constrained()->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->json('additional_config')->nullable(); // Дополнительные настройки (комиссии, лимиты и т.д.)
            $table->timestamps();

            // Уникальное ограничение: одна конфигурация для одной комбинации
            $table->unique(['exchange_id', 'currency_pair_id', 'time_period_id'], 'unique_exchange_config');
            
            // Индексы для быстрого поиска
            $table->index(['exchange_id', 'is_active']);
            $table->index(['time_period_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exchange_configurations');
    }
};
