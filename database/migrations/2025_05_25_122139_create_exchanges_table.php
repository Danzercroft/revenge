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
        Schema::create('exchanges', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Название биржи (Binance, Bybit, etc.)
            $table->string('code')->unique(); // Код биржи (BINANCE, BYBIT, etc.)
            $table->enum('environment', ['sandbox', 'production'])->default('sandbox'); // Окружение
            $table->text('api_key')->nullable(); // API ключ (зашифрован)
            $table->text('api_secret')->nullable(); // API секрет (зашифрован)
            $table->text('api_passphrase')->nullable(); // API фраза (зашифрована)
            $table->boolean('is_active')->default(true); // Активна ли биржа
            $table->timestamps();
            
            // Индексы
            $table->index(['is_active', 'environment']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exchanges');
    }
};
