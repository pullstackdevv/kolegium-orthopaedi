<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Affiliation;
use App\Models\DatabaseMember;

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

// Database Members landing page (public) - using affiliation code
Route::get('/profile-study-program/{type}/{code}/database', function ($type, $code) {
    $affiliation = Affiliation::query()->select(['id', 'name', 'code', 'type'])->where('code', $code)->firstOrFail();

    return Inertia::render('ProfileStudyProgram/DatabaseMembersLanding', [
        'type' => $type,
        'affiliation' => $affiliation,
    ]);
})->where('type', 'ppds1|subspesialis')
->name('profile.university.database');

// PPDS1 and Subspesialis Detail (same layout) - using affiliation code
Route::get('/profile-study-program/{type}/{code}', function ($type, $code) {
    $affiliation = Affiliation::query()->select(['id', 'name', 'code', 'type'])->where('code', $code)->firstOrFail();
    $orgType = $type === 'ppds1' ? 'resident' : ($type === 'subspesialis' ? 'trainee' : null);

    $activeResidents = 0;
    if ($orgType !== null) {
        $activeResidents = DatabaseMember::query()
            ->where('organization_type', $orgType)
            ->where('affiliation_id', $affiliation->id)
            ->where('status', 'active')
            ->count();
    }

    return Inertia::render('ProfileStudyProgram/StudyProgramDetail', [
        'type' => $type,
        'university' => [
            'id' => $affiliation->id,
            'code' => $affiliation->code,
            'name' => $affiliation->code,
            'fullName' => $affiliation->name,
            'facultyName' => 'Faculty of Medicine',
            'universityName' => 'University of Indonesia',
            'description' => $type === 'ppds1' ? 'PPDS I Orthopaedi & Traumatologi' : 'Subspesialis Orthopaedi & Traumatologi',
            'image' => '/assets/images/university-building.jpg',
            'stats' => [
                'activeResidents' => $activeResidents,
                'faculty' => 30,
                'teachingHospitals' => 5,
            ],
            'profileResident' => [
                'name' => 'Dr. Ihsan Oesman, SpOT(K)',
                'position' => 'Head of Study Program',
                'image' => '/assets/images/profile-placeholder.jpg',
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            ],
            'contact' => [
                'address' => 'Jl. Salemba Raya No. 6, Jakarta Pusat',
                'email' => 'ortopedi@ui.ac.id',
                'phone' => '+62 21 391 0123',
                'website' => 'www.ortopedi-fkui.com',
            ],
            'information' => [
                'accreditation' => 'A - LAM PT Kes',
                'established' => '1960',
                'duration' => '8 Semester',
                'capacity' => '20 per tahun',
            ],
            'staffList' => [
                ['name' => 'Dr. dr. Ihsan Oesman, SpOT(K)', 'specialization' => 'Subsp.K.P'],
                ['name' => 'dr. Muhammad Rizqi Adhi Primaputra, SpOT(K)', 'specialization' => '@orthopaedi.id'],
                ['name' => 'dr. Ifran Saleh, SpOT(K)', 'specialization' => 'Spine Surgery'],
                ['name' => 'Prof. Dr. dr. Ismail Hadisoebroto Dilogo, SpO.T(K), Subsp.P.L', 'specialization' => 'Pediatric Ortho'],
                ['name' => 'Prof. Dr. dr. Andri MT Lubis, SpO.T(K), Subsp.C.O', 'specialization' => 'Trauma'],
                ['name' => 'Dr. dr. Aryadi Kurniawan, SpO.T(K), Subsp.A', 'specialization' => 'Joint Replacement'],
                ['name' => 'Prof. Dr. dr. Achmad Fauzi Kamal, SpOT(K)', 'specialization' => 'Hand Surgery'],
                ['name' => 'Dr. dr. Rahyussalim, SpO.T(K), Subsp.O. T.B', 'specialization' => 'Sports Medicine'],
                ['name' => 'Dr. dr. Ihsan Oesman, SpO.T(K), Subsp.K.P', 'specialization' => 'Spine Surgery'],
                ['name' => 'Dr. dr. Yogi Prabowo, SpO.T(K), Subsp.Onk. Ort.R', 'specialization' => 'Oncology'],
                ['name' => 'Dr. dr. Wahyu Widodo, SpO.T(K), Subsp.T.L. B.M', 'specialization' => 'Trauma'],
                ['name' => 'Dr. dr. Ludwig Andribert Powantia Pontoh, SpO.T(K), Subsp.P.L', 'specialization' => 'Pediatric Ortho'],
                ['name' => 'Dr. dr. Didik Librianto, SpOT(K)', 'specialization' => 'Hand Surgery'],
                ['name' => 'dr. Muhammad Rizqi Adhi Primaputra, SpOT(K)', 'specialization' => 'Joint Replacement'],
                ['name' => 'dr. Wildan Latief, SpO.T(K), Subsp.T.L. B.M', 'specialization' => 'Trauma'],
            ],
            'residents' => [
                'year1' => [
                    ['name' => 'Dr. Andi Wijaya'],
                    ['name' => 'Dr. Budi Hartono'],
                    ['name' => 'Dr. Citra Dewi'],
                    ['name' => 'Dr. Dedi Suryanto'],
                    ['name' => 'Dr. Eka Putri'],
                    ['name' => 'Dr. Fajar Ramadhan'],
                ],
                'year2' => [
                    ['name' => 'Dr. Gilang Pratama'],
                    ['name' => 'Dr. Hani Safitri'],
                    ['name' => 'Dr. Irfan Hakim'],
                    ['name' => 'Dr. Joko Susilo'],
                ],
            ],
            'gallery' => [
                ['image' => '/assets/images/gallery-1.jpg', 'title' => 'Kegiatan Pembelajaran'],
                ['image' => '/assets/images/gallery-2.jpg', 'title' => 'Workshop Orthopaedi'],
                ['image' => '/assets/images/gallery-3.jpg', 'title' => 'Seminar Nasional'],
                ['image' => '/assets/images/gallery-4.jpg', 'title' => 'Praktik Klinik'],
            ],
        ],
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

// Well-Being Survey Routes - Public Access
Route::get('/wellbeing-survey', [\App\Http\Controllers\WellbeingSurveyController::class, 'index'])
    ->name('wellbeing-survey.index');

Route::get('/wellbeing-survey/show', [\App\Http\Controllers\WellbeingSurveyController::class, 'show'])
    ->name('wellbeing-survey.show');

Route::post('/wellbeing-survey/submit', [\App\Http\Controllers\WellbeingSurveyController::class, 'store'])
    ->name('wellbeing-survey.store');

// Database Members - Public Access (Separate pages)
Route::get('/database-residents', function () {
    return Inertia::render('Database/DatabaseResidents');
})->name('database.residents');

Route::get('/database-fellows', function () {
    return Inertia::render('Database/DatabaseFellows');
})->name('database.fellows');

Route::get('/database-trainees', function () {
    return Inertia::render('Database/DatabaseTrainees');
})->name('database.trainees');

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

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

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
