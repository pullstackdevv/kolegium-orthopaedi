<?php

use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Middleware\Authenticate;
use App\Http\Controllers\WebOrderController;
use App\Http\Controllers\MidtransController;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/welcome', function () {
    return view('welcome');
})->name('welcome');

// Default public homepage
Route::get('/', function () {
    return redirect()->route('cms.auth.login');
})->name('home');

// Guest auth for CMS (admin area)
Route::middleware([RedirectIfAuthenticated::class])
    ->prefix('cms/auth')
    ->name('cms.auth.')
    ->group(function () {
        Route::get('login', function () {
            return Inertia::render('Auth/Login');
        })->name('login');

        Route::get('register', function () {
            return Inertia::render('Auth/Register');
        })->name('register');
    });


// Public CMS login route (used by auth middleware redirect)
Route::middleware([RedirectIfAuthenticated::class])
    ->get('/cms/login', function () {
        return Inertia::render('Auth/Login');
    })->name('login');

// Also support /login by redirecting to /cms/login (no route name to avoid conflicts)
Route::get('/login', function () {
    return redirect('/cms/login');
});

// CMS (admin) protected routes
Route::middleware([Authenticate::class, HandleInertiaRequests::class, \App\Http\Middleware\EnsureModulePermission::class])
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
            return Inertia::render('Dashboard');
        })->name('dashboard');


        // Settings
        Route::get('/settings', function () {
            return Inertia::render('Settings/index');
        })->name('settings.index');

        Route::get('/settings/general', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'general']);
        })->name('settings.general');

        Route::get('/settings/order', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'order']);
        })->name('settings.order');

        Route::get('/settings/product', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'product']);
        })->name('settings.product');

        Route::get('/settings/customer', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'customer']);
        })->name('settings.customer');

        Route::get('/settings/payment', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'payment']);
        })->name('settings.payment');

        Route::get('/settings/courier', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'courier']);
        })->name('settings.courier');

        Route::get('/settings/courier-rates', function () {
            return Inertia::render('Settings/CourierRates');
        })->name('settings.courier-rates');

        Route::get('/settings/origin', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'origin']);
        })->name('settings.origin');

        Route::get('/settings/template', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'template']);
        })->name('settings.template');

        Route::get('/settings/user', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'user']);
        })->name('settings.user');

        Route::get('/settings/role', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'role']);
        })->name('settings.role');

        Route::get('/settings/dashboard', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'dashboard']);
        })->name('settings.dashboard');

        Route::get('/settings/api', function () {
            return Inertia::render('Settings/index', ['activeMenu' => 'api']);
        })->name('settings.api');

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
