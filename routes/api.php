<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;


// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register'])
        ->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/me', function (Request $request) {
        return response()->json(Auth::user());
    });

    // User specific routes (harus sebelum apiResource)
    Route::get('users/role-permissions', [UserController::class, 'getRolePermissions']);
    Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::post('users/{user}/change-password', [UserController::class, 'changePassword']);
    
    // User CRUD
    Route::apiResource('users', UserController::class);

    // Role routes
    Route::get('roles', [RoleController::class, 'index']);
    Route::get('roles/permissions', [RoleController::class, 'getPermissions']);
    Route::put('roles/{roleName}', [RoleController::class, 'update']);
});