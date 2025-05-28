<?php

namespace App\Http\Controllers;

use App\Models\ExchangeConfiguration;
use App\Models\Exchange;
use App\Models\CurrencyPair;
use App\Models\TimePeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ExchangeConfigurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ExchangeConfiguration::with(['exchange', 'currencyPair.baseSymbol', 'currencyPair.quoteSymbol', 'timePeriod']);

        // Фильтрация по бирже
        if ($request->filled('exchange_id')) {
            $query->byExchange($request->exchange_id);
        }

        // Фильтрация по временному интервалу
        if ($request->filled('time_period_id')) {
            $query->byTimePeriod($request->time_period_id);
        }

        // Фильтрация по активности
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $configurations = $query->latest()->paginate(15)->withQueryString();

        // Данные для фильтров
        $exchanges = Exchange::active()->get(['id', 'name']);
        $timePeriods = TimePeriod::active()->get(['id', 'name']);

        return Inertia::render('exchange-configurations/index', [
            'configurations' => $configurations,
            'exchanges' => $exchanges,
            'timePeriods' => $timePeriods,
            'filters' => $request->only(['exchange_id', 'time_period_id', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $exchanges = Exchange::active()->get(['id', 'name']);
        $currencyPairs = CurrencyPair::with(['baseSymbol', 'quoteSymbol'])->active()->get();
        $timePeriods = TimePeriod::active()->get(['id', 'name']);

        return Inertia::render('exchange-configurations/create', [
            'exchanges' => $exchanges,
            'currencyPairs' => $currencyPairs,
            'timePeriods' => $timePeriods,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'exchange_id' => ['required', 'exists:exchanges,id'],
            'currency_pair_id' => ['required', 'exists:currency_pairs,id'],
            'time_period_id' => ['required', 'exists:time_periods,id'],
            'is_active' => ['boolean'],
            'additional_config' => ['nullable', 'array'],
        ]);

        // Проверяем уникальность комбинации
        $exists = ExchangeConfiguration::where('exchange_id', $validated['exchange_id'])
            ->where('currency_pair_id', $validated['currency_pair_id'])
            ->where('time_period_id', $validated['time_period_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['combination' => 'Такая конфигурация уже существует.']);
        }

        ExchangeConfiguration::create($validated);

        return redirect()->route('exchange-configurations.index')
            ->with('success', 'Конфигурация биржи создана успешно.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ExchangeConfiguration $exchangeConfiguration)
    {
        $exchangeConfiguration->load(['exchange', 'currencyPair.baseSymbol', 'currencyPair.quoteSymbol', 'timePeriod']);

        return Inertia::render('exchange-configurations/show', [
            'configuration' => $exchangeConfiguration,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExchangeConfiguration $exchangeConfiguration)
    {
        $exchangeConfiguration->load(['exchange', 'currencyPair', 'timePeriod']);
        
        $exchanges = Exchange::active()->get(['id', 'name']);
        $currencyPairs = CurrencyPair::with(['baseSymbol', 'quoteSymbol'])->active()->get();
        $timePeriods = TimePeriod::active()->get(['id', 'name']);

        return Inertia::render('exchange-configurations/edit', [
            'configuration' => $exchangeConfiguration,
            'exchanges' => $exchanges,
            'currencyPairs' => $currencyPairs,
            'timePeriods' => $timePeriods,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExchangeConfiguration $exchangeConfiguration)
    {
        $validated = $request->validate([
            'exchange_id' => ['required', 'exists:exchanges,id'],
            'currency_pair_id' => ['required', 'exists:currency_pairs,id'],
            'time_period_id' => ['required', 'exists:time_periods,id'],
            'is_active' => ['boolean'],
            'additional_config' => ['nullable', 'array'],
        ]);

        // Проверяем уникальность комбинации (исключая текущую запись)
        $exists = ExchangeConfiguration::where('exchange_id', $validated['exchange_id'])
            ->where('currency_pair_id', $validated['currency_pair_id'])
            ->where('time_period_id', $validated['time_period_id'])
            ->where('id', '!=', $exchangeConfiguration->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['combination' => 'Такая конфигурация уже существует.']);
        }

        $exchangeConfiguration->update($validated);

        return redirect()->route('exchange-configurations.index')
            ->with('success', 'Конфигурация биржи обновлена успешно.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExchangeConfiguration $exchangeConfiguration)
    {
        $exchangeConfiguration->delete();

        return redirect()->route('exchange-configurations.index')
            ->with('success', 'Конфигурация биржи удалена успешно.');
    }
}
