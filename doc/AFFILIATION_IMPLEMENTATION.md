# IMPLEMENTASI MODUL AFFILIATION

## Overview
Modul AFFILIATION telah berhasil diimplementasikan untuk sistem CMS Kolegium Orthopaedi. Modul ini memungkinkan setiap user memiliki penempatan organisasi (affiliation) dan membatasi akses data berdasarkan affiliation tersebut.

## File yang Dibuat

### 1. Migration Files
- `database/migrations/2025_12_23_000001_create_affiliations_table.php`
  - Membuat tabel `affiliations` dengan kolom: id, name, type, code, timestamps
  - Index pada kolom type dan code
  
- `database/migrations/2025_12_23_000002_create_user_affiliations_table.php`
  - Membuat tabel pivot `user_affiliations` untuk relasi many-to-many
  - Foreign key ke users dan affiliations dengan ON DELETE CASCADE
  - Unique constraint pada (user_id, affiliation_id)
  
- `database/migrations/2025_12_23_000003_add_affiliation_id_to_agenda_events_table.php`
  - Menambahkan kolom `affiliation_id` ke tabel `agenda_events`
  - Foreign key ke affiliations dengan NULL ON DELETE

### 2. Model Files
- `app/Models/Affiliation.php`
  - Relasi: belongsToMany User, hasMany UserAffiliation, hasMany AgendaEvent
  
- `app/Models/UserAffiliation.php`
  - Model pivot dengan relasi belongsTo User dan Affiliation
  
- **Updated:** `app/Models/User.php`
  - Ditambahkan relasi: belongsToMany Affiliation, hasMany UserAffiliation
  
- **Updated:** `app/Models/AgendaEvent.php`
  - Ditambahkan kolom affiliation_id ke fillable
  - Ditambahkan relasi: belongsTo Affiliation
  - Menggunakan trait HasAffiliationScope

### 3. Trait
- `app/Traits/HasAffiliationScope.php`
  - Menyediakan scope query untuk filtering berdasarkan affiliation
  - Method: `scopeForUserAffiliations()`, `scopeForAffiliationType()`, `scopeForAffiliation()`

### 4. Seeder
- `database/seeders/AffiliationSeeder.php`
  - Data awal untuk 30+ affiliations meliputi:
    - 1 Kolegium
    - 12 Residen (FK berbagai universitas)
    - 5 Clinical Fellowship (RSUP)
    - 8 Subspesialis
    - 5 Peer Group

## Cara Menjalankan Migration

```bash
# Jalankan migration
php artisan migrate

# Jalankan seeder
php artisan db:seed --class=AffiliationSeeder
```

## Cara Menggunakan

### 1. Assign Affiliation ke User

```php
use App\Models\User;
use App\Models\Affiliation;

$user = User::find(1);
$affiliation = Affiliation::where('code', 'FK-UI')->first();

// Attach affiliation ke user
$user->affiliations()->attach($affiliation->id);

// Atau sync multiple affiliations
$user->affiliations()->sync([1, 2, 3]);
```

### 2. Query Agenda Events dengan Filtering Affiliation

```php
use App\Models\AgendaEvent;

// Otomatis filter berdasarkan affiliation user yang login
$events = AgendaEvent::forUserAffiliations()->get();

// Filter berdasarkan tipe affiliation
$events = AgendaEvent::forAffiliationType('residen')->get();

// Filter berdasarkan affiliation tertentu
$events = AgendaEvent::forAffiliation(1)->get();

// Super admin bisa lihat semua (tidak perlu scope)
if (auth()->user()->hasRole('super_admin')) {
    $events = AgendaEvent::all();
} else {
    $events = AgendaEvent::forUserAffiliations()->get();
}
```

### 3. Membuat Agenda Event dengan Affiliation

```php
use App\Models\AgendaEvent;

$event = AgendaEvent::create([
    'scope' => 'study_program',
    'type' => 'resident',
    'title' => 'Workshop Spine Surgery',
    'description' => 'Workshop untuk residen',
    'start_date' => '2025-01-15',
    'affiliation_id' => 2, // FK UI
    'created_by' => auth()->id(),
]);
```

### 4. Validasi User Harus Punya Affiliation

Tambahkan validasi di controller atau middleware:

```php
// Di controller registration atau user management
if ($user->affiliations()->count() === 0) {
    return redirect()->back()->withErrors([
        'affiliation' => 'User harus memiliki minimal 1 affiliation'
    ]);
}
```

## Tipe Affiliation

1. **kolegium** - Kolegium Orthopaedi dan Traumatologi
2. **residen** - Program Residen di berbagai FK
3. **clinical_fellowship** - Program Fellowship di RSUP
4. **subspesialis** - Subspesialis Orthopaedi
5. **peer_group** - Organisasi Peer Group

## Aturan Akses

- **Super Admin**: Akses ke semua affiliation
- **Admin Kolegium**: Hanya affiliation type = kolegium
- **Admin Residen**: Hanya affiliation type = residen
- **Admin CF**: Hanya affiliation type = clinical_fellowship
- **Admin Peer Group**: Hanya affiliation type = peer_group

## Contoh Implementasi di Controller

```php
namespace App\Http\Controllers;

use App\Models\AgendaEvent;
use Illuminate\Http\Request;

class AgendaEventController extends Controller
{
    public function index(Request $request)
    {
        $query = AgendaEvent::query();
        
        // Filter berdasarkan affiliation user
        if (!auth()->user()->hasRole('super_admin')) {
            $query->forUserAffiliations();
        }
        
        // Filter tambahan
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        $events = $query->orderBy('start_date', 'desc')->paginate(20);
        
        return view('agenda.index', compact('events'));
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'affiliation_id' => 'required|exists:affiliations,id',
            // ... validasi lainnya
        ]);
        
        // Validasi user punya akses ke affiliation ini
        if (!auth()->user()->hasRole('super_admin')) {
            $userAffiliationIds = auth()->user()->affiliations()->pluck('affiliations.id');
            
            if (!$userAffiliationIds->contains($validated['affiliation_id'])) {
                abort(403, 'Anda tidak memiliki akses ke affiliation ini');
            }
        }
        
        $validated['created_by'] = auth()->id();
        
        $event = AgendaEvent::create($validated);
        
        return redirect()->route('agenda.index')
            ->with('success', 'Event berhasil dibuat');
    }
}
```

## Testing

### Test Manual di Tinker

```bash
php artisan tinker
```

```php
// Cek affiliations
App\Models\Affiliation::count();
App\Models\Affiliation::where('type', 'residen')->get();

// Assign affiliation ke user
$user = App\Models\User::first();
$affiliation = App\Models\Affiliation::where('code', 'FK-UI')->first();
$user->affiliations()->attach($affiliation->id);

// Cek relasi
$user->affiliations;
$affiliation->users;

// Test scope
App\Models\AgendaEvent::forUserAffiliations($user)->count();
```

## Catatan Penting

1. **Setiap user WAJIB memiliki minimal 1 affiliation** - Implementasikan validasi ini di level aplikasi
2. **Query agenda WAJIB difilter** - Gunakan scope `forUserAffiliations()` di semua query kecuali super admin
3. **Tidak merusak struktur lama** - Semua tabel dan relasi lama tetap utuh
4. **Backward compatible** - Kolom affiliation_id di agenda_events nullable untuk data lama

## Next Steps (Opsional)

1. Buat middleware `EnsureUserHasAffiliation` untuk memastikan user punya affiliation
2. Buat form management affiliation di admin panel
3. Tambahkan filter affiliation di UI agenda
4. Buat report/dashboard per affiliation
5. Implementasi notification berbasis affiliation
