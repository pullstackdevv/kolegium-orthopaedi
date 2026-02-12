<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\DatabaseMember;
use App\Models\MemberAchievement;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MemberAchievementController extends Controller
{
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

    private function ensureMemberAccess(DatabaseMember $member, string $action): ?JsonResponse
    {
        $authUser = Auth::user();

        if (!$authUser instanceof User) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        if ($authUser->hasRole('super_admin')) {
            return null;
        }

        if (!$authUser->hasPermission($this->permissionKey($member->organization_type, $action))) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();

        if (!empty($userAffiliationIds) && $member->affiliation_id !== null) {
            if (!in_array($member->affiliation_id, $userAffiliationIds, true)) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
            }
        }

        return null;
    }

    /**
     * List achievements for a specific database member (CMS).
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'database_member_id' => 'required|integer|exists:database_members,id',
        ]);

        $member = DatabaseMember::findOrFail($request->input('database_member_id'));

        $denied = $this->ensureMemberAccess($member, 'view');
        if ($denied) {
            return $denied;
        }

        $achievements = MemberAchievement::where('database_member_id', $member->id)
            ->orderBy('sort_order')
            ->orderByDesc('date')
            ->get();

        return ResponseFormatter::success('Achievements fetched successfully', $achievements);
    }

    /**
     * Store a new achievement for a database member.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'database_member_id' => 'required|integer|exists:database_members,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'date' => 'nullable|date',
            'category' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
        ]);

        $member = DatabaseMember::findOrFail($validated['database_member_id']);

        $denied = $this->ensureMemberAccess($member, 'edit');
        if ($denied) {
            return $denied;
        }

        $achievement = MemberAchievement::create([
            'database_member_id' => $member->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'date' => $validated['date'] ?? null,
            'category' => $validated['category'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return ResponseFormatter::success('Achievement created successfully', $achievement);
    }

    /**
     * Update an existing achievement.
     */
    public function update(Request $request, MemberAchievement $memberAchievement): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'date' => 'nullable|date',
            'category' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
        ]);

        $member = DatabaseMember::findOrFail($memberAchievement->database_member_id);

        $denied = $this->ensureMemberAccess($member, 'edit');
        if ($denied) {
            return $denied;
        }

        $memberAchievement->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'date' => $validated['date'] ?? null,
            'category' => $validated['category'] ?? null,
            'sort_order' => $validated['sort_order'] ?? $memberAchievement->sort_order,
        ]);

        return ResponseFormatter::success('Achievement updated successfully', $memberAchievement->fresh());
    }

    /**
     * Delete an achievement.
     */
    public function destroy(MemberAchievement $memberAchievement): JsonResponse
    {
        $member = DatabaseMember::findOrFail($memberAchievement->database_member_id);

        $denied = $this->ensureMemberAccess($member, 'delete');
        if ($denied) {
            return $denied;
        }

        $memberAchievement->delete();

        return ResponseFormatter::success('Achievement deleted successfully');
    }

    /**
     * Public endpoint: get achievements for a database member.
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $request->validate([
            'database_member_id' => 'nullable|integer|exists:database_members,id',
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
            'organization_type' => 'nullable|string',
        ]);

        $query = MemberAchievement::query()
            ->orderBy('sort_order')
            ->orderByDesc('date');

        if ($request->filled('database_member_id')) {
            $query->where('database_member_id', $request->input('database_member_id'));
        } elseif ($request->filled('affiliation_id') || $request->filled('organization_type')) {
            $memberIds = DatabaseMember::query()
                ->when($request->filled('affiliation_id'), fn ($q) => $q->where('affiliation_id', $request->input('affiliation_id')))
                ->when($request->filled('organization_type'), fn ($q) => $q->where('organization_type', $request->input('organization_type')))
                ->pluck('id');

            $query->whereIn('database_member_id', $memberIds);
        }

        $achievements = $query->with('databaseMember:id,name,member_code')->get();

        return ResponseFormatter::success('Achievements fetched successfully', $achievements);
    }
}
