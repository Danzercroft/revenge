<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SymbolController;
use App\Http\Controllers\TimePeriodController;
use App\Http\Controllers\ExchangeController;
use App\Http\Controllers\CurrencyPairController;
use App\Http\Controllers\ExchangeConfigurationController;
use App\Http\Controllers\ChartController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('charts', [ChartController::class, 'index'])->name('charts');
});

Route::middleware('auth')->group(function () {
    Route::resource('symbols', SymbolController::class);
    Route::resource('time-periods', TimePeriodController::class);
    Route::resource('exchanges', ExchangeController::class);
    Route::resource('currency-pairs', CurrencyPairController::class);
    Route::resource('exchange-configurations', ExchangeConfigurationController::class);
});

// Register additional route files
require_once __DIR__.'/settings.php';
require __DIR__.'/auth.php';
