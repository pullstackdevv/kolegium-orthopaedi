<?php

namespace Database\Seeders;

use App\Enums\AffiliationType;
use Illuminate\Database\Seeder;
use App\Models\Affiliation;
use Carbon\Carbon;

class AffiliationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $baseTime = Carbon::now();
        $affiliations = [
            // Kolegium
            [
                'name' => 'Kolegium Orthopaedi dan Traumatologi',
                'type' => AffiliationType::KOLEGIUM->value,
                'code' => 'KOT',
            ],
            
            // Residen - ordered by admin user list
            [
                'name' => 'FK Universitas Indonesia',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UI',
                'since' => '1950',
            ],
            [
                'name' => 'FK Universitas Airlangga',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNAIR',
                'since' => '1954',
            ],
            [
                'name' => 'FK Universitas Padjadjaran',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNPAD',
                'since' => '1957',
            ],
            [
                'name' => 'FK Universitas Hasanuddin',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNHAS',
                'since' => '1956',
            ],
            [
                'name' => 'FK Universitas Sebelas Maret',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNS',
                'since' => '1976',
            ],
            [
                'name' => 'FK Universitas Gadjah Mada',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UGM',
                'since' => '1949',
            ],
            [
                'name' => 'FK Universitas Udayana',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNUD',
                'since' => '1962',
            ],
            [
                'name' => 'FK Universitas Sumatera Utara',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-USU',
                'since' => '1952',
            ],
            [
                'name' => 'FK Universitas Brawijaya',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UB',
                'since' => '1963',
            ],
            [
                'name' => 'FK Universitas Sriwijaya',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNSRI',
                'since' => '1960',
            ],
            [
                'name' => 'FK Universitas Andalas',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNAND',
                'since' => '1955',
            ],
            [
                'name' => 'FK Universitas Syiah Kuala',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-USK',
                'since' => '1961',
            ],
            [
                'name' => 'FK Universitas Lambung Mangkurat',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-ULM',
                'since' => '1958',
            ],
            [
                'name' => 'RSO Soeharso',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'RSO-SOEHARSO',
            ],
            
            // Clinical Fellowship - ordered by admin user list
            [
                'name' => 'RSUD Dr. Saiful Anwar Malang',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUD-SAIFUL-ANWAR',
            ],
            [
                'name' => 'RSUP Dr. Hasan Sadikin',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUP-HASAN-SADIKIN',
            ],
            [
                'name' => 'RSUP Dr. Sardjito',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUP-SARDJITO',
            ],
            [
                'name' => 'RSUD Dr. Moewardi Solo',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUD-MOEWARDI',
            ],
            
            // Subspesialis - ordered by admin user list
            [
                'name' => 'FK Universitas Indonesia',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'FK-UI-TRAINEE',
                'since' => '1950',
            ],
            [
                'name' => 'FK Universitas Airlangga',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'FK-UNAIR-TRAINEE',
                'since' => '1954',
            ],
            
            // Peer Group - ordered by admin user list
            [
                'name' => 'IOSSA (Indonesian Orthopaedic Spine Society Association)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'IOSSA',
            ],
            [
                'name' => 'INAMSOS (Indonesian Musculoskeletal Oncology Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'INAMSOS',
            ],
            [
                'name' => 'IHKS (Ikatan Hip & Knee Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'IHKS',
            ],
            [
                'name' => 'INASES (Indonesian Shoulder and Elbow Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'INASES',
            ],
            [
                'name' => 'IPOS (Indonesian Pediatric Orthopaedic Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'IPOS',
            ],
            [
                'name' => 'IOSSMA (Indonesian Orthopaedic Society for Sport Medicine and Arthroscopy)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'IOSSMA',
            ],
            [
                'name' => 'INASHUM (Indonesian Society for Upper Limb and Microsurgery)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'INASHUM',
            ],
            [
                'name' => 'INAFAS (Indonesian Foot and Ankle Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'INAFAS',
            ],
            [
                'name' => 'ITOS (Indonesian Trauma Orthopaedic Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'ITOS',
            ],
        ];

        foreach ($affiliations as $index => $affiliationData) {
            $timestamp = $baseTime->copy()->addSeconds($index);

            $affiliation = Affiliation::where('code', $affiliationData['code'])->first();
            
            if ($affiliation) {
                $affiliation->fill($affiliationData);
            } else {
                $affiliation = new Affiliation($affiliationData);
            }

            $affiliation->created_at = $timestamp;
            $affiliation->updated_at = $timestamp;
            
            $affiliation->timestamps = false;
            $affiliation->save();
            $affiliation->timestamps = true;
        }
    }
}
