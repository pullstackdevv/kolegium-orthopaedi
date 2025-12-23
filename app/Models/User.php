<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\HasRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = ['role', 'permissions'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the primary role attribute (for frontend compatibility).
     * Returns the first role as an object with name property.
     */
    public function getRoleAttribute(): ?object
    {
        $primaryRole = $this->roles->first();
        
        if (!$primaryRole) {
            return null;
        }

        return (object) [
            'id' => $primaryRole->id,
            'name' => $primaryRole->name,
            'description' => $primaryRole->description,
        ];
    }

    /**
     * Get all permissions attribute (for frontend).
     */
    public function getPermissionsAttribute(): array
    {
        return $this->getAllPermissions();
    }

    /**
     * Get role description string.
     */
    public function getRoleDescription(): string
    {
        $roles = $this->roles;
        
        if ($roles->isEmpty()) {
            return 'Tidak ada akses';
        }

        return $roles->pluck('description')->implode(', ');
    }

    /**
     * Check if user is warehouse staff.
     */
    public function isWarehouse(): bool
    {
        return $this->hasRole('warehouse');
    }

    /**
     * Check if user is owner.
     */
    public function isOwner(): bool
    {
        return $this->hasRole('owner');
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function affiliations(): BelongsToMany
    {
        return $this->belongsToMany(Affiliation::class, 'user_affiliations')
            ->withTimestamps();
    }

    public function userAffiliations(): HasMany
    {
        return $this->hasMany(UserAffiliation::class);
    }
}
