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

    public const DECIMAL_CAST = 'decimal:8';

    protected $casts = [
        'open_time' => 'datetime',
        'close_time' => 'datetime',
        'open_price' => self::DECIMAL_CAST,
        'high_price' => self::DECIMAL_CAST,
        'low_price' => self::DECIMAL_CAST,
        'close_price' => self::DECIMAL_CAST,
        'volume' => self::DECIMAL_CAST,
        'quote_volume' => self::DECIMAL_CAST,
    ];

    /**
     * Связь с торговой парой
     */
    /**
     * Связь с торговой парой
     *
     * @return BelongsTo<\App\Models\CurrencyPair, \App\Models\Candle>
     */
    public function currencyPair(): BelongsTo
    {
        /** @var BelongsTo<\App\Models\CurrencyPair, \App\Models\Candle> $relation */
        $relation = $this->belongsTo(CurrencyPair::class);
        return $relation;
    }

    /**
     * Связь с биржей
     *
     * @return BelongsTo<\App\Models\Exchange, \App\Models\Candle>
     */
    public function exchange(): BelongsTo
    {
        /** @var BelongsTo<\App\Models\Exchange, \App\Models\Candle> $relation */
        $relation = $this->belongsTo(Exchange::class, 'exchange_id', 'id');
        return $relation;
    }

    /**
     * Связь с периодом времени
     *
     * @return BelongsTo<\App\Models\TimePeriod, \App\Models\Candle>
     */
    public function timePeriod(): BelongsTo
    {
        /** @var BelongsTo<\App\Models\TimePeriod, \App\Models\Candle> $relation */
        $relation = $this->belongsTo(TimePeriod::class, 'time_period_id', 'id');
        return $relation;
    }

    /**
     * Scope для фильтрации по торговой паре
     *
     * @param \Illuminate\Database\Eloquent\Builder<Candle> $query
     * @param int|string $pairId
     * @return \Illuminate\Database\Eloquent\Builder<Candle>
     */
    public function scopeForPair(\Illuminate\Database\Eloquent\Builder $query, $pairId): \Illuminate\Database\Eloquent\Builder
    {
        /** @var \Illuminate\Database\Eloquent\Builder<Candle> $query */
        return $query->where('currency_pair_id', $pairId);
    }

    /**
     * Scope для фильтрации по бирже
     */
    /**
     * Scope для фильтрации по бирже
     *
     * @param \Illuminate\Database\Eloquent\Builder<Candle> $query
     * @param int|string $exchangeId
     * @return \Illuminate\Database\Eloquent\Builder<Candle>
     */
    public function scopeForExchange(\Illuminate\Database\Eloquent\Builder $query, int|string $exchangeId): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('exchange_id', $exchangeId);
    }

    /**
     * Scope для фильтрации по тайм-фрейму
     */
    /**
     * Scope для фильтрации по тайм-фрейму
     *
     * @param \Illuminate\Database\Eloquent\Builder<Candle> $query
     * @param int|string $timePeriodId
     * @return \Illuminate\Database\Eloquent\Builder<Candle>
     */
    public function scopeForTimeframe(\Illuminate\Database\Eloquent\Builder $query, int|string $timePeriodId): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('time_period_id', $timePeriodId);
    }

    /**
     * Scope для фильтрации по диапазону времени
     *
     * @param \Illuminate\Database\Eloquent\Builder<Candle> $query
     * @param \DateTimeInterface|string $from
     * @param \DateTimeInterface|string $to
     * @return \Illuminate\Database\Eloquent\Builder<Candle>
     */
    public function scopeInTimeRange(
        \Illuminate\Database\Eloquent\Builder $query,
        \DateTimeInterface|string $from,
        \DateTimeInterface|string $to
    ): \Illuminate\Database\Eloquent\Builder {
        return $query->whereBetween('open_time', [$from, $to]);
    }
}
