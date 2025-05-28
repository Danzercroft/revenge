<?php

use App\Http\Controllers\Api\CandleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Candles API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('candles')->group(function () {
    // Получить торговые свечи
    Route::get('/', [CandleController::class, 'index'])
        ->name('api.candles.index');
    
    // Получить метаданные (доступные пары, биржи, тайм-фреймы)
    Route::get('/meta', [CandleController::class, 'meta'])
        ->name('api.candles.meta');
    
    // Получить статистику по свечам
    Route::get('/stats', [CandleController::class, 'stats'])
        ->name('api.candles.stats');
});

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => config('app.version', '1.0.0'),
    ]);
})->name('api.health');
