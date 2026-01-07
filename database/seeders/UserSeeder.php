<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password'),
                'is_active' => true,
                'role' => 'super_admin',
            ],
            [
                'name' => 'Orthopaedi Team',
                'email' => 'orthopaedi@gmail.com',
                'password' => Hash::make('orthopaedi@2025'),
                'is_active' => true,
                'role' => 'super_admin',
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
