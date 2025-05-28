<?php

namespace App\Http\Controllers;

use App\Models\TimePeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimePeriodController extends Controller
{
    public function index(): \Inertia\Response
    {
        $timePeriods = TimePeriod::orderBy('name')->paginate(20);
        
        return Inertia::render('time-periods/index', [
            'timePeriods' => $timePeriods
        ]);
    }

    public function create(): \Inertia\Response
    {
        return Inertia::render('time-periods/create');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'minutes' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        TimePeriod::create($validated);

        return redirect()->route('time-periods.index')
            ->with('success', 'Временной период успешно создан.');
    }

    public function show(TimePeriod $timePeriod): \Inertia\Response
    {
        return Inertia::render('time-periods/show', [
            'timePeriod' => $timePeriod
        ]);
    }

    public function edit(TimePeriod $timePeriod): \Inertia\Response
    {
        return Inertia::render('time-periods/edit', [
            'timePeriod' => $timePeriod
        ]);
    }

    public function update(Request $request, TimePeriod $timePeriod): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'minutes' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $timePeriod->update($validated);

        return redirect()->route('time-periods.index')
            ->with('success', 'Временной период успешно обновлен.');
    }

    public function destroy(TimePeriod $timePeriod): \Illuminate\Http\RedirectResponse
    {
        $timePeriod->delete();

        return redirect()->route('time-periods.index')
            ->with('success', 'Временной период успешно удален.');
    }
}