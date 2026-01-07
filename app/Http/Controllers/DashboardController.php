<?php

namespace App\Http\Controllers;

use App\Models\DatabaseMember;
use App\Models\Affiliation;
use App\Models\AgendaEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics
        $totalMembers = DatabaseMember::count();
        $totalAffiliations = Affiliation::count();
        
        // Members by program type - with null check
        $membersByProgram = DatabaseMember::select('organization_type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('organization_type')
            ->groupBy('organization_type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->organization_type => (int) $item->count];
            })
            ->toArray();
        
        // Members by status - with null check
        $membersByStatus = DatabaseMember::select('status', DB::raw('COUNT(*) as count'))
            ->whereNotNull('status')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => (int) $item->count];
            })
            ->toArray();
        
        // Recent members (last 5)
        $recentMembers = DatabaseMember::with(['affiliation' => function($query) {
                $query->select('id', 'name', 'code');
            }])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name ?? 'N/A',
                    'member_code' => $member->member_code ?? '-',
                    'organization_type' => $member->organization_type ?? 'other',
                    'status' => $member->status ?? 'unknown',
                    'created_at' => $member->created_at ? $member->created_at->toISOString() : null,
                    'affiliation' => $member->affiliation ? [
                        'id' => $member->affiliation->id,
                        'name' => $member->affiliation->name,
                        'code' => $member->affiliation->code,
                    ] : null,
                ];
            })
            ->toArray();
        
        // Upcoming events (next 5) - or recent if no upcoming
        $upcomingEvents = AgendaEvent::where('start_date', '>=', Carbon::now())
            ->orderBy('start_date', 'asc')
            ->limit(5)
            ->get();
        
        // If no upcoming events, get recent events
        if ($upcomingEvents->isEmpty()) {
            $upcomingEvents = AgendaEvent::orderBy('start_date', 'desc')
                ->limit(5)
                ->get();
        }
        
        $upcomingEventsData = $upcomingEvents->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title ?? 'Untitled Event',
                'description' => $event->description ?? '',
                'start_date' => $event->start_date ? Carbon::parse($event->start_date)->toISOString() : null,
                'end_date' => $event->end_date ? Carbon::parse($event->end_date)->toISOString() : null,
                'location' => $event->location ?? '',
                'event_type' => $event->event_type ?? '',
            ];
        })->toArray();
        
        $activePrograms = count($membersByProgram);
        
        return Inertia::render('Dashboard/index', [
            'stats' => [
                'totalMembers' => $totalMembers,
                'totalAffiliations' => $totalAffiliations,
                'activePrograms' => $activePrograms,
                'upcomingEvents' => count($upcomingEventsData),
                'membersByProgram' => $membersByProgram,
                'membersByStatus' => $membersByStatus,
                'recentMembers' => $recentMembers,
                'upcomingAgenda' => $upcomingEventsData,
            ]
        ]);
    }
}
