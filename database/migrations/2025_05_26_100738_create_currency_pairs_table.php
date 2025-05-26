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
        Schema::create('currency_pairs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('base_symbol_id')->constrained('symbols')->onDelete('cascade');
            $table->foreignId('quote_symbol_id')->constrained('symbols')->onDelete('cascade');
            $table->enum('type', ['spot', 'futures'])->default('spot');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Уникальный индекс для предотвращения дублирования пар с одинаковым типом
            $table->unique(['base_symbol_id', 'quote_symbol_id', 'type'], 'unique_currency_pair');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('currency_pairs');
    }
};
