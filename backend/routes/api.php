<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PackageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DepartureController;
use App\Http\Controllers\Api\ReservationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/test', function () {
    return response()->json([
        'message' => 'API MANASIK fonctionne !'
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/packages', [PackageController::class, 'index']);
    Route::get('/packages/{package}', [PackageController::class, 'show']);
    
    Route::get('/departures', [DepartureController::class, 'index']);
    Route::get('/departures/{departure}', [DepartureController::class, 'show']);

  
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/test', function () {
        return response()->json([
            'message' => 'Bienvenue Admin MANASIK'
        ]);
    });
    Route::post('/packages', [PackageController::class, 'store']);
    Route::put('/packages/{package}', [PackageController::class, 'update']);
    Route::patch('/packages/{package}', [PackageController::class, 'update']);
    Route::delete('/packages/{package}', [PackageController::class, 'destroy']);

    Route::post('/departures', [DepartureController::class, 'store']);
        Route::put('/departures/{departure}', [DepartureController::class, 'update']);
        Route::patch('/departures/{departure}', [DepartureController::class, 'update']);
        Route::delete('/departures/{departure}', [DepartureController::class, 'destroy']);

           Route::get('/admin/reservations', [
            ReservationController::class,
            'adminIndex',
        ]);

        Route::patch('/admin/reservations/{reservation}/status', [
            ReservationController::class,
            'updateStatus',
        ]);
});


Route::middleware(['auth:sanctum', 'role:client'])->group(function () {
    Route::get('/client/test', function () {
        return response()->json([
            'message' => 'Bienvenue Client MANASIK'
        ]);
    });

    Route::get('/reservations', [
        ReservationController::class,
        'index',
    ]);

    Route::post('/reservations', [
        ReservationController::class,
        'store',
    ]);
});


