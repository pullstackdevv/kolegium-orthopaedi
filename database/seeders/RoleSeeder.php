<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionNames = [
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

            'agenda.study_program.resident.view',
            'agenda.study_program.resident.create',
            'agenda.study_program.resident.edit',
            'agenda.study_program.resident.delete',
            'agenda.study_program.resident.publish',

            'agenda.study_program.fellow.view',
            'agenda.study_program.fellow.create',
            'agenda.study_program.fellow.edit',
            'agenda.study_program.fellow.delete',
            'agenda.study_program.fellow.publish',

            'agenda.study_program.trainee.view',
            'agenda.study_program.trainee.create',
            'agenda.study_program.trainee.edit',
            'agenda.study_program.trainee.delete',
            'agenda.study_program.trainee.publish',

            'agenda.peer_group.view',
            'agenda.peer_group.create',
            'agenda.peer_group.edit',
            'agenda.peer_group.delete',
            'agenda.peer_group.publish',
        ];

        foreach ($permissionNames as $permissionName) {
            Permission::firstOrCreate(
                ['name' => $permissionName],
                [
                    'display_name' => ucwords(str_replace(['.', '_', '-'], ' ', $permissionName)),
                    'module' => explode('.', $permissionName)[0] ?? null,
                ]
            );
        }

        $roles = [
            [
                'name' => 'super_admin',
                'description' => 'Akses penuh ke semua fitur sistem',
                'permissions' => ['*'],
                'is_active' => true,
                'is_system' => true
            ],
            [
                'name' => 'admin_kolegium',
                'description' => 'Mengelola konten untuk Kolegium',
                'permissions' => [
                    'dashboard.view',
                    'agenda.kolegium.view',
                    'agenda.kolegium.create',
                    'agenda.kolegium.edit',
                    'agenda.kolegium.delete',
                    'agenda.kolegium.publish',
                ],
                'is_active' => true,
                'is_system' => true
            ],
            [
                'name' => 'admin_study_program',
                'description' => 'Mengelola konten untuk Study Program',
                'permissions' => [
                    'dashboard.view',
                    'agenda.study_program.view',
                    'agenda.study_program.create',
                    'agenda.study_program.edit',
                    'agenda.study_program.delete',
                    'agenda.study_program.publish',
                ],
                'is_active' => true,
                'is_system' => true
            ],
            [
                'name' => 'admin_study_program_resident',
                'description' => 'Mengelola konten agenda untuk Study Program - Resident',
                'permissions' => [
                    'dashboard.view',
                    'agenda.study_program.resident.view',
                    'agenda.study_program.resident.create',
                    'agenda.study_program.resident.edit',
                    'agenda.study_program.resident.delete',
                    'agenda.study_program.resident.publish',
                ],
                'is_active' => true,
                'is_system' => true
            ],
            [
                'name' => 'admin_study_program_fellow',
                'description' => 'Mengelola konten agenda untuk Study Program - Fellow',
                'permissions' => [
                    'dashboard.view',
                    'agenda.study_program.fellow.view',
                    'agenda.study_program.fellow.create',
                    'agenda.study_program.fellow.edit',
                    'agenda.study_program.fellow.delete',
                    'agenda.study_program.fellow.publish',
                ],
                'is_active' => true,
                'is_system' => true
            ],
            [
                'name' => 'admin_study_program_trainee',
                'description' => 'Mengelola konten agenda untuk Study Program - Trainee',
                'permissions' => [
                    'dashboard.view',
                    'agenda.study_program.trainee.view',
                    'agenda.study_program.trainee.create',
                    'agenda.study_program.trainee.edit',
                    'agenda.study_program.trainee.delete',
                    'agenda.study_program.trainee.publish',
                ],
                'is_active' => true,
                'is_system' => true
            ],
            [
                'name' => 'admin_peer_group',
                'description' => 'Mengelola konten untuk Peer Group',
                'permissions' => [
                    'dashboard.view',
                    'agenda.peer_group.view',
                    'agenda.peer_group.create',
                    'agenda.peer_group.edit',
                    'agenda.peer_group.delete',
                    'agenda.peer_group.publish',
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