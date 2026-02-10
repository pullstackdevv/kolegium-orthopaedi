<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AgendaEventController;
use App\Http\Controllers\AffiliationController;
use App\Http\Controllers\DatabaseMemberController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WellbeingSurveyController;
use App\Http\Controllers\AffiliationProfileController;
use App\Http\Controllers\OrgStructureMemberController;
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

    // Affiliation Profile (CMS) routes
    Route::get('affiliation-profiles', [AffiliationProfileController::class, 'show']);
    Route::post('affiliation-profiles', [AffiliationProfileController::class, 'upsert']);
    Route::post('affiliation-profiles/upload-cover', [AffiliationProfileController::class, 'uploadCoverImage']);
    Route::post('affiliation-profiles/upload-logo', [AffiliationProfileController::class, 'uploadLogo']);
    Route::delete('affiliation-profiles/{affiliationId}', [AffiliationProfileController::class, 'destroy']);

    // Provinces & Regencies
    Route::get('provinces', function () {
        return response()->json(\App\Models\Province::orderBy('name')->get(['id', 'name']));
    });
    Route::get('provinces/{province}/regencies', function (\App\Models\Province $province) {
        return response()->json($province->regencies()->orderBy('name')->get(['id', 'province_id', 'name']));
    });

    // Database Members (CMS) routes
    Route::get('database-members', [DatabaseMemberController::class, 'index']);
    Route::get('database-members/affiliations', [DatabaseMemberController::class, 'affiliations']);
    Route::get('database-members/export-excel', [DatabaseMemberController::class, 'exportExcel']);
    Route::get('database-members/template-excel', [DatabaseMemberController::class, 'templateExcel']);
    Route::post('database-members/upload-photo', [DatabaseMemberController::class, 'uploadPhoto']);
    Route::post('database-members/import-excel', [DatabaseMemberController::class, 'importExcel']);
    Route::post('database-members', [DatabaseMemberController::class, 'store']);
    Route::put('database-members/{databaseMember}', [DatabaseMemberController::class, 'update']);
    Route::delete('database-members/{databaseMember}', [DatabaseMemberController::class, 'destroy']);
    Route::post('database-members/{databaseMember}/upload-photo', [DatabaseMemberController::class, 'uploadPhotoForMember']);

    // Org Structure Members (CMS) routes
    Route::get('org-structure-members', [OrgStructureMemberController::class, 'index']);
    Route::get('org-structure-members/affiliations', [OrgStructureMemberController::class, 'affiliations']);
    Route::post('org-structure-members/upload-photo', [OrgStructureMemberController::class, 'uploadPhoto']);
    Route::post('org-structure-members', [OrgStructureMemberController::class, 'store']);
    Route::put('org-structure-members/{orgStructureMember}', [OrgStructureMemberController::class, 'update']);
    Route::delete('org-structure-members/{orgStructureMember}', [OrgStructureMemberController::class, 'destroy']);
    Route::post('org-structure-members/{orgStructureMember}/upload-photo', [OrgStructureMemberController::class, 'uploadPhotoForMember']);
});

// Database Members - Public Search (for Well-Being Survey verification)
Route::get('database-members/search', [DatabaseMemberController::class, 'search']);

// Public agenda routes (landing pages)
Route::get('public/agenda-events', [AgendaEventController::class, 'publicIndex']);
Route::get('public/affiliations', [AffiliationController::class, 'publicIndex']);
Route::get('public/database-members', [DatabaseMemberController::class, 'publicIndex']);
Route::get('public/database-members/all', [DatabaseMemberController::class, 'publicIndexAll']);

// Well-Being Survey Routes - Public (submit survey)
Route::post('wellbeing-surveys', [WellbeingSurveyController::class, 'store']);
Route::get('wellbeing-surveys/{surveyId}/result', [WellbeingSurveyController::class, 'getResult']);

// Well-Being Survey Routes - Protected (admin/analytics)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('wellbeing-surveys/stats', [WellbeingSurveyController::class, 'getStats']);
    Route::get('wellbeing-surveys', [WellbeingSurveyController::class, 'list']);
});

// Org Structure Members - Public
Route::get('public/org-structure-members', [OrgStructureMemberController::class, 'publicIndex']);

// Affiliation lookup by code (public)
Route::get('affiliations/by-code/{code}', [AffiliationController::class, 'getByCode']);

// Affiliation Profile - Public
Route::get('public/affiliation-profiles/{affiliationId}', [AffiliationProfileController::class, 'publicShow']);