<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            // Kolegium
            [
                'name' => 'admin_kolegium',
                'email' => 'admin@kolegium-orthopaedi.com',
                'password' => Hash::make('Kolegium@2025'),
                'is_active' => true,
                'role' => 'admin_kolegium',
            ],

            // Residen
            [
                'name' => 'admin_residen_ui',
                'email' => 'residen.ui@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUI@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_unair',
                'email' => 'residen.unair@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUnair@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_unpad',
                'email' => 'residen.unpad@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUnpad@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_unhas',
                'email' => 'residen.unhas@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUnhas@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_uns',
                'email' => 'residen.uns@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUNS@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_ugm',
                'email' => 'residen.ugm@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUGM@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_unud',
                'email' => 'residen.unud@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUnud@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_usu',
                'email' => 'residen.usu@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUSU@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_ub',
                'email' => 'residen.ub@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUB@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_unsri',
                'email' => 'residen.unsri@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUnsri@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_unand',
                'email' => 'residen.unand@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUnand@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_usk',
                'email' => 'residen.usk@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenUSK@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],
            [
                'name' => 'admin_residen_ulm',
                'email' => 'residen.ulm@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenULM@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_resident',
            ],

            // Clinical Fellowship
            [
                'name' => 'admin_residen_rso',
                'email' => 'residen.rso@kolegium-orthopaedi.com',
                'password' => Hash::make('ResidenRSO@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_fellow',
            ],
            [
                'name' => 'admin_cf_saifulanwar',
                'email' => 'cf.saifulanwar@kolegium-orthopaedi.com',
                'password' => Hash::make('CFMalang@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_fellow',
            ],
            [
                'name' => 'admin_cf_rshs',
                'email' => 'cf.rshs@kolegium-orthopaedi.com',
                'password' => Hash::make('CFBandung@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_fellow',
            ],
            [
                'name' => 'admin_cf_sardjito',
                'email' => 'cf.sardjito@kolegium-orthopaedi.com',
                'password' => Hash::make('CFJogja@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_fellow',
            ],
            [
                'name' => 'admin_cf_moewardi',
                'email' => 'cf.moewardi@kolegium-orthopaedi.com',
                'password' => Hash::make('CFSolo@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_fellow',
            ],

            // Subspesialis
            [
                'name' => 'admin_subsp_ui',
                'email' => 'subsp.ui@kolegium-orthopaedi.com',
                'password' => Hash::make('SubspUI@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_trainee',
            ],
            [
                'name' => 'admin_subsp_unair',
                'email' => 'subsp.unair@kolegium-orthopaedi.com',
                'password' => Hash::make('SubspUnair@2025'),
                'is_active' => true,
                'role' => 'admin_study_program_trainee',
            ],

            // Peer Group
            [
                'name' => 'admin_pg_iossa',
                'email' => 'iossa@kolegium-orthopaedi.com',
                'password' => Hash::make('IOSSA@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
            [
                'name' => 'admin_pg_inamsos',
                'email' => 'inamsos@kolegium-orthopaedi.com',
                'password' => Hash::make('INAMSOS@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
            [
                'name' => 'admin_pg_ihks',
                'email' => 'ihks@kolegium-orthopaedi.com',
                'password' => Hash::make('IHKS@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
            [
                'name' => 'admin_pg_inases',
                'email' => 'inases@kolegium-orthopaedi.com',
                'password' => Hash::make('INASES@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
            [
                'name' => 'admin_pg_ipos',
                'email' => 'ipos@kolegium-orthopaedi.com',
                'password' => Hash::make('IPOS@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
            [
                'name' => 'admin_pg_iossma',
                'email' => 'iossma@kolegium-orthopaedi.com',
                'password' => Hash::make('IOSSMA@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
            [
                'name' => 'admin_pg_inashum',
                'email' => 'inashum@kolegium-orthopaedi.com',
                'password' => Hash::make('INASHUM@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
            [
                'name' => 'admin_pg_inafas',
                'email' => 'inafas@kolegium-orthopaedi.com',
                'password' => Hash::make('INAFAS@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
            [
                'name' => 'admin_pg_iots',
                'email' => 'iots@kolegium-orthopaedi.com',
                'password' => Hash::make('IOTS@2025'),
                'is_active' => true,
                'role' => 'admin_peer_group',
            ],
        ];

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']);

            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            // Assign role
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $user->syncRoles([$role]);
            }
        }
    }
}
