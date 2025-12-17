<?php

namespace Database\Seeders;

use App\Models\AgendaEvent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class HomepageAgendaEventsSeeder extends Seeder
{
    public function run(): void
    {
        $creatorId = User::query()->where('email', 'admin@gmail.com')->value('id');
        if (!$creatorId) {
            $creatorId = User::query()->orderBy('id')->value('id');
        }

        $now = Carbon::now();

        $items = [
            [
                'scope' => 'study_program',
                'section' => 'resident',
                'type' => 'ujian_nasional',
                'title' => 'Pre-exam PPDS 1',
                'description' => 'National Exam',
                'location' => 'Jakarta',
                'registration_url' => null,
                'image_url' => null,
                'start_date' => '2025-12-04',
                'end_date' => null,
            ],
            [
                'scope' => 'study_program',
                'section' => 'resident',
                'type' => 'ujian_nasional',
                'title' => 'National Board Examination (Session 2)',
                'description' => 'National Exam',
                'location' => 'Jakarta',
                'registration_url' => null,
                'image_url' => null,
                'start_date' => '2025-12-06',
                'end_date' => '2025-12-07',
            ],
            [
                'scope' => 'study_program',
                'section' => 'fellow',
                'type' => 'ujian_nasional',
                'title' => 'Fellowship Admission Test',
                'description' => 'National Exam',
                'location' => 'Jakarta',
                'registration_url' => null,
                'image_url' => null,
                'start_date' => '2026-01-17',
                'end_date' => null,
            ],
            [
                'scope' => 'peer_group',
                'section' => null,
                'type' => 'event_peer_group',
                'title' => 'SRS Asia Pacific Meeting 2026',
                'description' => 'Scoliosis Research Society – Asia Pacific Meeting 2026',
                'location' => 'Fukuoka, Japan',
                'registration_url' => 'https://www.srs.org/Meetings-Conferences/Regional-Scientific-Meeting/RSM-2026',
                'image_url' => '/assets/images/event/srs.jpeg',
                'start_date' => '2026-02-06',
                'end_date' => '2026-02-07',
            ],
            [
                'scope' => 'peer_group',
                'section' => null,
                'type' => 'event_peer_group',
                'title' => 'CSRS-AP 2026',
                'description' => '16th Annual Meeting of Cervical Spine Research Society – Asia Pacific',
                'location' => 'Shanghai International Convention Center, China',
                'registration_url' => 'https://www.csrs-ap2026.org/',
                'image_url' => '/assets/images/event/csrs-ap.jpeg',
                'start_date' => '2026-03-11',
                'end_date' => '2026-03-13',
            ],
            [
                'scope' => 'peer_group',
                'section' => null,
                'type' => 'event_peer_group',
                'title' => 'KSSS 2026',
                'description' => 'The 43rd International Congress of Korean Society of Spine Surgery',
                'location' => 'Lotte Hotel Seoul, South Korea',
                'registration_url' => 'https://ksss2026.org/ksss/contents/01_06.php',
                'image_url' => '/assets/images/event/ksss.jpeg',
                'start_date' => '2026-05-20',
                'end_date' => '2026-05-22',
            ],
            [
                'scope' => 'peer_group',
                'section' => null,
                'type' => 'event_peer_group',
                'title' => 'APSS Congress 2026',
                'description' => 'Asia Pacific Spine Society 32nd Annual Scientific Meeting and Philippine Spine Society Annual Meeting',
                'location' => 'Shangri-La Mactan, Cebu, Philippines',
                'registration_url' => 'https://www.apss2026ph.org',
                'image_url' => '/assets/images/event/apss.jpeg',
                'start_date' => '2026-06-03',
                'end_date' => '2026-06-06',
            ],
            [
                'scope' => 'peer_group',
                'section' => null,
                'type' => 'event_peer_group',
                'title' => 'Asia Spine 2026',
                'description' => 'The 17th Annual Meeting of Asia Spine',
                'location' => 'Osaka International Convention Center, Osaka, Japan',
                'registration_url' => 'https://cs-oto3.com/nsj2026-17amoas/en-greeting.html',
                'image_url' => '/assets/images/event/asia-spine.jpeg',
                'start_date' => '2026-06-18',
                'end_date' => '2026-06-20',
            ],
            [
                'scope' => 'peer_group',
                'section' => null,
                'type' => 'event_peer_group',
                'title' => 'SMISS-ASEAN MISST-SSS Combine Meeting 2026',
                'description' => 'Combine Meeting of Society for Minimally Invasive Spine Surgery – Asia Pacific (SMISS-AP), 6th Meeting - Singapore Spine Society (SSS), 9th Meeting',
                'location' => 'Shangri-La Hotel, Singapore',
                'registration_url' => 'https://www.smiss-aseanmisst-sss2026.org/',
                'image_url' => '/assets/images/event/smiss.jpeg',
                'start_date' => '2026-07-16',
                'end_date' => '2026-07-18',
            ],
        ];

        foreach ($items as $item) {
            $unique = [
                'scope' => $item['scope'],
                'section' => $item['section'],
                'type' => $item['type'],
                'title' => $item['title'],
                'start_date' => $item['start_date'],
            ];

            AgendaEvent::updateOrCreate($unique, [
                'description' => $item['description'],
                'location' => $item['location'],
                'registration_url' => $item['registration_url'],
                'image_url' => $item['image_url'],
                'end_date' => $item['end_date'],
                'is_published' => true,
                'published_at' => $now,
                'created_by' => $creatorId,
            ]);
        }
    }
}
