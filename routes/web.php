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
use App\Models\AffiliationProfile;
use App\Models\DatabaseMember;
use App\Models\OrgStructureMember;
use App\Models\TeacherStaffMember;

// Public Homepage - no login required
Route::get('/', function () {
    return Inertia::render('Homepage', ['layout' => 'HomepageLayout']);
})->name('home');

// Peer Group page
Route::get('/peer-group', function () {
    return Inertia::render('PeerGroup/index', ['layout' => 'HomepageLayout']);
})->name('peer-group');

// Peer Group Detail page
Route::get('/peer-group/{id}', function ($id) {
    $affiliation = Affiliation::query()->where('id', $id)->orWhere('code', $id)->firstOrFail();
    $profile = AffiliationProfile::where('affiliation_id', $affiliation->id)->first();

    $totalMembers = DatabaseMember::query()
        ->where('organization_type', 'peer_group')
        ->where('affiliation_id', $affiliation->id)
        ->count();

    $profileLogoUrl = $profile && $profile->logo ? \Illuminate\Support\Facades\Storage::url($profile->logo) : null;
    $logoUrl = $profileLogoUrl ?? ($affiliation->logo ? \Illuminate\Support\Facades\Storage::url($affiliation->logo) : null);
    $coverImageUrl = $profile && $profile->cover_image ? \Illuminate\Support\Facades\Storage::url($profile->cover_image) : null;

    // Fetch org structure members
    $orgMembers = OrgStructureMember::query()
        ->where('organization_type', 'peer_group')
        ->where('affiliation_id', $affiliation->id)
        ->orderBy('position_order')
        ->orderBy('name')
        ->get()
        ->map(fn ($m) => [
            'id' => $m->id,
            'name' => $m->name,
            'position' => $m->position ?? '',
            'email' => $m->email ?? '',
            'photo' => $m->photo ? (str_starts_with($m->photo, 'http') ? $m->photo : \Illuminate\Support\Facades\Storage::url($m->photo)) : null,
        ])
        ->toArray();

    return Inertia::render('PeerGroup/PeerGroupDetail', [
        'layout' => 'HomepageLayout',
        'peerGroupId' => $id,
        'peerGroup' => [
            'id' => $affiliation->id,
            'code' => $affiliation->code,
            'name' => $affiliation->code,
            'fullName' => $affiliation->name,
            'subTitle' => $profile->sub_title ?? '',
            'logo' => $logoUrl,
            'image' => $coverImageUrl,
            'members' => $totalMembers,
            'description' => $profile->description ?? '',
            'registrationInfo' => $profile->registration_info ?? '',
            'registrationUrl' => $profile->registration_url ?? '',
            'contact' => [
                'address' => $profile->contact_address ?? '',
                'phone' => $profile->contact_phone ?? '',
                'email' => $profile->contact_email ?? '',
                'website' => $profile->contact_website ?? '',
            ],
            'orgStructure' => $orgMembers,
        ],
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
    $affiliation = Affiliation::query()->where('id', $id)->orWhere('code', $id)->firstOrFail();
    $profile = AffiliationProfile::where('affiliation_id', $affiliation->id)->first();

    $activeFellows = DatabaseMember::query()
        ->where('organization_type', 'fellow')
        ->where('affiliation_id', $affiliation->id)
        ->where('status', 'active')
        ->count();

    $profileLogoUrl = $profile && $profile->logo ? \Illuminate\Support\Facades\Storage::url($profile->logo) : null;
    $logoUrl = $profileLogoUrl ?? ($affiliation->logo ? \Illuminate\Support\Facades\Storage::url($affiliation->logo) : null);
    $coverImageUrl = $profile && $profile->cover_image ? \Illuminate\Support\Facades\Storage::url($profile->cover_image) : null;

    // Fetch org structure members
    $orgMembers = OrgStructureMember::query()
        ->where('organization_type', 'fellow')
        ->where('affiliation_id', $affiliation->id)
        ->orderBy('position_order')
        ->orderBy('name')
        ->get()
        ->map(fn ($m) => [
            'id' => $m->id,
            'name' => $m->name,
            'position' => $m->position ?? '',
            'email' => $m->email ?? '',
            'photo' => $m->photo ? (str_starts_with($m->photo, 'http') ? $m->photo : \Illuminate\Support\Facades\Storage::url($m->photo)) : null,
        ])
        ->toArray();

    return Inertia::render('ProfileStudyProgram/ClinicalFellowshipDetail', [
        'fellowshipId' => $id,
        'fellowship' => [
            'id' => $affiliation->id,
            'code' => $affiliation->code,
            'name' => $affiliation->name,
            'title' => 'Clinical Fellowship',
            'subTitle' => $profile->sub_title ?? '',
            'logo' => $logoUrl,
            'image' => $coverImageUrl,
            'stats' => [
                'fellowActive' => $activeFellows,
                'staffPendidik' => count($orgMembers),
                'rsPendidikan' => 0,
            ],
            'profileSingkat' => $profile->description ?? '',
            'contact' => [
                'address' => $profile->contact_address ?? '',
                'phone' => $profile->contact_phone ?? '',
                'website' => $profile->contact_website ?? '',
            ],
            'registration' => [
                'info' => $profile->registration_info ?? '',
                'url' => $profile->registration_url ?? '',
            ],
            'orgStructure' => $orgMembers,
            'staff' => [],
            'students' => [],
        ],
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
    $affiliation = Affiliation::query()->where('code', $code)->firstOrFail();
    $profile = AffiliationProfile::where('affiliation_id', $affiliation->id)->first();
    $orgType = $type === 'ppds1' ? 'resident' : ($type === 'subspesialis' ? 'trainee' : null);

    $activeResidents = 0;
    if ($orgType !== null) {
        $activeResidents = DatabaseMember::query()
            ->where('organization_type', $orgType)
            ->where('affiliation_id', $affiliation->id)
            ->where('status', 'active')
            ->count();
    }

    // Educational Dashboard stats from database_members
    $dbBaseQuery = DatabaseMember::query()
        ->where('organization_type', $orgType ?? 'resident')
        ->where('affiliation_id', $affiliation->id);

    $totalResidents = (clone $dbBaseQuery)->count();
    $activeResidentsCount = (clone $dbBaseQuery)->where('status', 'active')->count();
    $graduatedCount = (clone $dbBaseQuery)->where('status', 'graduated')->count();
    $leaveCount = (clone $dbBaseQuery)->where('status', 'leave')->count();

    $educationalDashboard = [
        'resident' => [
            'active' => $activeResidentsCount,
            'total' => $totalResidents,
        ],
        'alumni' => [
            'count' => $graduatedCount,
            'total' => $totalResidents,
        ],
    ];

    // Resolve image URLs — prefer profile logo, fallback to affiliation logo
    $profileLogoUrl = $profile && $profile->logo ? \Illuminate\Support\Facades\Storage::url($profile->logo) : null;
    $logoUrl = $profileLogoUrl ?? ($affiliation->logo ? \Illuminate\Support\Facades\Storage::url($affiliation->logo) : null);
    $coverImageUrl = $profile && $profile->cover_image ? \Illuminate\Support\Facades\Storage::url($profile->cover_image) : null;

    // Fetch org structure members for this affiliation
    $orgMembers = OrgStructureMember::query()
        ->where('organization_type', $orgType ?? 'resident')
        ->where('affiliation_id', $affiliation->id)
        ->orderBy('position_order')
        ->orderBy('name')
        ->get()
        ->map(fn ($m) => [
            'id' => $m->id,
            'name' => $m->name,
            'position' => $m->position ?? '',
            'email' => $m->email ?? '',
            'photo' => $m->photo ? (str_starts_with($m->photo, 'http') ? $m->photo : \Illuminate\Support\Facades\Storage::url($m->photo)) : null,
        ])
        ->toArray();

    // Fetch teacher staff members for this affiliation
    $teacherStaff = TeacherStaffMember::query()
        ->where('affiliation_id', $affiliation->id)
        ->with('division:id,name')
        ->orderBy('name')
        ->get()
        ->map(fn ($m) => [
            'id' => $m->id,
            'name' => $m->name,
            'institution_origin' => $m->institution_origin ?? '',
            'division' => $m->division?->name ?? '',
            'photo' => $m->photo ? (str_starts_with($m->photo, 'http') ? $m->photo : \Illuminate\Support\Facades\Storage::url($m->photo)) : null,
        ])
        ->toArray();

    return Inertia::render('ProfileStudyProgram/StudyProgramDetail', [
        'type' => $type,
        'university' => [
            'id' => $affiliation->id,
            'code' => $affiliation->code,
            'name' => $affiliation->code,
            'fullName' => $affiliation->name,
            'logo' => $logoUrl,
            'subTitle' => $profile->sub_title ?? '',
            'description' => $profile->description ?? ($type === 'ppds1' ? 'PPDS I Orthopaedi & Traumatologi' : 'Subspesialis Orthopaedi & Traumatologi'),
            'image' => $coverImageUrl,
            'stats' => [
                'activeResidents' => $activeResidents,
                'faculty' => count($orgMembers),
                'teachingHospitals' => 0,
            ],
            'contact' => [
                'address' => $profile->contact_address ?? '',
                'email' => $profile->contact_email ?? '',
                'phone' => $profile->contact_phone ?? '',
                'website' => $profile->contact_website ?? '',
            ],
            'information' => [
                'accreditation' => $profile->accreditation ?? '',
                'established' => $profile->established_year ?? '',
                'duration' => $profile->program_duration ?? '',
                'capacity' => $profile->capacity ?? '',
            ],
            'registrationInfo' => $profile->registration_info ?? '',
            'registrationUrl' => $profile->registration_url ?? '',
            'educationalDashboard' => $educationalDashboard,
            'orgStructure' => $orgMembers,
            'teacherStaff' => $teacherStaff,
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

        // Affiliation Profile Editor
        Route::get('/affiliation-profile', function () {
            return Inertia::render('AffiliationProfile/index');
        })->name('affiliation-profile');

        // Organizational Structure
        Route::get('/org-structure', function () {
            return Inertia::render('OrgStructure/index');
        })->name('org-structure');

        // Generic coming soon page for not-yet-developed CMS menus
        Route::get('/coming-soon/{slug}', function ($slug) {
            return Inertia::render('ComingSoon', ['slug' => $slug]);
        })->name('coming-soon');

    });

Route::fallback(function () {
    return Inertia::render('NotFound');
})->name('fallback');
