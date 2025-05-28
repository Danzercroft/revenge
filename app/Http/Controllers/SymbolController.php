<?php

namespace App\Http\Controllers;

use App\Models\Symbol;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SymbolController extends Controller
{
    public function index(): \Inertia\Response
    {
        $symbols = Symbol::orderBy('name')->paginate(20);
        
        return Inertia::render('symbols/index', [
            'symbols' => $symbols
        ]);
    }

    public function create(): \Inertia\Response
    {
        return Inertia::render('symbols/create');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:20|unique:symbols',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        Symbol::create($validated);

        return redirect()->route('symbols.index')
            ->with('success', 'Символ успешно создан.');
    }

    public function show(Symbol $symbol): \Inertia\Response
    {
        return Inertia::render('symbols/show', [
            'symbol' => $symbol
        ]);
    }

    public function edit(Symbol $symbol): \Inertia\Response
    {
        return Inertia::render('symbols/edit', [
            'symbol' => $symbol
        ]);
    }

    public function update(Request $request, Symbol $symbol): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:20|unique:symbols,symbol,' . $symbol->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $symbol->update($validated);

        return redirect()->route('symbols.index')
            ->with('success', 'Символ успешно обновлен.');
    }

    public function destroy(Symbol $symbol): \Illuminate\Http\RedirectResponse
    {
        $symbol->delete();

        return redirect()->route('symbols.index')
            ->with('success', 'Символ успешно удален.');
    }
}