<?php

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// API endpoints pour le front React
Route::prefix('api')->group(function () {
    // Health check endpoint
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'timestamp' => now()]);
    });

    Route::get('/message', [ApiController::class, 'message']);

    // VTOM API proxy endpoints
    Route::get('/vtom/environments', [ApiController::class, 'vtomEnvironments']);
    Route::get('/vtom/environments/{environment}/applications', [ApiController::class, 'vtomApplications']);
    Route::get('/vtom/users', [ApiController::class, 'vtomUsers']);
});
