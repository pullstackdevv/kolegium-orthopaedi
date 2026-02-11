<?php

namespace App\Http\Controllers;

use App\Models\Specialization;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SpecializationController extends Controller
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
        if (!$authUser->hasPermission("profile.study_program.trainee.{$action}")) {
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

        $specializations = Specialization::query()
            ->where('affiliation_id', $validated['affiliation_id'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json(['status' => 'success', 'data' => $specializations]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'required|integer|exists:affiliations,id',
            'name' => 'required|string|max:255',
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

        $specialization = Specialization::create($validated);

        return response()->json(['status' => 'success', 'data' => $specialization], 201);
    }

    public function update(Request $request, Specialization $specialization): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($resp = $this->ensurePermission('edit')) {
            return $resp;
        }

        $authUser = Auth::user();
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $hasAccess = $authUser->affiliations()->where('affiliations.id', $specialization->affiliation_id)->exists();
            if (!$hasAccess) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to this affiliation.'], 403);
            }
        }

        $specialization->update($validated);

        return response()->json(['status' => 'success', 'data' => $specialization]);
    }

    public function destroy(Specialization $specialization): JsonResponse
    {
        if ($resp = $this->ensurePermission('edit')) {
            return $resp;
        }

        $authUser = Auth::user();
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $hasAccess = $authUser->affiliations()->where('affiliations.id', $specialization->affiliation_id)->exists();
            if (!$hasAccess) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to this affiliation.'], 403);
            }
        }

        $specialization->delete();

        return response()->json(['status' => 'success', 'message' => 'Specialization deleted.']);
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'required|integer|exists:affiliations,id',
        ]);

        $specializations = Specialization::query()
            ->where('affiliation_id', $validated['affiliation_id'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json(['status' => 'success', 'data' => $specializations]);
    }
}
