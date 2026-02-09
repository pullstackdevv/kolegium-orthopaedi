<?php

namespace App\Http\Controllers;

use App\Models\OrgStructureMember;
use App\Models\Affiliation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class OrgStructureMemberController extends Controller
{
    private const ORG_TYPES = [
        'koti',
        'kolkes',
        'resident',
        'fellow',
        'trainee',
        'peer_group',
    ];

    private function permissionKey(string $organizationType, string $action): string
    {
        return match ($organizationType) {
            'koti' => "database.kolegium.koti.{$action}",
            'kolkes' => "database.kolegium.kolkes.{$action}",
            'resident' => "database.study_program.resident.{$action}",
            'fellow' => "database.study_program.fellow.{$action}",
            'trainee' => "database.study_program.trainee.{$action}",
            'peer_group' => "database.peer_group.{$action}",
            default => "database.{$organizationType}.{$action}",
        };
    }

    private function ensurePermission(string $organizationType, string $action): ?JsonResponse
    {
        $authUser = Auth::user();

        if (!$authUser instanceof User) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        if ($authUser->hasRole('super_admin')) {
            return null;
        }

        if (!$authUser->hasPermission($this->permissionKey($organizationType, $action))) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        return null;
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'view')) {
            return $resp;
        }

        $authUser = Auth::user();

        $query = OrgStructureMember::query()
            ->where('organization_type', $orgType)
            ->with(['affiliation:id,name,code']);

        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();

            if (!empty($userAffiliationIds)) {
                $query->forUserAffiliations($authUser);
            } elseif (isset($validated['affiliation_id'])) {
                $query->where('affiliation_id', $validated['affiliation_id']);
            } else {
                return response()->json(['status' => 'error', 'message' => 'Affiliation is required.'], 422);
            }
        } elseif (isset($validated['affiliation_id'])) {
            $query->where('affiliation_id', $validated['affiliation_id']);
        }

        $members = $query->orderBy('position_order')->orderBy('name')->get();

        return response()->json([
            'status' => 'success',
            'data' => $members,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'photo' => 'nullable|string|max:1000',
            'position_order' => 'nullable|integer|min:0',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'create')) {
            return $resp;
        }

        $authUser = Auth::user();

        // Resolve affiliation_id for non-super-admin
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();

            if (!empty($userAffiliationIds)) {
                if (isset($validated['affiliation_id']) && $validated['affiliation_id'] !== null) {
                    if (!in_array($validated['affiliation_id'], $userAffiliationIds, true)) {
                        return response()->json(['status' => 'error', 'message' => 'You do not have access to the selected affiliation.'], 403);
                    }
                } else {
                    $validated['affiliation_id'] = $userAffiliationIds[0];
                }
            } elseif (!isset($validated['affiliation_id']) || $validated['affiliation_id'] === null) {
                return response()->json(['status' => 'error', 'message' => 'Affiliation is required.'], 422);
            }
        }

        $validated['position_order'] = $validated['position_order'] ?? 0;

        $member = OrgStructureMember::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Organizational structure member created successfully',
            'data' => $member->load('affiliation:id,name,code'),
        ], 201);
    }

    public function update(Request $request, OrgStructureMember $orgStructureMember): JsonResponse
    {
        $orgType = $orgStructureMember->organization_type;

        if ($resp = $this->ensurePermission($orgType, 'edit')) {
            return $resp;
        }

        $authUser = Auth::user();

        // Check affiliation access
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds) && $orgStructureMember->affiliation_id !== null) {
                if (!in_array($orgStructureMember->affiliation_id, $userAffiliationIds, true)) {
                    return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
                }
            }
        }

        $validated = $request->validate([
            'affiliation_id' => 'sometimes|nullable|integer|exists:affiliations,id',
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|nullable|string|email|max:255',
            'photo' => 'nullable|string|max:1000',
            'position_order' => 'nullable|integer|min:0',
        ]);

        $orgStructureMember->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Organizational structure member updated successfully',
            'data' => $orgStructureMember->fresh()->load('affiliation:id,name,code'),
        ]);
    }

    public function destroy(OrgStructureMember $orgStructureMember): JsonResponse
    {
        $orgType = $orgStructureMember->organization_type;

        if ($resp = $this->ensurePermission($orgType, 'delete')) {
            return $resp;
        }

        $authUser = Auth::user();

        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds) && $orgStructureMember->affiliation_id !== null) {
                if (!in_array($orgStructureMember->affiliation_id, $userAffiliationIds, true)) {
                    return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
                }
            }
        }

        $orgStructureMember->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Organizational structure member deleted successfully',
        ]);
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'image' => 'required|file|image|max:5120',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'create')) {
            return $resp;
        }

        $path = $request->file('image')->store('org-structure', 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'status' => 'success',
            'message' => 'Photo uploaded successfully',
            'data' => [
                'path' => $path,
                'url' => $url,
            ],
        ]);
    }

    public function uploadPhotoForMember(Request $request, OrgStructureMember $orgStructureMember): JsonResponse
    {
        $request->validate([
            'image' => 'required|file|image|max:5120',
        ]);

        $orgType = $orgStructureMember->organization_type;

        if ($resp = $this->ensurePermission($orgType, 'edit')) {
            return $resp;
        }

        $authUser = Auth::user();

        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds) && $orgStructureMember->affiliation_id !== null) {
                if (!in_array($orgStructureMember->affiliation_id, $userAffiliationIds, true)) {
                    return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
                }
            }
        }

        $path = $request->file('image')->store('org-structure', 'public');
        $url = asset('storage/' . $path);

        $orgStructureMember->update(['photo' => $url]);

        return response()->json([
            'status' => 'success',
            'message' => 'Photo uploaded successfully',
            'data' => [
                'path' => $path,
                'url' => $url,
                'member' => $orgStructureMember->fresh(),
            ],
        ]);
    }

    public function affiliations(Request $request): JsonResponse
    {
        $authUser = Auth::user();

        if (!$authUser instanceof User) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        $type = $request->string('type')->toString();

        $affiliations = Affiliation::query()
            ->when($type !== '', fn ($q) => $q->where('type', $type))
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $affiliations,
        ]);
    }

    // Public endpoint for detail pages
    public function publicIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'required|integer|exists:affiliations,id',
        ]);

        $members = OrgStructureMember::query()
            ->where('organization_type', $validated['organization_type'])
            ->where('affiliation_id', $validated['affiliation_id'])
            ->orderBy('position_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $members,
        ]);
    }
}
