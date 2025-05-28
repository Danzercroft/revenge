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
            'id' => $this->resource->id,
            'open_time' => $this->resource->open_time->timestamp * 1000, // В миллисекундах для JS
            'close_time' => $this->resource->close_time->timestamp * 1000,
            'open_time_readable' => $this->resource->open_time->toISOString(),
            'close_time_readable' => $this->resource->close_time->toISOString(),
            'ohlcv' => [
                'open' => (float) $this->resource->open_price,
                'high' => (float) $this->resource->high_price,
                'low' => (float) $this->resource->low_price,
                'close' => (float) $this->resource->close_price,
                'volume' => (float) $this->resource->volume,
            ],
            'quote_volume' => $this->when($this->resource->quote_volume !== null, (float) $this->resource->quote_volume),
            'trades_count' => $this->resource->trades_count,
            'currency_pair' => [
                'id' => $this->resource->currencyPair->id,
                'symbol' => $this->resource->currencyPair->symbol,
                'base_currency' => $this->resource->currencyPair->base_currency,
                'quote_currency' => $this->resource->currencyPair->quote_currency,
            ],
            'exchange' => [
                'id' => $this->resource->exchange->id,
                'name' => $this->resource->exchange->name,
                'display_name' => $this->resource->exchange->display_name,
            ],
            'timeframe' => [
                'id' => $this->resource->timePeriod->id,
                'interval' => $this->resource->timePeriod->interval,
                'name' => $this->resource->timePeriod->name,
                'minutes' => $this->resource->timePeriod->minutes,
            ],
        ];
    }
}
