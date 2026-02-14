<?php

namespace Database\Seeders;

use App\Models\TeacherStaffDivision;
use Illuminate\Database\Seeder;

class TeacherStaffDivisionSeeder extends Seeder
{
    public function run(): void
    {
        $divisions = [
            'Hip and Knee (Adult Reconstruction, Trauma, and Sports)',
            'Orthopaedic Sports Injury',
            'Advanced Orthopaedic Trauma',
            'Shoulder and Elbow',
            'Foot and Ankle',
            'Pediatric Orthopaedic',
            'Orthopaedic Oncology',
            'Hand, Upper Limb and Microsurgery',
            'Orthopaedic Spine',
        ];

        foreach ($divisions as $name) {
            TeacherStaffDivision::updateOrCreate(
                ['name' => $name],
                ['name' => $name]
            );
        }

        $this->command->info('Seeded ' . count($divisions) . ' teacher staff divisions.');
    }
}
