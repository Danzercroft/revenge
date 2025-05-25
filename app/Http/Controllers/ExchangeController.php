<?php

namespace App\Http\Controllers;

use App\Models\Exchange;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExchangeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exchanges = Exchange::paginate(10);
        
        return Inertia::render('exchanges/index', [
            'exchanges' => $exchanges
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('exchanges/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:exchanges',
            'environment' => 'required|string|in:sandbox,production',
            'api_key' => 'nullable|string|max:255',
            'api_secret' => 'nullable|string|max:255',
            'api_passphrase' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        $exchange = Exchange::create($validated);

        return redirect()->route('exchanges.index')
            ->with('success', 'Биржа успешно создана');
    }

    /**
     * Display the specified resource.
     */
    public function show(Exchange $exchange)
    {
        return Inertia::render('exchanges/show', [
            'exchange' => $exchange
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exchange $exchange)
    {
        return Inertia::render('exchanges/edit', [
            'exchange' => $exchange
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exchange $exchange)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:exchanges,code,' . $exchange->id,
            'environment' => 'required|string|in:sandbox,production',
            'api_key' => 'nullable|string|max:255',
            'api_secret' => 'nullable|string|max:255',
            'api_passphrase' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        // Удаляем пустые API поля из массива обновления
        $updateData = array_filter($validated, function($value, $key) {
            if (in_array($key, ['api_key', 'api_secret', 'api_passphrase'])) {
                return !empty($value);
            }
            return true;
        }, ARRAY_FILTER_USE_BOTH);

        $exchange->update($updateData);

        return redirect()->route('exchanges.index')
            ->with('success', 'Биржа успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exchange $exchange)
    {
        $exchange->delete();

        return redirect()->route('exchanges.index')
            ->with('success', 'Биржа успешно удалена');
    }
}
