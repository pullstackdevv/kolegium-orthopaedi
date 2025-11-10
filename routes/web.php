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
Route::middleware([Authenticate::class, HandleInertiaRequests::class])
    ->prefix('cms')
    ->name('cms.')
    ->group(function () {
        Route::get('/', function () {
            return redirect()->route('cms.dashboard');
        });


        Route::get('/logout', function () {
            Auth::logout();
            return redirect()->route('login');
        })->name('logout');

        Route::get('/dashboard', function () {
            return redirect()->route('cms.settings.user');
        })->name('dashboard');


        // Settings
        Route::get('/settings', function () {
            return redirect()->route('cms.settings.user');
        })->name('settings.index');

        Route::get('/settings/user', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'user']);
        })->name('settings.user');

        Route::get('/settings/role', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'role']);
        })->name('settings.role');

        // User management routes
        Route::get('/settings/users/create', function () {
            return Inertia::render('Settings/AddEditUser', ['mode' => 'create']);
        })->name('settings.users.create');

        Route::get('/settings/users/{id}/edit', function ($id) {
            return Inertia::render('Settings/AddEditUser', ['mode' => 'edit', 'userId' => $id]);
        })->name('settings.users.edit');


        // Change Password Route
        Route::post('/change-password', [\App\Http\Controllers\UserController::class, 'changePasswordWeb'])->name('change-password');

    });

Route::fallback(function () {
    return Inertia::render('NotFound');
})->name('fallback');
