<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AgendaEventController;
use App\Http\Controllers\AffiliationController;
use App\Http\Controllers\DatabaseMemberController;
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
    Route::post('roles', [RoleController::class, 'store']);
    Route::put('roles/{roleName}', [RoleController::class, 'update']);
    Route::delete('roles/{role}', [RoleController::class, 'destroy']);

    // Permission routes
    Route::get('permissions', [RoleController::class, 'getAllPermissions']);
    Route::post('permissions', [RoleController::class, 'storePermission']);
    Route::put('permissions/{permission}', [RoleController::class, 'updatePermission']);
    Route::delete('permissions/{permission}', [RoleController::class, 'destroyPermission']);

    // Affiliation routes
    Route::apiResource('affiliations', AffiliationController::class);
    Route::get('users/{user}/affiliations', [AffiliationController::class, 'getUserAffiliations']);
    Route::post('users/{user}/affiliations', [AffiliationController::class, 'assignUserAffiliations']);

    // Agenda (CMS) routes
    Route::get('agenda-events', [AgendaEventController::class, 'index']);
    Route::post('agenda-events/upload-image', [AgendaEventController::class, 'uploadImage']);
    Route::post('agenda-events', [AgendaEventController::class, 'store']);
    Route::put('agenda-events/{agendaEvent}', [AgendaEventController::class, 'update']);
    Route::delete('agenda-events/{agendaEvent}', [AgendaEventController::class, 'destroy']);
    Route::post('agenda-events/{agendaEvent}/upload-image', [AgendaEventController::class, 'uploadImageForEvent']);
    Route::post('agenda-events/{agendaEvent}/publish', [AgendaEventController::class, 'publish']);
    Route::post('agenda-events/{agendaEvent}/unpublish', [AgendaEventController::class, 'unpublish']);

    // Database Members (CMS) routes
    Route::get('database-members', [DatabaseMemberController::class, 'index']);
    Route::get('database-members/affiliations', [DatabaseMemberController::class, 'affiliations']);
    Route::get('database-members/export-excel', [DatabaseMemberController::class, 'exportExcel']);
    Route::post('database-members/upload-photo', [DatabaseMemberController::class, 'uploadPhoto']);
    Route::post('database-members/import-excel', [DatabaseMemberController::class, 'importExcel']);
    Route::post('database-members', [DatabaseMemberController::class, 'store']);
    Route::put('database-members/{databaseMember}', [DatabaseMemberController::class, 'update']);
    Route::delete('database-members/{databaseMember}', [DatabaseMemberController::class, 'destroy']);
    Route::post('database-members/{databaseMember}/upload-photo', [DatabaseMemberController::class, 'uploadPhotoForMember']);
});

// Public agenda routes (landing pages)
Route::get('public/agenda-events', [AgendaEventController::class, 'publicIndex']);
Route::get('public/affiliations', [AffiliationController::class, 'publicIndex']);