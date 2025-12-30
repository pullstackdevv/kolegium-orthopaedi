<?php

use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Public Homepage - no login required
Route::get('/', function () {
    return Inertia::render('Homepage', ['layout' => 'HomepageLayout']);
})->name('home');

// Peer Group page
Route::get('/peer-group', function () {
    return Inertia::render('PeerGroup', ['layout' => 'HomepageLayout']);
})->name('peer-group');

// Peer Group Detail page
Route::get('/peer-group/{id}', function ($id) {
    return Inertia::render('PeerGroupDetail', [
        'layout' => 'HomepageLayout',
        'peerGroupId' => $id
    ]);
})->name('peer-group.detail');

// Profile Study Program Routes - Public Access
Route::get('/profile-study-program/ppds1', function () {
    return Inertia::render('ProfileStudyProgram/PPDS1');
})->name('profile.ppds1');

Route::get('/profile-study-program/clinical-fellowship', function () {
    return Inertia::render('ProfileStudyProgram/ClinicalFellowship');
})->name('profile.clinical-fellowship');

Route::get('/profile-study-program/subspesialis', function () {
    return Inertia::render('ProfileStudyProgram/Subspesialis');
})->name('profile.subspesialis');

// University Detail Routes - Public Access
// Clinical Fellowship Detail (has different layout)
Route::get('/profile-study-program/clinical-fellowship/{id}', function ($id) {
    return Inertia::render('ProfileStudyProgram/ClinicalFellowshipDetail', [
        'fellowshipId' => $id
    ]);
})->name('profile.clinical-fellowship.detail');

// PPDS1 and Subspesialis Detail (same layout)
Route::get('/profile-study-program/{type}/{id}', function ($type, $id) {
    return Inertia::render('ProfileStudyProgram/UniversityDetail', [
        'type' => $type,
        'universityId' => $id
    ]);
})->where('type', 'ppds1|subspesialis')
->name('profile.university.detail');

// Resident Route - Public Access
Route::get('/resident', function () {
    return Inertia::render('Resident');
})->name('resident');

// Calendar Academic Route - Public Access
Route::get('/calendar-academic', function () {
    return Inertia::render('CalendarAcademic');
})->name('calendar.academic');

// About Us Route - Public Access
Route::get('/about-us', function () {
    return Inertia::render('AboutUs');
})->name('about.us');

// Login routes
Route::middleware('guest')->group(function () {
    // GET /cms/login - Show login page
    Route::get('/cms/login', function () {
        return Inertia::render('Auth/Login');
    })->name('login');

    // POST /cms/login - Process login
    Route::post('/cms/login', [\App\Http\Controllers\AuthController::class, 'webLogin'])
        ->name('login.post');

    // GET /cms/register - Show register page (optional)
    Route::get('/cms/register', function () {
        return Inertia::render('Auth/Register');
    })->name('register');
});

// CMS (admin) protected routes
// TEMPORARILY DISABLED EnsureModulePermission for debugging
Route::middleware([Authenticate::class])
    ->prefix('cms')
    ->name('cms.')
    ->group(function () {
        Route::get('/', function () {
            return redirect()->route('cms.dashboard');
        });


        Route::get('/logout', function (Request $request) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('login');
        })->name('logout');

        Route::get('/dashboard', function () {
            return redirect()->route('cms.coming-soon', ['slug' => 'dashboard']);
        })->name('dashboard');

        Route::get('/calendar', function () {
            return Inertia::render('Dashboard/Calendar');
        })->name('calendar');

        // Settings
        Route::get('/settings', function () {
            return Inertia::render('ComingSoon', ['slug' => 'settings-program']);
        })->name('settings.index');

        Route::get('/settings/user', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'user']);
        })->name('settings.user');

        Route::get('/settings/role', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'role']);
        })->name('settings.role');

        Route::get('/settings/permission', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'permission']);
        })->name('settings.permission');

        Route::get('/settings/affiliation', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'affiliation']);
        })->name('settings.affiliation');

        // Agenda
        Route::get('/agenda', [\App\Http\Controllers\AgendaEventController::class, 'cmsPage'])->name('agenda.index');

        // Database Members
        Route::get('/database', function () {
            return Inertia::render('Database/index');
        })->name('database.index');

        // User management routes
        Route::get('/settings/users/create', function () {
            return redirect()->route('cms.settings.user');
        })->name('settings.users.create');

        Route::get('/settings/users/{id}/edit', function ($id) {
            return redirect()->route('cms.settings.user');
        })->name('settings.users.edit');


        // Change Password Route
        Route::post('/change-password', [\App\Http\Controllers\UserController::class, 'changePasswordWeb'])->name('change-password');

        // Generic coming soon page for not-yet-developed CMS menus
        Route::get('/coming-soon/{slug}', function ($slug) {
            return Inertia::render('ComingSoon', ['slug' => $slug]);
        })->name('coming-soon');

    });

Route::fallback(function () {
    return Inertia::render('NotFound');
})->name('fallback');
