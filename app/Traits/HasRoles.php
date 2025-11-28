<?php

namespace App\Traits;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait HasRoles
{
    /**
     * Get the roles for the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_has_roles');
    }

    /**
     * Get the direct permissions for the user.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_has_permissions');
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string|Role $role): bool
    {
        if ($role instanceof Role) {
            return $this->roles->contains('id', $role->id);
        }

        return $this->roles->contains('name', $role);
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user has all of the given roles.
     */
    public function hasAllRoles(array $roles): bool
    {
        foreach ($roles as $role) {
            if (!$this->hasRole($role)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if user has a specific permission (through roles or direct).
     */
    public function hasPermission(string $permission): bool
    {
        // Check direct permissions first
        if ($this->permissions->contains('name', $permission)) {
            return true;
        }

        // Check permissions through roles
        foreach ($this->roles as $role) {
            if ($role->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if user has any of the given permissions.
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
     * Check if user has all of the given permissions.
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
     * Assign role(s) to user.
     */
    public function assignRole(string|Role|array $roles): self
    {
        $roles = is_array($roles) ? $roles : [$roles];

        foreach ($roles as $role) {
            $roleModel = $role instanceof Role 
                ? $role 
                : Role::where('name', $role)->firstOrFail();
            $this->roles()->syncWithoutDetaching($roleModel);
        }

        return $this;
    }

    /**
     * Remove role(s) from user.
     */
    public function removeRole(string|Role|array $roles): self
    {
        $roles = is_array($roles) ? $roles : [$roles];

        foreach ($roles as $role) {
            $roleModel = $role instanceof Role 
                ? $role 
                : Role::where('name', $role)->first();
            if ($roleModel) {
                $this->roles()->detach($roleModel);
            }
        }

        return $this;
    }

    /**
     * Sync roles (replace all existing roles).
     */
    public function syncRoles(array $roles): self
    {
        $roleIds = collect($roles)->map(function ($role) {
            return $role instanceof Role 
                ? $role->id 
                : Role::where('name', $role)->firstOrFail()->id;
        });

        $this->roles()->sync($roleIds);

        return $this;
    }

    /**
     * Give direct permission(s) to user.
     */
    public function givePermissionTo(string|Permission|array $permissions): self
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
     * Revoke direct permission(s) from user.
     */
    public function revokePermissionTo(string|Permission|array $permissions): self
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
     * Get all permission names for this user (direct + through roles).
     */
    public function getAllPermissions(): array
    {
        $permissions = $this->permissions->pluck('name')->toArray();

        foreach ($this->roles as $role) {
            $permissions = array_merge($permissions, $role->getPermissionNames());
        }

        return array_unique($permissions);
    }

    /**
     * Get the primary role (first role).
     */
    public function getPrimaryRole(): ?Role
    {
        return $this->roles->first();
    }

    /**
     * Get role names.
     */
    public function getRoleNames(): array
    {
        return $this->roles->pluck('name')->toArray();
    }
}
