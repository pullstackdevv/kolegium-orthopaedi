<?php

namespace App\Http\Controllers;

use App\Models\AgendaEvent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AgendaEventController extends Controller
{
    public function cmsPage(Request $request): InertiaResponse
    {
        $authUser = Auth::user();

        $allTypes = [
            ['id' => 'ujian_lokal', 'name' => 'Ujian Lokal'],
            ['id' => 'ujian_nasional', 'name' => 'Ujian Nasional'],
            ['id' => 'event_lokal', 'name' => 'Event Lokal'],
            ['id' => 'event_nasional', 'name' => 'Event Nasional'],
            ['id' => 'event_peer_group', 'name' => 'Event Peer Group International'],
            ['id' => 'event_peer_group_nasional', 'name' => 'Event Peer Group National'],
        ];

        $peerTypeIds = ['event_peer_group', 'event_peer_group_nasional'];

        $typeOptions = $allTypes;
        if ($authUser instanceof User) {
            if ($authUser->hasRole('super_admin')) {
                $typeOptions = $allTypes;
            } elseif ($authUser->hasRole('admin_peer_group')) {
                $typeOptions = array_values(array_filter($allTypes, fn ($t) => in_array($t['id'], $peerTypeIds, true)));
            } else {
                $typeOptions = array_values(array_filter($allTypes, fn ($t) => !in_array($t['id'], $peerTypeIds, true)));
            }
        } else {
            $typeOptions = array_values(array_filter($allTypes, fn ($t) => !in_array($t['id'], $peerTypeIds, true)));
        }

        return Inertia::render('Agenda/index', [
            'agendaTypeOptions' => $typeOptions,
        ]);
    }

    private function scopePermission(string $scope, string $action, ?string $section = null): string
    {
        if ($scope === 'study_program' && $section) {
            return "agenda.{$scope}.{$section}.{$action}";
        }

        return "agenda.{$scope}.{$action}";
    }

    private function ensurePermission(string $scope, string $action, ?string $section = null): ?JsonResponse
    {
        $authUser = Auth::user();

        if (!$authUser instanceof User) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        if ($authUser->hasRole('super_admin')) {
            return null;
        }

        if ($action === 'view' && $authUser->hasRole('admin_kolegium')) {
            return null;
        }

        if ($scope === 'study_program' && $section) {
            if ($authUser->hasPermission("agenda.study_program.{$action}")) {
                return null;
            }

            if ($authUser->hasPermission($this->scopePermission($scope, $action, $section))) {
                return null;
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        if ($scope === 'study_program' && !$section) {
            if ($authUser->hasPermission("agenda.study_program.{$action}")) {
                return null;
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        if (!$authUser->hasPermission($this->scopePermission($scope, $action))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        return null;
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $query = AgendaEvent::query()->where('is_published', 1);

        if ($request->filled('scope')) {
            $query->where('scope', $request->string('scope')->toString());
        }

        if ($request->filled('section')) {
            $query->where('section', $request->string('section')->toString());
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type')->toString());
        }

        if ($request->filled('from')) {
            $query->whereDate('start_date', '>=', $request->string('from')->toString());
        }

        if ($request->filled('to')) {
            $query->whereDate('start_date', '<=', $request->string('to')->toString());
        }

        $events = $query->orderBy('start_date')->get();

        return response()->json([
            'status' => 'success',
            'data' => $events,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $scope = $request->string('scope', 'kolegium')->toString();
        $section = $request->string('section')->toString();

        $authUser = Auth::user();

        if ($scope === 'study_program') {
            if (
                !$request->filled('section') &&
                !(
                    $authUser instanceof User &&
                    ($authUser->hasPermission('agenda.study_program.view') || $authUser->hasRole('admin_kolegium') || $authUser->hasRole('super_admin'))
                )
            ) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Section is required.'
                ], 403);
            }

            if ($resp = $this->ensurePermission($scope, 'view', $request->filled('section') ? $section : null)) {
                return $resp;
            }
        } else {
            if ($resp = $this->ensurePermission($scope, 'view')) {
                return $resp;
            }
        }

        $query = AgendaEvent::query();

        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $query = $query->where('scope', $scope);
        }

        if ($scope === 'study_program' && $request->filled('section')) {
            $query->where('section', $section);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type')->toString());
        }

        if ($request->filled('from')) {
            $query->whereDate('start_date', '>=', $request->string('from')->toString());
        }

        if ($request->filled('to')) {
            $query->whereDate('start_date', '<=', $request->string('to')->toString());
        }

        $events = $query->orderByDesc('start_date')->paginate($request->integer('per_page', 10));

        return response()->json([
            'status' => 'success',
            'data' => $events,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $authUser = Auth::user();

        $allTypeIds = [
            'ujian_lokal',
            'ujian_nasional',
            'event_lokal',
            'event_nasional',
            'event_peer_group',
            'event_peer_group_nasional',
        ];
        $peerTypeIds = ['event_peer_group', 'event_peer_group_nasional'];

        $allowedTypeIds = array_values(array_filter($allTypeIds, fn ($t) => !in_array($t, $peerTypeIds, true)));
        if ($authUser instanceof User) {
            if ($authUser->hasRole('super_admin')) {
                $allowedTypeIds = $allTypeIds;
            } elseif ($authUser->hasRole('admin_peer_group')) {
                $allowedTypeIds = $peerTypeIds;
            }
        }

        $validated = $request->validate([
            'scope' => 'required|string|in:kolegium,study_program,peer_group',
            'section' => 'nullable|required_if:scope,study_program|string|in:resident,fellow,trainee',
            'type' => ['required', 'string', Rule::in($allowedTypeIds)],
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'registration_url' => 'nullable|string|max:500',
            'image_url' => 'nullable|string|max:500',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_published' => 'sometimes|boolean',
        ]);

        $scope = $validated['scope'];
        $section = $validated['section'] ?? null;

        if ($resp = $this->ensurePermission($scope, 'create', $section)) {
            return $resp;
        }

        try {
            DB::beginTransaction();

            $authUser = Auth::user();

            $event = AgendaEvent::create([
                ...$validated,
                'created_by' => $authUser instanceof User ? $authUser->id : null,
            ]);

            if (($validated['is_published'] ?? false) === true) {
                $event->update([
                    'published_at' => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Agenda event created successfully',
                'data' => $event,
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(Request $request, AgendaEvent $agendaEvent): JsonResponse
    {
        $authUser = Auth::user();

        $allTypeIds = [
            'ujian_lokal',
            'ujian_nasional',
            'event_lokal',
            'event_nasional',
            'event_peer_group',
            'event_peer_group_nasional',
        ];
        $peerTypeIds = ['event_peer_group', 'event_peer_group_nasional'];

        $allowedTypeIds = array_values(array_filter($allTypeIds, fn ($t) => !in_array($t, $peerTypeIds, true)));
        if ($authUser instanceof User) {
            if ($authUser->hasRole('super_admin')) {
                $allowedTypeIds = $allTypeIds;
            } elseif ($authUser->hasRole('admin_peer_group')) {
                $allowedTypeIds = $peerTypeIds;
            }
        }

        $validated = $request->validate([
            'type' => ['sometimes', 'required', 'string', Rule::in($allowedTypeIds)],
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'registration_url' => 'nullable|string|max:500',
            'image_url' => 'nullable|string|max:500',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $scope = $agendaEvent->scope;
        $section = $agendaEvent->section;

        if ($resp = $this->ensurePermission($scope, 'edit', $section)) {
            return $resp;
        }

        $agendaEvent->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Agenda event updated successfully',
            'data' => $agendaEvent->fresh(),
        ]);
    }

    public function destroy(AgendaEvent $agendaEvent): JsonResponse
    {
        $scope = $agendaEvent->scope;
        $section = $agendaEvent->section;

        if ($resp = $this->ensurePermission($scope, 'delete', $section)) {
            return $resp;
        }

        $agendaEvent->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Agenda event deleted successfully',
        ]);
    }

    public function publish(AgendaEvent $agendaEvent): JsonResponse
    {
        $scope = $agendaEvent->scope;
        $section = $agendaEvent->section;

        if ($resp = $this->ensurePermission($scope, 'publish', $section)) {
            return $resp;
        }

        $agendaEvent->update([
            'is_published' => true,
            'published_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Agenda event published successfully',
            'data' => $agendaEvent->fresh(),
        ]);
    }

    public function unpublish(AgendaEvent $agendaEvent): JsonResponse
    {
        $scope = $agendaEvent->scope;
        $section = $agendaEvent->section;

        if ($resp = $this->ensurePermission($scope, 'publish', $section)) {
            return $resp;
        }

        $agendaEvent->update([
            'is_published' => false,
            'published_at' => null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Agenda event unpublished successfully',
            'data' => $agendaEvent->fresh(),
        ]);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'scope' => 'required|string|in:kolegium,study_program,peer_group',
            'section' => 'nullable|required_if:scope,study_program|string|in:resident,fellow,trainee',
            'image' => 'required|file|image|max:5120',
        ]);

        $scope = $validated['scope'];
        $section = $validated['section'] ?? null;

        if ($resp = $this->ensurePermission($scope, 'create', $section)) {
            return $resp;
        }

        $path = $request->file('image')->store('agenda-events', 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'status' => 'success',
            'message' => 'Image uploaded successfully',
            'data' => [
                'path' => $path,
                'url' => $url,
            ],
        ]);
    }

    public function uploadImageForEvent(Request $request, AgendaEvent $agendaEvent): JsonResponse
    {
        $request->validate([
            'image' => 'required|file|image|max:5120',
        ]);

        $scope = $agendaEvent->scope;
        $section = $agendaEvent->section;

        if ($resp = $this->ensurePermission($scope, 'edit', $section)) {
            return $resp;
        }

        $path = $request->file('image')->store('agenda-events', 'public');
        $url = asset('storage/' . $path);

        $agendaEvent->update([
            'image_url' => $url,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Image uploaded successfully',
            'data' => [
                'path' => $path,
                'url' => $url,
                'event' => $agendaEvent->fresh(),
            ],
        ]);
    }
}
