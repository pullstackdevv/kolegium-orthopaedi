<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'is_system',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_system' => 'boolean',
    ];

    /**
     * Get the users that have this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_has_roles');
    }

    /**
     * Get the permissions for this role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_has_permissions');
    }

    /**
     * Check if role has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $permissions = $this->permissions()->pluck('name');
        
        // Owner has all permissions
        if ($permissions->contains('*')) {
            return true;
        }

        // Check exact permission
        if ($permissions->contains($permission)) {
            return true;
        }

        // Check wildcard permissions (e.g., 'orders.*' matches 'orders.view')
        foreach ($permissions as $perm) {
            if (str_ends_with($perm, '.*')) {
                $prefix = str_replace('.*', '', $perm);
                if (str_starts_with($permission, $prefix . '.')) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if role has any of the given permissions.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if role has all of the given permissions.
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Assign permission(s) to role.
     */
    public function givePermissionTo(string|array|Permission $permissions): self
    {
        $permissions = is_array($permissions) ? $permissions : [$permissions];

        foreach ($permissions as $permission) {
            $permModel = $permission instanceof Permission 
                ? $permission 
                : Permission::where('name', $permission)->firstOrFail();
            $this->permissions()->syncWithoutDetaching($permModel);
        }

        return $this;
    }

    /**
     * Remove permission(s) from role.
     */
    public function revokePermissionTo(string|array|Permission $permissions): self
    {
        $permissions = is_array($permissions) ? $permissions : [$permissions];

        foreach ($permissions as $permission) {
            $permModel = $permission instanceof Permission 
                ? $permission 
                : Permission::where('name', $permission)->first();
            if ($permModel) {
                $this->permissions()->detach($permModel);
            }
        }

        return $this;
    }

    /**
     * Sync permissions (replace all existing permissions).
     * Creates permissions if they don't exist.
     */
    public function syncPermissions(array $permissions): self
    {
        $permissionIds = collect($permissions)->map(function ($permission) {
            if ($permission instanceof Permission) {
                return $permission->id;
            }
            
            // Find or create permission
            $perm = Permission::firstOrCreate(
                ['name' => $permission],
                [
                    'display_name' => ucwords(str_replace(['.', '_', '-'], ' ', $permission)),
                    'module' => explode('.', $permission)[0] ?? null,
                ]
            );
            
            return $perm->id;
        });

        $this->permissions()->sync($permissionIds);

        return $this;
    }

    /**
     * Get all permission names for this role.
     */
    public function getPermissionNames(): array
    {
        return $this->permissions()->pluck('name')->toArray();
    }

    /**
     * Get all available permissions in the system
     */
    public static function getAllPermissions(): array
    {
        return [
            'dashboard.view',

            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

            'permissions.view',
            'permissions.create',
            'permissions.edit',
            'permissions.delete',

            'agenda.kolegium.view',
            'agenda.kolegium.create',
            'agenda.kolegium.edit',
            'agenda.kolegium.delete',
            'agenda.kolegium.publish',

            'agenda.study_program.view',
            'agenda.study_program.create',
            'agenda.study_program.edit',
            'agenda.study_program.delete',
            'agenda.study_program.publish',

            'agenda.peer_group.view',
            'agenda.peer_group.create',
            'agenda.peer_group.edit',
            'agenda.peer_group.delete',
            'agenda.peer_group.publish',
        ];
    }
}