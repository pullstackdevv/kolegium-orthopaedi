<?php

namespace App\Http\Controllers;

use App\Models\TeachingHospital;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeachingHospitalController extends Controller
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
        if (!$authUser->hasPermission("profile.study_program.resident.{$action}")) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }
        return null;
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'required|integer|exists:affiliations,id',
        ]);

        if ($resp = $this->ensurePermission('view')) {
            return $resp;
        }

        $hospitals = TeachingHospital::query()
            ->where('affiliation_id', $validated['affiliation_id'])
            ->orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json(['status' => 'success', 'data' => $hospitals]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'required|integer|exists:affiliations,id',
            'category' => 'required|string|in:main,satellite,international',
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($resp = $this->ensurePermission('edit')) {
            return $resp;
        }

        $authUser = Auth::user();
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $hasAccess = $authUser->affiliations()->where('affiliations.id', $validated['affiliation_id'])->exists();
            if (!$hasAccess) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to this affiliation.'], 403);
            }
        }

        $hospital = TeachingHospital::create($validated);

        return response()->json(['status' => 'success', 'data' => $hospital], 201);
    }

    public function update(Request $request, TeachingHospital $teachingHospital): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|in:main,satellite,international',
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($resp = $this->ensurePermission('edit')) {
            return $resp;
        }

        $authUser = Auth::user();
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $hasAccess = $authUser->affiliations()->where('affiliations.id', $teachingHospital->affiliation_id)->exists();
            if (!$hasAccess) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to this affiliation.'], 403);
            }
        }

        $teachingHospital->update($validated);

        return response()->json(['status' => 'success', 'data' => $teachingHospital]);
    }

    public function destroy(TeachingHospital $teachingHospital): JsonResponse
    {
        if ($resp = $this->ensurePermission('edit')) {
            return $resp;
        }

        $authUser = Auth::user();
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $hasAccess = $authUser->affiliations()->where('affiliations.id', $teachingHospital->affiliation_id)->exists();
            if (!$hasAccess) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to this affiliation.'], 403);
            }
        }

        $teachingHospital->delete();

        return response()->json(['status' => 'success', 'message' => 'Teaching hospital deleted.']);
    }

    /**
     * Public endpoint: get teaching hospitals for an affiliation.
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'required|integer|exists:affiliations,id',
        ]);

        $hospitals = TeachingHospital::query()
            ->where('affiliation_id', $validated['affiliation_id'])
            ->orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'category', 'name', 'location']);

        return response()->json(['status' => 'success', 'data' => $hospitals]);
    }
}
