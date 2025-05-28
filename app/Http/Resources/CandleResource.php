<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'open_time' => $this->open_time->timestamp * 1000, // В миллисекундах для JS
            'close_time' => $this->close_time->timestamp * 1000,
            'open_time_readable' => $this->open_time->toISOString(),
            'close_time_readable' => $this->close_time->toISOString(),
            'ohlcv' => [
                'open' => (float) $this->open_price,
                'high' => (float) $this->high_price,
                'low' => (float) $this->low_price,
                'close' => (float) $this->close_price,
                'volume' => (float) $this->volume,
            ],
            'quote_volume' => $this->when($this->quote_volume !== null, (float) $this->quote_volume),
            'trades_count' => $this->trades_count,
            'currency_pair' => [
                'id' => $this->currencyPair->id,
                'symbol' => $this->currencyPair->symbol,
                'base_currency' => $this->currencyPair->base_currency,
                'quote_currency' => $this->currencyPair->quote_currency,
            ],
            'exchange' => [
                'id' => $this->exchange->id,
                'name' => $this->exchange->name,
                'display_name' => $this->exchange->display_name,
            ],
            'timeframe' => [
                'id' => $this->timePeriod->id,
                'interval' => $this->timePeriod->interval,
                'name' => $this->timePeriod->name,
                'minutes' => $this->timePeriod->minutes,
            ],
        ];
    }
}
