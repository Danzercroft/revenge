<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CandleRequest;
use App\Http\Resources\CandleResource;
use App\Models\Candle;
use App\Models\CurrencyPair;
use App\Models\Exchange;
use App\Models\Symbol;
use App\Models\TimePeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CandleController extends Controller
{
    private const INTERNAL_SERVER_ERROR_MESSAGE = 'Внутренняя ошибка сервера';
    /**
     * Получить торговые свечи
     */
    public function index(CandleRequest $request): AnonymousResourceCollection|JsonResponse
    {
        try {
            $currencyPair = $this->findCurrencyPair($request->currency_pair);
            $exchange = $this->findExchange($request->exchange);
            $timePeriod = $this->findTimePeriod($request->timeframe);

            if (!$currencyPair || !$exchange || !$timePeriod) {
                return response()->json([
                    'error' => 'Торговая пара, биржа или тайм-фрейм не найдены',
                    'message' => 'Проверьте правильность указанных параметров'
                ], 404);
            }

            $query = Candle::with(['currencyPair', 'exchange', 'timePeriod'])
                ->forPair($currencyPair->id)
                ->forExchange($exchange->id)
                ->forTimeframe($timePeriod->id)
                ->orderBy('open_time', 'desc');

            if ($request->from && $request->to) {
                $query->inTimeRange($request->from, $request->to);
            } elseif ($request->from) {
                $query->where('open_time', '>=', $request->from);
            } elseif ($request->to) {
                $query->where('open_time', '<=', $request->to);
            }

            $limit = $request->limit ?? 100;
            $candles = $query->limit($limit)->get();

            return CandleResource::collection($candles);

        } catch (\Exception $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : self::INTERNAL_SERVER_ERROR_MESSAGE
            ], 500);
        }
    }

    /**
     * Поиск валютной пары по ID или символу
     */
    private function findCurrencyPair(string|int|null $currencyPairInput): ?CurrencyPair
    {
        $result = null;
        if ($currencyPairInput) {
            if (is_numeric($currencyPairInput)) {
                $result = CurrencyPair::find($currencyPairInput);
            } else {
                $symbols = explode('/', $currencyPairInput);
                if (count($symbols) === 2) {
                    $baseSymbol = Symbol::where('symbol', $symbols[0])->first();
                    $quoteSymbol = Symbol::where('symbol', $symbols[1])->first();
                    if ($baseSymbol && $quoteSymbol) {
                        $result = CurrencyPair::where('base_symbol_id', $baseSymbol->id)
                            ->where('quote_symbol_id', $quoteSymbol->id)
                            ->first();
                    }
                }
            }
        }
        return $result;
    }

    /**
     * Поиск биржи по ID, коду или имени
     */
    private function findExchange(string|int|null $exchangeInput): ?Exchange
    {
        if (!$exchangeInput) {
            return null;
        }
        if (is_numeric($exchangeInput)) {
            return Exchange::find($exchangeInput);
        }
        return Exchange::where('code', strtoupper($exchangeInput))
            ->orWhere('name', $exchangeInput)
            ->first();
    }

    /**
     * Поиск таймфрейма по ID, имени или минутам
     */
    private function findTimePeriod(string|int|null $timeframeInput): ?TimePeriod
    {
        if (!$timeframeInput) {
            return null;
        }
        if (is_numeric($timeframeInput)) {
            return TimePeriod::find($timeframeInput);
        }
        return TimePeriod::where('name', $timeframeInput)
            ->orWhere('minutes', (int)$timeframeInput)
            ->first();
    }

    /**
     * Получить информацию о доступных торговых парах, биржах и тайм-фреймах
     */
    public function meta(): JsonResponse
    {
        try {
            $currencyPairs = CurrencyPair::with(['baseSymbol', 'quoteSymbol'])
                ->where('is_active', true)
                ->get()
                ->map(function ($pair) {
                    return [
                        'id' => $pair->id,
                        'symbol' => $pair->baseSymbol->symbol . '/' . $pair->quoteSymbol->symbol,
                        'base_currency' => $pair->baseSymbol->symbol,
                        'quote_currency' => $pair->quoteSymbol->symbol,
                        'type' => $pair->type,
                        'display_name' => $pair->display_name,
                    ];
                });

            $exchanges = Exchange::select('id', 'name', 'code')
                ->where('is_active', true)
                ->orderBy('name')
                ->get();

            $timeframes = TimePeriod::select('id', 'name', 'minutes')
                ->orderBy('minutes')
                ->get();

            return response()->json([
                'currency_pairs' => $currencyPairs,
                'exchanges' => $exchanges,
                'timeframes' => $timeframes,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ошибка при получении метаданных',
                'message' => config('app.debug') ? $e->getMessage() : self::INTERNAL_SERVER_ERROR_MESSAGE
            ], 500);
        }
    }

    /**
     * Получить статистику по свечам
     */
    public function stats(CandleRequest $request): JsonResponse
    {
        try {
            $currencyPair = $this->findCurrencyPairForStats($request->currency_pair);
            $exchange = $this->findExchangeForStats($request->exchange);
            $timePeriod = $this->findTimePeriodForStats($request->timeframe);

            $error = $this->validateStatsParams($request, $currencyPair, $exchange, $timePeriod);
            if ($error) {
                return $error;
            }

            $query = Candle::forPair($currencyPair->id)
                ->forExchange($exchange->id)
                ->forTimeframe($timePeriod->id);

            if ($request->from && $request->to) {
                $query->inTimeRange($request->from, $request->to);
            }

            $stats = $query->selectRaw('
                COUNT(*) as total_candles,
                MIN(open_time) as earliest_time,
                MAX(open_time) as latest_time,
                MIN(low_price) as min_price,
                MAX(high_price) as max_price,
                SUM(volume) as total_volume
            ')->first();

            return response()->json([
                'currency_pair' => $currencyPair->display_name,
                'exchange' => $exchange->name,
                'timeframe' => $timePeriod->name,
                'statistics' => [
                    'total_candles' => (int) ($stats->total_candles ?? 0),
                    'earliest_time' => $stats->earliest_time ?? null,
                    'latest_time' => $stats->latest_time ?? null,
                    'price_range' => [
                        'min' => (float) ($stats->min_price ?? 0),
                        'max' => (float) ($stats->max_price ?? 0),
                    ],
                    'total_volume' => (float) ($stats->total_volume ?? 0),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ошибка при получении статистики',
                'message' => config('app.debug') ? $e->getMessage() : self::INTERNAL_SERVER_ERROR_MESSAGE
            ], 500);
        }
    }

    /**
     * Вынесенная логика поиска валютной пары для stats
     */
    private function findCurrencyPairForStats(string|int|null $currencyPairInput): ?CurrencyPair
    {
        // Используем уже существующую логику поиска валютной пары
        return $this->findCurrencyPair($currencyPairInput);
    }

    /**
     * Вынесенная логика поиска биржи для stats
     */
    private function findExchangeForStats(string|int|null $exchangeInput): ?Exchange
    {
        // Используем уже существующую логику поиска биржи
        return $this->findExchange($exchangeInput);
    }

    /**
     * Вынесенная логика поиска таймфрейма для stats
     */
    private function findTimePeriodForStats(string|int|null $timeframeInput): ?TimePeriod
    {
        // Используем уже существующую логику поиска таймфрейма
        return $this->findTimePeriod($timeframeInput);
    }

    /**
     * Проверка параметров для stats
     */
    private function validateStatsParams(
        CandleRequest $request,
        ?\App\Models\CurrencyPair $currencyPair,
        ?\App\Models\Exchange $exchange,
        ?\App\Models\TimePeriod $timePeriod
    ): ?\Illuminate\Http\JsonResponse {
        $response = null;

        if ($request->currency_pair && !$currencyPair) {
            $response = response()->json(['error' => 'Торговая пара не найдена'], 404);
        } elseif ($request->exchange && !$exchange) {
            $response = response()->json(['error' => 'Биржа не найдена'], 404);
        } elseif ($request->timeframe && !$timePeriod) {
            $response = response()->json(['error' => 'Тайм-фрейм не найден'], 404);
        } elseif (!$currencyPair || !$exchange || !$timePeriod) {
            $response = response()->json([
                'error' => 'Для получения статистики требуются параметры: currency_pair, exchange, timeframe'
            ], 400);
        }

        return $response;
    }
}
