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
use App\Http\Controllers\TeacherStaffMemberController;
use App\Http\Controllers\TeachingHospitalController;
use App\Http\Controllers\SpecializationController;
use App\Http\Controllers\MemberAchievementController;
use App\Http\Controllers\GalleryController;
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

// Database Members - Public Search (for Well-Being Survey verification)
Route::get('database-members/search', [DatabaseMemberController::class, 'search']);

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

    // Teacher Staff Members (CMS) routes
    Route::get('teacher-staff-members', [TeacherStaffMemberController::class, 'index']);
    Route::get('teacher-staff-members/affiliations', [TeacherStaffMemberController::class, 'affiliations']);
    Route::get('teacher-staff-members/divisions', [TeacherStaffMemberController::class, 'divisions']);
    Route::post('teacher-staff-members/upload-photo', [TeacherStaffMemberController::class, 'uploadPhoto']);
    Route::post('teacher-staff-members', [TeacherStaffMemberController::class, 'store']);
    Route::put('teacher-staff-members/{teacherStaffMember}', [TeacherStaffMemberController::class, 'update']);
    Route::delete('teacher-staff-members/{teacherStaffMember}', [TeacherStaffMemberController::class, 'destroy']);
    Route::post('teacher-staff-members/{teacherStaffMember}/upload-photo', [TeacherStaffMemberController::class, 'uploadPhotoForMember']);

    // Teaching Hospitals (CMS) routes
    Route::get('teaching-hospitals', [TeachingHospitalController::class, 'index']);
    Route::post('teaching-hospitals', [TeachingHospitalController::class, 'store']);
    Route::put('teaching-hospitals/{teachingHospital}', [TeachingHospitalController::class, 'update']);
    Route::delete('teaching-hospitals/{teachingHospital}', [TeachingHospitalController::class, 'destroy']);

    // Specializations (CMS) routes
    Route::get('specializations', [SpecializationController::class, 'index']);
    Route::post('specializations', [SpecializationController::class, 'store']);
    Route::put('specializations/{specialization}', [SpecializationController::class, 'update']);
    Route::delete('specializations/{specialization}', [SpecializationController::class, 'destroy']);

    // Member Achievements (CMS) routes
    Route::get('member-achievements', [MemberAchievementController::class, 'index']);
    Route::post('member-achievements', [MemberAchievementController::class, 'store']);
    Route::put('member-achievements/{memberAchievement}', [MemberAchievementController::class, 'update']);
    Route::delete('member-achievements/{memberAchievement}', [MemberAchievementController::class, 'destroy']);

    // Gallery (CMS) routes
    Route::get('galleries', [GalleryController::class, 'index']);
    Route::get('galleries/affiliations', [GalleryController::class, 'affiliations']);
    Route::post('galleries/upload-photo', [GalleryController::class, 'uploadPhoto']);
    Route::post('galleries', [GalleryController::class, 'store']);
    Route::put('galleries/{gallery}', [GalleryController::class, 'update']);
    Route::delete('galleries/{gallery}', [GalleryController::class, 'destroy']);
});

// Public agenda routes (landing pages)
Route::get('public/agenda-events', [AgendaEventController::class, 'publicIndex']);
Route::get('public/affiliations', [AffiliationController::class, 'publicIndex']);
Route::get('public/database-members', [DatabaseMemberController::class, 'publicIndex']);
Route::get('public/database-members/all', [DatabaseMemberController::class, 'publicIndexAll']);
Route::get('public/database-members/dashboard-stats', [DatabaseMemberController::class, 'publicDashboardStats']);
Route::get('public/member-achievements', [MemberAchievementController::class, 'publicIndex']);

// Well-Being Survey Routes - Public (submit survey + public stats)
Route::post('wellbeing-surveys', [WellbeingSurveyController::class, 'store']);
Route::get('wellbeing-surveys/{surveyId}/result', [WellbeingSurveyController::class, 'getResult']);
Route::get('public/wellbeing-surveys/stats', [WellbeingSurveyController::class, 'publicStats']);

// Well-Being Survey Routes - Protected (admin/analytics)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('wellbeing-surveys/stats', [WellbeingSurveyController::class, 'getStats']);
    Route::get('wellbeing-surveys', [WellbeingSurveyController::class, 'list']);
});

// Org Structure Members - Public
Route::get('public/org-structure-members', [OrgStructureMemberController::class, 'publicIndex']);
Route::get('public/teacher-staff-members', [TeacherStaffMemberController::class, 'publicIndex']);

// Teaching Hospitals - Public
Route::get('public/teaching-hospitals', [TeachingHospitalController::class, 'publicIndex']);

// Specializations - Public
Route::get('public/specializations', [SpecializationController::class, 'publicIndex']);

// Affiliation lookup by code (public)
Route::get('affiliations/by-code/{code}', [AffiliationController::class, 'getByCode']);

// Affiliation Profile - Public
Route::get('public/affiliation-profiles/{affiliationId}', [AffiliationProfileController::class, 'publicShow']);

// Gallery - Public
Route::get('public/galleries', [GalleryController::class, 'publicIndex']);