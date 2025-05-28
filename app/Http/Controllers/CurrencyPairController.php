<?php

namespace App\Http\Controllers;

use App\Models\CurrencyPair;
use App\Models\Symbol;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencyPairController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        $currencyPairs = CurrencyPair::with(['baseSymbol', 'quoteSymbol'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pair) {
                return [
                    'id' => $pair->id,
                    'base_symbol' => $pair->baseSymbol,
                    'quote_symbol' => $pair->quoteSymbol,
                    'type' => $pair->type,
                    'display_name' => $pair->display_name,
                    'is_active' => $pair->is_active,
                    'created_at' => $pair->created_at,
                    'updated_at' => $pair->updated_at,
                ];
            });

        return Inertia::render('currency-pairs/index', [
            'currencyPairs' => $currencyPairs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        $symbols = Symbol::where('is_active', true)
            ->orderBy('symbol')
            ->get(['id', 'name', 'symbol']);

        return Inertia::render('currency-pairs/create', [
            'symbols' => $symbols,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'base_symbol_id' => 'required|exists:symbols,id',
            'quote_symbol_id' => 'required|exists:symbols,id|different:base_symbol_id',
            'type' => 'required|in:spot,futures',
            'is_active' => 'boolean',
        ]);

        CurrencyPair::create($request->all());

        return redirect()->route('currency-pairs.index')
            ->with('success', 'Валютная пара успешно создана.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CurrencyPair $currencyPair): \Inertia\Response
    {
        $currencyPair->load(['baseSymbol', 'quoteSymbol']);

        return Inertia::render('currency-pairs/show', [
            'currencyPair' => [
                'id' => $currencyPair->id,
                'base_symbol' => $currencyPair->baseSymbol,
                'quote_symbol' => $currencyPair->quoteSymbol,
                'type' => $currencyPair->type,
                'display_name' => $currencyPair->display_name,
                'is_active' => $currencyPair->is_active,
                'created_at' => $currencyPair->created_at,
                'updated_at' => $currencyPair->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CurrencyPair $currencyPair): \Inertia\Response
    {
        $symbols = Symbol::where('is_active', true)
            ->orderBy('symbol')
            ->get(['id', 'name', 'symbol']);

        $currencyPair->load(['baseSymbol', 'quoteSymbol']);

        return Inertia::render('currency-pairs/edit', [
            'currencyPair' => [
                'id' => $currencyPair->id,
                'base_symbol_id' => $currencyPair->base_symbol_id,
                'quote_symbol_id' => $currencyPair->quote_symbol_id,
                'type' => $currencyPair->type,
                'is_active' => $currencyPair->is_active,
                'baseSymbol' => $currencyPair->baseSymbol,
                'quoteSymbol' => $currencyPair->quoteSymbol,
            ],
            'symbols' => $symbols,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CurrencyPair $currencyPair): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'base_symbol_id' => 'required|exists:symbols,id',
            'quote_symbol_id' => 'required|exists:symbols,id|different:base_symbol_id',
            'type' => 'required|in:spot,futures',
            'is_active' => 'boolean',
        ]);

        $currencyPair->update($request->all());

        return redirect()->route('currency-pairs.index')
            ->with('success', 'Валютная пара успешно обновлена.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CurrencyPair $currencyPair): \Illuminate\Http\RedirectResponse
    {
        $currencyPair->delete();

        return redirect()->route('currency-pairs.index')
            ->with('success', 'Валютная пара успешно удалена.');
    }
}
