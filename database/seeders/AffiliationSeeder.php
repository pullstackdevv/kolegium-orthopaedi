<?php

namespace Database\Seeders;

use App\Enums\AffiliationType;
use Illuminate\Database\Seeder;
use App\Models\Affiliation;

class AffiliationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $affiliations = [
            [
                'name' => 'Kolegium Orthopaedi dan Traumatologi',
                'type' => AffiliationType::KOLEGIUM->value,
                'code' => 'KOT',
            ],
            [
                'name' => 'FK Universitas Indonesia',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UI',
            ],
            [
                'name' => 'FK Universitas Gadjah Mada',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UGM',
            ],
            [
                'name' => 'FK Universitas Airlangga',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNAIR',
            ],
            [
                'name' => 'FK Universitas Padjadjaran',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNPAD',
            ],
            [
                'name' => 'FK Universitas Hasanuddin',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNHAS',
            ],
            [
                'name' => 'FK Universitas Brawijaya',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UB',
            ],
            [
                'name' => 'FK Universitas Sebelas Maret',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNS',
            ],
            [
                'name' => 'FK Universitas Andalas',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNAND',
            ],
            [
                'name' => 'FK Universitas Sumatera Utara',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-USU',
            ],
            [
                'name' => 'FK Universitas Sriwijaya',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNSRI',
            ],
            [
                'name' => 'FK Universitas Udayana',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNUD',
            ],
            [
                'name' => 'FK Universitas Syiah Kuala',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-USK',
            ],
            [
                'name' => 'FK Universitas Lambung Mangkurat',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-ULM',
            ],
            [
                'name' => 'RSO Soeharso',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'RSO-SOEHARSO',
            ],
            [
                'name' => 'RSUP Dr. Sardjito',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUP-SARDJITO',
            ],
            [
                'name' => 'RSUP Dr. Hasan Sadikin',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUP-HASAN-SADIKIN',
            ],
            [
                'name' => 'RSUD Dr. Saiful Anwar Malang',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUD-SAIFUL-ANWAR',
            ],
            [
                'name' => 'RSUD Dr. Moewardi Solo',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUD-MOEWARDI',
            ],
            [
                'name' => 'FK Universitas Airlangga',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'FK-UNAIR-TRAINEE',
            ],
            [
                'name' => 'FK Universitas Indonesia',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'FK-UI-TRAINEE',
            ],
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
                'name' => 'ITOS (Indonesian Trauma Orthopaedic Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'ITOS',
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
        ];

        foreach ($affiliations as $affiliation) {
            Affiliation::updateOrCreate(
                ['code' => $affiliation['code']],
                $affiliation
            );
        }
    }
}
