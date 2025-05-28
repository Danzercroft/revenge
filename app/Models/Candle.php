<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Candle extends Model
{
    use HasFactory;

    protected $fillable = [
        'currency_pair_id',
        'exchange_id',
        'time_period_id',
        'open_time',
        'close_time',
        'open_price',
        'high_price',
        'low_price',
        'close_price',
        'volume',
        'quote_volume',
        'trades_count',
    ];

    protected $casts = [
        'open_time' => 'datetime',
        'close_time' => 'datetime',
        'open_price' => 'decimal:8',
        'high_price' => 'decimal:8',
        'low_price' => 'decimal:8',
        'close_price' => 'decimal:8',
        'volume' => 'decimal:8',
        'quote_volume' => 'decimal:8',
    ];

    /**
     * Связь с торговой парой
     */
    public function currencyPair(): BelongsTo
    {
        return $this->belongsTo(CurrencyPair::class);
    }

    /**
     * Связь с биржей
     */
    public function exchange(): BelongsTo
    {
        return $this->belongsTo(Exchange::class);
    }

    /**
     * Связь с периодом времени
     */
    public function timePeriod(): BelongsTo
    {
        return $this->belongsTo(TimePeriod::class);
    }

    /**
     * Scope для фильтрации по торговой паре
     */
    public function scopeForPair($query, $pairId)
    {
        return $query->where('currency_pair_id', $pairId);
    }

    /**
     * Scope для фильтрации по бирже
     */
    public function scopeForExchange($query, $exchangeId)
    {
        return $query->where('exchange_id', $exchangeId);
    }

    /**
     * Scope для фильтрации по тайм-фрейму
     */
    public function scopeForTimeframe($query, $timePeriodId)
    {
        return $query->where('time_period_id', $timePeriodId);
    }

    /**
     * Scope для фильтрации по диапазону времени
     */
    public function scopeInTimeRange($query, $from, $to)
    {
        return $query->whereBetween('open_time', [$from, $to]);
    }
}
