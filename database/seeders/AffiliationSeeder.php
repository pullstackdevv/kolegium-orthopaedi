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
                'name' => 'FK Universitas Diponegoro',
                'type' => AffiliationType::RESIDEN->value,
                'code' => 'FK-UNDIP',
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
                'name' => 'RSUP Dr. Sardjito',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUP-SARDJITO',
            ],
            [
                'name' => 'RSUP Dr. Cipto Mangunkusumo',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSCM',
            ],
            [
                'name' => 'RSUP Dr. Soetomo',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUP-SOETOMO',
            ],
            [
                'name' => 'RSUP Dr. Kariadi',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUP-KARIADI',
            ],
            [
                'name' => 'RSUP Dr. Hasan Sadikin',
                'type' => AffiliationType::CLINICAL_FELLOWSHIP->value,
                'code' => 'RSUP-HASAN-SADIKIN',
            ],
            [
                'name' => 'Subspesialis Spine',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'SUBSP-SPINE',
            ],
            [
                'name' => 'Subspesialis Hip & Knee',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'SUBSP-HIP-KNEE',
            ],
            [
                'name' => 'Subspesialis Hand & Microsurgery',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'SUBSP-HAND',
            ],
            [
                'name' => 'Subspesialis Tumor',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'SUBSP-TUMOR',
            ],
            [
                'name' => 'Subspesialis Trauma',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'SUBSP-TRAUMA',
            ],
            [
                'name' => 'Subspesialis Pediatric Orthopaedi',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'SUBSP-PEDIATRIC',
            ],
            [
                'name' => 'Subspesialis Foot & Ankle',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'SUBSP-FOOT-ANKLE',
            ],
            [
                'name' => 'Subspesialis Shoulder & Elbow',
                'type' => AffiliationType::SUBSPESIALIS->value,
                'code' => 'SUBSP-SHOULDER-ELBOW',
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
                'name' => 'IPOS (Indonesian Pediatric Orthopaedic Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'IPOS',
            ],
            [
                'name' => 'ITOS (Indonesian Trauma Orthopaedic Society)',
                'type' => AffiliationType::PEER_GROUP->value,
                'code' => 'ITOS',
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
