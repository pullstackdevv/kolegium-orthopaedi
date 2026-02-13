<?php

namespace App\Http\Controllers;

use App\Models\TeacherStaffMember;
use App\Models\TeacherStaffDivision;
use App\Models\Affiliation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherStaffMemberController extends Controller
{
    private function ensurePermission(string $action): ?JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }
        if ($authUser->hasRole('super_admin')) {
            return null;
        }
        if (!$authUser->hasPermission("database.study_program.resident.{$action}")) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }
        return null;
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
        ]);

        if ($resp = $this->ensurePermission('view')) {
            return $resp;
        }

        $authUser = Auth::user();
        $query = TeacherStaffMember::query()->with(['division:id,name', 'affiliation:id,name,code']);

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

        $members = $query->orderBy('name')->get();

        return response()->json(['status' => 'success', 'data' => $members]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
            'name' => 'required|string|max:255',
            'photo' => 'nullable|string|max:1000',
            'institution_origin' => 'nullable|string|max:255',
            'teacher_staff_division_id' => 'required|integer|exists:teacher_staff_divisions,id',
        ]);

        if ($resp = $this->ensurePermission('create')) {
            return $resp;
        }

        $authUser = Auth::user();

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

        $member = TeacherStaffMember::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher staff member created successfully',
            'data' => $member->load(['division:id,name', 'affiliation:id,name,code']),
        ], 201);
    }

    public function update(Request $request, TeacherStaffMember $teacherStaffMember): JsonResponse
    {
        if ($resp = $this->ensurePermission('edit')) {
            return $resp;
        }

        $authUser = Auth::user();
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds) && $teacherStaffMember->affiliation_id !== null) {
                if (!in_array($teacherStaffMember->affiliation_id, $userAffiliationIds, true)) {
                    return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
                }
            }
        }

        $validated = $request->validate([
            'affiliation_id' => 'sometimes|nullable|integer|exists:affiliations,id',
            'name' => 'sometimes|required|string|max:255',
            'photo' => 'nullable|string|max:1000',
            'institution_origin' => 'nullable|string|max:255',
            'teacher_staff_division_id' => 'sometimes|required|integer|exists:teacher_staff_divisions,id',
        ]);

        $teacherStaffMember->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher staff member updated successfully',
            'data' => $teacherStaffMember->fresh()->load(['division:id,name', 'affiliation:id,name,code']),
        ]);
    }

    public function destroy(TeacherStaffMember $teacherStaffMember): JsonResponse
    {
        if ($resp = $this->ensurePermission('delete')) {
            return $resp;
        }

        $authUser = Auth::user();
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds) && $teacherStaffMember->affiliation_id !== null) {
                if (!in_array($teacherStaffMember->affiliation_id, $userAffiliationIds, true)) {
                    return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
                }
            }
        }

        $teacherStaffMember->delete();

        return response()->json(['status' => 'success', 'message' => 'Teacher staff member deleted successfully']);
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate(['image' => 'required|file|image|max:5120']);

        if ($resp = $this->ensurePermission('create')) {
            return $resp;
        }

        $path = $request->file('image')->store('teacher-staff', 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'status' => 'success',
            'message' => 'Photo uploaded successfully',
            'data' => ['path' => $path, 'url' => $url],
        ]);
    }

    public function uploadPhotoForMember(Request $request, TeacherStaffMember $teacherStaffMember): JsonResponse
    {
        $request->validate(['image' => 'required|file|image|max:5120']);

        if ($resp = $this->ensurePermission('edit')) {
            return $resp;
        }

        $authUser = Auth::user();
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds) && $teacherStaffMember->affiliation_id !== null) {
                if (!in_array($teacherStaffMember->affiliation_id, $userAffiliationIds, true)) {
                    return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
                }
            }
        }

        $path = $request->file('image')->store('teacher-staff', 'public');
        $url = asset('storage/' . $path);
        $teacherStaffMember->update(['photo' => $url]);

        return response()->json([
            'status' => 'success',
            'message' => 'Photo uploaded successfully',
            'data' => ['path' => $path, 'url' => $url, 'member' => $teacherStaffMember->fresh()],
        ]);
    }

    public function divisions(): JsonResponse
    {
        $divisions = TeacherStaffDivision::orderBy('name')->get(['id', 'name']);
        return response()->json(['status' => 'success', 'data' => $divisions]);
    }

    public function affiliations(Request $request): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        $query = Affiliation::query()
            ->where('type', 'residen');

        // Non-super-admin: only return user's own affiliations
        if (!$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds)) {
                $query->whereIn('id', $userAffiliationIds);
            }
        }

        $affiliations = $query->orderBy('name')->get();

        return response()->json(['status' => 'success', 'data' => $affiliations]);
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'required|integer|exists:affiliations,id',
        ]);

        $members = TeacherStaffMember::query()
            ->where('affiliation_id', $validated['affiliation_id'])
            ->with(['division:id,name'])
            ->orderBy('name')
            ->get();

        return response()->json(['status' => 'success', 'data' => $members]);
    }
}
