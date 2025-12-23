<?php

namespace Database\Seeders;

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
                'type' => 'kolegium',
                'code' => 'KOT',
            ],
            [
                'name' => 'FK Universitas Indonesia',
                'type' => 'residen',
                'code' => 'FK-UI',
            ],
            [
                'name' => 'FK Universitas Gadjah Mada',
                'type' => 'residen',
                'code' => 'FK-UGM',
            ],
            [
                'name' => 'FK Universitas Airlangga',
                'type' => 'residen',
                'code' => 'FK-UNAIR',
            ],
            [
                'name' => 'FK Universitas Diponegoro',
                'type' => 'residen',
                'code' => 'FK-UNDIP',
            ],
            [
                'name' => 'FK Universitas Padjadjaran',
                'type' => 'residen',
                'code' => 'FK-UNPAD',
            ],
            [
                'name' => 'FK Universitas Hasanuddin',
                'type' => 'residen',
                'code' => 'FK-UNHAS',
            ],
            [
                'name' => 'FK Universitas Brawijaya',
                'type' => 'residen',
                'code' => 'FK-UB',
            ],
            [
                'name' => 'FK Universitas Sebelas Maret',
                'type' => 'residen',
                'code' => 'FK-UNS',
            ],
            [
                'name' => 'FK Universitas Andalas',
                'type' => 'residen',
                'code' => 'FK-UNAND',
            ],
            [
                'name' => 'FK Universitas Sumatera Utara',
                'type' => 'residen',
                'code' => 'FK-USU',
            ],
            [
                'name' => 'FK Universitas Sriwijaya',
                'type' => 'residen',
                'code' => 'FK-UNSRI',
            ],
            [
                'name' => 'RSUP Dr. Sardjito',
                'type' => 'clinical_fellowship',
                'code' => 'RSUP-SARDJITO',
            ],
            [
                'name' => 'RSUP Dr. Cipto Mangunkusumo',
                'type' => 'clinical_fellowship',
                'code' => 'RSCM',
            ],
            [
                'name' => 'RSUP Dr. Soetomo',
                'type' => 'clinical_fellowship',
                'code' => 'RSUP-SOETOMO',
            ],
            [
                'name' => 'RSUP Dr. Kariadi',
                'type' => 'clinical_fellowship',
                'code' => 'RSUP-KARIADI',
            ],
            [
                'name' => 'RSUP Dr. Hasan Sadikin',
                'type' => 'clinical_fellowship',
                'code' => 'RSUP-HASAN-SADIKIN',
            ],
            [
                'name' => 'Subspesialis Spine',
                'type' => 'subspesialis',
                'code' => 'SUBSP-SPINE',
            ],
            [
                'name' => 'Subspesialis Hip & Knee',
                'type' => 'subspesialis',
                'code' => 'SUBSP-HIP-KNEE',
            ],
            [
                'name' => 'Subspesialis Hand & Microsurgery',
                'type' => 'subspesialis',
                'code' => 'SUBSP-HAND',
            ],
            [
                'name' => 'Subspesialis Tumor',
                'type' => 'subspesialis',
                'code' => 'SUBSP-TUMOR',
            ],
            [
                'name' => 'Subspesialis Trauma',
                'type' => 'subspesialis',
                'code' => 'SUBSP-TRAUMA',
            ],
            [
                'name' => 'Subspesialis Pediatric Orthopaedi',
                'type' => 'subspesialis',
                'code' => 'SUBSP-PEDIATRIC',
            ],
            [
                'name' => 'Subspesialis Foot & Ankle',
                'type' => 'subspesialis',
                'code' => 'SUBSP-FOOT-ANKLE',
            ],
            [
                'name' => 'Subspesialis Shoulder & Elbow',
                'type' => 'subspesialis',
                'code' => 'SUBSP-SHOULDER-ELBOW',
            ],
            [
                'name' => 'IOSSA (Indonesian Orthopaedic Spine Society Association)',
                'type' => 'peer_group',
                'code' => 'IOSSA',
            ],
            [
                'name' => 'INAMSOS (Indonesian Musculoskeletal Oncology Society)',
                'type' => 'peer_group',
                'code' => 'INAMSOS',
            ],
            [
                'name' => 'IHKS (Ikatan Hip & Knee Society)',
                'type' => 'peer_group',
                'code' => 'IHKS',
            ],
            [
                'name' => 'IPOS (Indonesian Pediatric Orthopaedic Society)',
                'type' => 'peer_group',
                'code' => 'IPOS',
            ],
            [
                'name' => 'ITOS (Indonesian Trauma Orthopaedic Society)',
                'type' => 'peer_group',
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
