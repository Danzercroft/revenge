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

    /**
     * @return BelongsTo<\App\Models\Exchange, \App\Models\ExchangeConfiguration>
     */
    public function exchange(): BelongsTo
    {
        /** @var BelongsTo<\App\Models\Exchange, \App\Models\ExchangeConfiguration> $relation */
        $relation = $this->belongsTo(Exchange::class, 'exchange_id', 'id');
        return $relation;
    }

    /**
     * @return BelongsTo<\App\Models\CurrencyPair, \App\Models\ExchangeConfiguration>
     */
    public function currencyPair(): BelongsTo
    {
        /** @var BelongsTo<\App\Models\CurrencyPair, \App\Models\ExchangeConfiguration> $relation */
        $relation = $this->belongsTo(CurrencyPair::class, 'currency_pair_id', 'id');
        return $relation;
    }

    /**
     * @return BelongsTo<\App\Models\TimePeriod, \App\Models\ExchangeConfiguration>
     */
    public function timePeriod(): BelongsTo
    {
        /** @var BelongsTo<\App\Models\TimePeriod, \App\Models\ExchangeConfiguration> $relation */
        $relation = $this->belongsTo(TimePeriod::class);
        return $relation;
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
    /**
     * @param \Illuminate\Database\Eloquent\Builder<\App\Models\ExchangeConfiguration> $query
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\ExchangeConfiguration>
     */
    public function scopeByExchange(\Illuminate\Database\Eloquent\Builder $query, int $exchangeId): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('exchange_id', $exchangeId);
    }

    /**
     * Scope для фильтрации по временному интервалу
     */
    /**
     * @param \Illuminate\Database\Eloquent\Builder<\App\Models\ExchangeConfiguration> $query
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\ExchangeConfiguration>
     */
    public function scopeByTimePeriod(\Illuminate\Database\Eloquent\Builder $query, int $timePeriodId): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('time_period_id', $timePeriodId);
    }

    /**
     * Scope для фильтрации активных конфигураций
     *
     * @param \Illuminate\Database\Eloquent\Builder<\App\Models\ExchangeConfiguration> $query
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\ExchangeConfiguration>
     */
    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('is_active', true);
    }
}
