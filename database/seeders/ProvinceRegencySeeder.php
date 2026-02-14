<?php

namespace Database\Seeders;

use App\Models\Province;
use App\Models\Regency;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class ProvinceRegencySeeder extends Seeder
{
    private const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

    public function run(): void
    {
        $this->command->info('Fetching provinces from API...');

        $provincesResponse = Http::timeout(30)->get(self::BASE_URL . '/provinces.json');

        if (!$provincesResponse->successful()) {
            $this->command->error('Failed to fetch provinces from API.');
            return;
        }

        $provinces = $provincesResponse->json();

        if (!is_array($provinces) || empty($provinces)) {
            $this->command->error('No provinces data received from API.');
            return;
        }

        $this->command->info('Received ' . count($provinces) . ' provinces. Seeding...');

        DB::transaction(function () use ($provinces) {
            foreach ($provinces as $province) {
                Province::updateOrCreate(
                    ['id' => (int) $province['id']],
                    ['name' => $province['name']]
                );

                $this->command->info("  Fetching regencies for {$province['name']}...");

                $regenciesResponse = Http::timeout(30)->get(
                    self::BASE_URL . '/regencies/' . $province['id'] . '.json'
                );

                if (!$regenciesResponse->successful()) {
                    $this->command->warn("  Failed to fetch regencies for {$province['name']}. Skipping.");
                    continue;
                }

                $regencies = $regenciesResponse->json();

                if (!is_array($regencies)) {
                    continue;
                }

                foreach ($regencies as $regency) {
                    Regency::updateOrCreate(
                        ['id' => (int) $regency['id']],
                        [
                            'province_id' => (int) $province['id'],
                            'name' => $regency['name'],
                        ]
                    );
                }

                $this->command->info("  Seeded " . count($regencies) . " regencies for {$province['name']}.");

                usleep(100000);
            }
        });

        $this->command->info('Province & Regency seeding complete!');
        $this->command->info('Total provinces: ' . Province::count());
        $this->command->info('Total regencies: ' . Regency::count());
    }
}
