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
    /**
     * Получить торговые свечи
     */
    public function index(CandleRequest $request): AnonymousResourceCollection|JsonResponse
    {
        try {
            // Найдем валютную пару по ID или создадим фильтр по символам
            $currencyPair = null;
            if ($request->currency_pair) {
                if (is_numeric($request->currency_pair)) {
                    $currencyPair = CurrencyPair::find($request->currency_pair);
                } else {
                    // Попробуем найти по символу типа "BTC/USDT"
                    $symbols = explode('/', $request->currency_pair);
                    if (count($symbols) === 2) {
                        $baseSymbol = Symbol::where('symbol', $symbols[0])->first();
                        $quoteSymbol = Symbol::where('symbol', $symbols[1])->first();
                        if ($baseSymbol && $quoteSymbol) {
                            $currencyPair = CurrencyPair::where('base_symbol_id', $baseSymbol->id)
                                ->where('quote_symbol_id', $quoteSymbol->id)
                                ->first();
                        }
                    }
                }
            }

            $exchange = null;
            if ($request->exchange) {
                if (is_numeric($request->exchange)) {
                    $exchange = Exchange::find($request->exchange);
                } else {
                    $exchange = Exchange::where('code', strtoupper($request->exchange))
                        ->orWhere('name', $request->exchange)
                        ->first();
                }
            }

            $timePeriod = null;
            if ($request->timeframe) {
                if (is_numeric($request->timeframe)) {
                    $timePeriod = TimePeriod::find($request->timeframe);
                } else {
                    $timePeriod = TimePeriod::where('name', $request->timeframe)
                        ->orWhere('minutes', (int)$request->timeframe)
                        ->first();
                }
            }

            if (!$currencyPair || !$exchange || !$timePeriod) {
                return response()->json([
                    'error' => 'Торговая пара, биржа или тайм-фрейм не найдены',
                    'message' => 'Проверьте правильность указанных параметров'
                ], 404);
            }

            // Строим запрос
            $query = Candle::with(['currencyPair', 'exchange', 'timePeriod'])
                ->forPair($currencyPair->id)
                ->forExchange($exchange->id)
                ->forTimeframe($timePeriod->id)
                ->orderBy('open_time', 'desc');

            // Применяем фильтры по времени
            if ($request->from && $request->to) {
                $query->inTimeRange($request->from, $request->to);
            } elseif ($request->from) {
                $query->where('open_time', '>=', $request->from);
            } elseif ($request->to) {
                $query->where('open_time', '<=', $request->to);
            }

            // Применяем лимит
            $limit = $request->limit ?? 100;
            $candles = $query->limit($limit)->get();

            return CandleResource::collection($candles);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ошибка при получении данных',
                'message' => config('app.debug') ? $e->getMessage() : 'Внутренняя ошибка сервера'
            ], 500);
        }
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
                'message' => config('app.debug') ? $e->getMessage() : 'Внутренняя ошибка сервера'
            ], 500);
        }
    }

    /**
     * Получить статистику по свечам
     */
    public function stats(CandleRequest $request): JsonResponse
    {
        try {
            // Найдем валютную пару по ID или создадим фильтр по символам
            $currencyPair = null;
            if ($request->currency_pair) {
                if (is_numeric($request->currency_pair)) {
                    $currencyPair = CurrencyPair::find($request->currency_pair);
                } else {
                    // Попробуем найти по символу типа "BTC/USDT"
                    $symbols = explode('/', $request->currency_pair);
                    if (count($symbols) === 2) {
                        $baseSymbol = Symbol::where('symbol', $symbols[0])->first();
                        $quoteSymbol = Symbol::where('symbol', $symbols[1])->first();
                        if ($baseSymbol && $quoteSymbol) {
                            $currencyPair = CurrencyPair::where('base_symbol_id', $baseSymbol->id)
                                ->where('quote_symbol_id', $quoteSymbol->id)
                                ->first();
                        }
                    }
                }
            }

            $exchange = null;
            if ($request->exchange) {
                if (is_numeric($request->exchange)) {
                    $exchange = Exchange::find($request->exchange);
                } else {
                    $exchange = Exchange::where('code', strtoupper($request->exchange))
                        ->orWhere('name', $request->exchange)
                        ->first();
                }
            }

            $timePeriod = null;
            if ($request->timeframe) {
                if (is_numeric($request->timeframe)) {
                    $timePeriod = TimePeriod::find($request->timeframe);
                } else {
                    $timePeriod = TimePeriod::where('name', $request->timeframe)
                        ->orWhere('minutes', (int)$request->timeframe)
                        ->first();
                }
            }

            if ($request->currency_pair && !$currencyPair) {
                return response()->json(['error' => 'Торговая пара не найдена'], 404);
            }
            if ($request->exchange && !$exchange) {
                return response()->json(['error' => 'Биржа не найдена'], 404);
            }
            if ($request->timeframe && !$timePeriod) {
                return response()->json(['error' => 'Тайм-фрейм не найден'], 404);
            }

            // Для статистики требуются все параметры
            if (!$currencyPair || !$exchange || !$timePeriod) {
                return response()->json([
                    'error' => 'Для получения статистики требуются параметры: currency_pair, exchange, timeframe'
                ], 400);
            }

            $query = Candle::forPair($currencyPair->id)
                ->forExchange($exchange->id)
                ->forTimeframe($timePeriod->id);

            // Применяем фильтры по времени
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
                'message' => config('app.debug') ? $e->getMessage() : 'Внутренняя ошибка сервера'
            ], 500);
        }
    }
}
