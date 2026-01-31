<?php

namespace App\Http\Controllers;

use App\Enums\AffiliationType;
use App\Models\Affiliation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;

class AffiliationController extends Controller
{
    public function publicIndex(Request $request): JsonResponse
    {
        $type = $request->string('type')->toString();

        $affiliations = Affiliation::query()
            ->select(['id', 'name', 'code', 'type', 'since', 'logo', 'created_at'])
            ->when($type !== '', fn ($q) => $q->where('type', $type))
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($affiliation) {
                if ($affiliation->logo) {
                    $affiliation->logo = Storage::url($affiliation->logo);
                }
                return $affiliation;
            });

        return response()->json([
            'status' => 'success',
            'data' => $affiliations,
        ]);
    }

    public function getByCode(string $code): JsonResponse
    {
        $affiliation = Affiliation::query()
            ->where('code', $code)
            ->first();

        if (!$affiliation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Affiliation not found.',
            ], 404);
        }

        if ($affiliation->logo) {
            $affiliation->logo = Storage::url($affiliation->logo);
        }

        return response()->json([
            'status' => 'success',
            'data' => $affiliation,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User || !$authUser->hasPermission('users.view')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. You do not have permission to view affiliations.'
            ], 403);
        }

        $affiliations = Affiliation::query()
            ->withCount('users')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $query->orderBy($sortBy, $request->sort_direction ?? 'asc');
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($affiliation) {
                if ($affiliation->logo) {
                    $affiliation->logo = Storage::url($affiliation->logo);
                }
                return $affiliation;
            });

        return response()->json([
            'status' => 'success',
            'data' => $affiliations
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User || !$authUser->hasPermission('users.create')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. You do not have permission to create affiliations.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', new Enum(AffiliationType::class)],
            'code' => 'required|string|max:50|unique:affiliations,code',
            'since' => 'nullable|string|max:4',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('logo')) {
                $validated['logo'] = $request->file('logo')->store('affiliations/logos', 'public');
            }

            $affiliation = Affiliation::create($validated);

            if ($affiliation->logo) {
                $affiliation->logo = Storage::url($affiliation->logo);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Affiliation created successfully',
                'data' => $affiliation
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(Affiliation $affiliation): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User || !$authUser->hasPermission('users.view')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. You do not have permission to view affiliations.'
            ], 403);
        }

        $affiliationData = $affiliation->load('users');
        if ($affiliationData->logo) {
            $affiliationData->logo = Storage::url($affiliationData->logo);
        }

        return response()->json([
            'status' => 'success',
            'data' => $affiliationData
        ]);
    }

    public function update(Request $request, Affiliation $affiliation): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User || !$authUser->hasPermission('users.edit')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. You do not have permission to edit affiliations.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => ['sometimes', 'required', new Enum(AffiliationType::class)],
            'code' => 'sometimes|required|string|max:50|unique:affiliations,code,' . $affiliation->id,
            'since' => 'nullable|string|max:4',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('logo')) {
                if ($affiliation->logo) {
                    Storage::disk('public')->delete($affiliation->logo);
                }
                $validated['logo'] = $request->file('logo')->store('affiliations/logos', 'public');
            }

            $affiliation->update($validated);

            $updatedAffiliation = $affiliation->fresh();
            if ($updatedAffiliation->logo) {
                $updatedAffiliation->logo = Storage::url($updatedAffiliation->logo);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Affiliation updated successfully',
                'data' => $updatedAffiliation
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(Affiliation $affiliation): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User || !$authUser->hasPermission('users.delete')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. You do not have permission to delete affiliations.'
            ], 403);
        }

        if ($affiliation->users()->count() > 0) {
            throw ValidationException::withMessages([
                'affiliation' => ['Cannot delete affiliation that has users assigned to it.']
            ]);
        }

        try {
            DB::beginTransaction();

            if ($affiliation->logo) {
                Storage::disk('public')->delete($affiliation->logo);
            }

            $affiliation->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Affiliation deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getUserAffiliations(User $user): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User || !$authUser->hasPermission('users.view')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $affiliations = $user->affiliations()->get();

        return response()->json([
            'status' => 'success',
            'data' => $affiliations
        ]);
    }

    public function assignUserAffiliations(Request $request, User $user): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User || !$authUser->hasPermission('users.edit')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.'
            ], 403);
        }

        $validated = $request->validate([
            'affiliation_ids' => 'required|array|min:1',
            'affiliation_ids.*' => 'exists:affiliations,id',
        ]);

        try {
            DB::beginTransaction();

            $user->affiliations()->sync($validated['affiliation_ids']);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'User affiliations updated successfully',
                'data' => $user->affiliations()->get()
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
