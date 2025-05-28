<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExchangeConfiguration extends Model
{
    protected $fillable = [
        'exchange_id',
        'currency_pair_id',
        'time_period_id',
        'is_active',
        'additional_config',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'additional_config' => 'array',
    ];

    public function exchange(): BelongsTo
    {
        return $this->belongsTo(Exchange::class);
    }

    public function currencyPair(): BelongsTo
    {
        return $this->belongsTo(CurrencyPair::class);
    }

    public function timePeriod(): BelongsTo
    {
        return $this->belongsTo(TimePeriod::class);
    }

    /**
     * Получить отображаемое имя конфигурации
     */
    public function getDisplayNameAttribute(): string
    {
        return sprintf(
            '%s - %s - %s',
            $this->exchange->name ?? 'N/A',
            $this->currencyPair->display_name ?? 'N/A',
            $this->timePeriod->name ?? 'N/A'
        );
    }

    /**
     * Scope для фильтрации по бирже
     */
    public function scopeByExchange($query, $exchangeId)
    {
        return $query->where('exchange_id', $exchangeId);
    }

    /**
     * Scope для фильтрации по временному интервалу
     */
    public function scopeByTimePeriod($query, $timePeriodId)
    {
        return $query->where('time_period_id', $timePeriodId);
    }

    /**
     * Scope для фильтрации активных конфигураций
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
