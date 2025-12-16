<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'owner',
                'description' => 'Akses penuh ke semua fitur sistem',
                'permissions' => ['*'], // All permissions
                'is_active' => true,
                'is_system' => true
            ],
            [
                'name' => 'admin',
                'description' => 'Akses ke semua fitur kecuali management user',
                'permissions' => [
                    'dashboard.view',
                    'users.view', 'users.create', 'users.edit',
                    'roles.view',
                    'settings.view', 'settings.edit',
                ],
                'is_active' => true,
                'is_system' => true
            ],
            [
                'name' => 'staff',
                'description' => 'Akses dasar ke dashboard',
                'permissions' => [
                    'dashboard.view',
                ],
                'is_active' => true,
                'is_system' => true
            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);

            $role = Role::updateOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );

            // Sync permissions using pivot table
            $role->syncPermissions($permissions);
        }
    }
}