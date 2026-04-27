<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CalendarController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SourceController;
use App\Http\Controllers\Api\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'googleAuth']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    
    // Calendar routes
    Route::get('/calendar/events', [CalendarController::class, 'index']);
    Route::post('/calendar/events', [CalendarController::class, 'store']);
    Route::put('/calendar/events/{id}', [CalendarController::class, 'update']);
    Route::delete('/calendar/events/{id}', [CalendarController::class, 'destroy']);
    Route::get('/calendar/events/{id}', [CalendarController::class, 'show']);

    // Leads routes
    Route::apiResource('/leads', LeadController::class);

    // Other protected routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/sources', [SourceController::class, 'index']);
    Route::get('/users', [UserController::class, 'index']);
});