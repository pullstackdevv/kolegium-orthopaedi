<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // // Create admin user
        // User::factory()->create([
        //     'name' => 'Admin User',
        //     'email' => 'admin@example.com',
        //     'role' => 'admin',
        // ]);

        // // Create test user
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        //     'role' => 'staff',
        // ]);

        // Seed roles and permissions
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            AffiliationSeeder::class,
            AdminUserSeeder::class,
            HomepageAgendaEventsSeeder::class,
        ]);

        $this->command->info('Kolegium database seeded successfully!');
        $this->command->info('Default users:');
        $this->command->info('- Super Admin: admin@gmail.com / password');
        $this->command->info('- Staff: staff@gmail.com / password');
    }
}
