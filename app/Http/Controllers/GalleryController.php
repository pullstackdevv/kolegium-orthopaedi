<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Affiliation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * Map scope+section to a permission key prefix.
     */
    private function permissionPrefix(?string $scope, ?string $section): string
    {
        if ($scope === 'peer_group') {
            return 'agenda.peer_group';
        }

        // study_program scope
        return match ($section) {
            'resident' => 'agenda.study_program.resident',
            'fellow'   => 'agenda.study_program.fellow',
            'trainee'  => 'agenda.study_program.trainee',
            default    => 'agenda.study_program.resident',
        };
    }

    private function ensurePermission(string $action, ?string $scope, ?string $section): ?JsonResponse
    {
        $authUser = Auth::user();

        if (!$authUser instanceof User) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        if ($authUser->hasRole('super_admin')) {
            return null;
        }

        $key = $this->permissionPrefix($scope, $section) . ".{$action}";

        if (!$authUser->hasPermission($key)) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        return null;
    }

    /**
     * List galleries (CMS).
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'scope' => 'nullable|string|in:study_program,peer_group,kolegium',
            'section' => 'nullable|string|in:resident,fellow,trainee',
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $scope = $validated['scope'] ?? 'study_program';
        $section = $validated['section'] ?? 'resident';

        if ($resp = $this->ensurePermission('view', $scope, $section)) {
            return $resp;
        }

        $authUser = Auth::user();

        $query = Gallery::query()
            ->with(['affiliation:id,name,code', 'user:id,name']);

        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds)) {
                $query->whereIn('affiliation_id', $userAffiliationIds);
            }
        } elseif (!empty($validated['affiliation_id'])) {
            $query->where('affiliation_id', $validated['affiliation_id']);
        }

        $galleries = $query->orderByDesc('gallery_date')->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 12));

        return response()->json([
            'status' => 'success',
            'data' => $galleries,
        ]);
    }

    /**
     * Store a new gallery item.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'scope' => 'nullable|string|in:study_program,peer_group,kolegium',
            'section' => 'nullable|string|in:resident,fellow,trainee',
            'affiliation_id' => 'required|integer|exists:affiliations,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'gallery_date' => 'nullable|date',
            'photo' => 'nullable|string|max:1000',
        ]);

        $scope = $validated['scope'] ?? 'study_program';
        $section = $validated['section'] ?? 'resident';

        if ($resp = $this->ensurePermission('create', $scope, $section)) {
            return $resp;
        }

        $authUser = Auth::user();

        // Non-super-admin: verify affiliation access
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!in_array((int) $validated['affiliation_id'], $userAffiliationIds, true)) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to the selected affiliation.'], 403);
            }
        }

        $gallery = Gallery::create([
            'affiliation_id' => $validated['affiliation_id'],
            'user_id' => $authUser->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'gallery_date' => $validated['gallery_date'] ?? null,
            'photo' => $validated['photo'] ?? '',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Gallery item created successfully',
            'data' => $gallery->load(['affiliation:id,name,code', 'user:id,name']),
        ], 201);
    }

    /**
     * Update a gallery item.
     */
    public function update(Request $request, Gallery $gallery): JsonResponse
    {
        $scope = $request->input('scope', 'study_program');
        $section = $request->input('section', 'resident');

        if ($resp = $this->ensurePermission('edit', $scope, $section)) {
            return $resp;
        }

        $authUser = Auth::user();

        // Check affiliation access
        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!in_array($gallery->affiliation_id, $userAffiliationIds, true)) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
            }
        }

        $validated = $request->validate([
            'affiliation_id' => 'sometimes|integer|exists:affiliations,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'gallery_date' => 'nullable|date',
            'photo' => 'nullable|string|max:1000',
        ]);

        $gallery->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Gallery item updated successfully',
            'data' => $gallery->fresh()->load(['affiliation:id,name,code', 'user:id,name']),
        ]);
    }

    /**
     * Delete a gallery item.
     */
    public function destroy(Request $request, Gallery $gallery): JsonResponse
    {
        $scope = $request->input('scope', 'study_program');
        $section = $request->input('section', 'resident');

        if ($resp = $this->ensurePermission('delete', $scope, $section)) {
            return $resp;
        }

        $authUser = Auth::user();

        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!in_array($gallery->affiliation_id, $userAffiliationIds, true)) {
                return response()->json(['status' => 'error', 'message' => 'You do not have access to this record.'], 403);
            }
        }

        // Delete photo file if stored locally
        if ($gallery->photo && !str_starts_with($gallery->photo, 'http')) {
            Storage::disk('public')->delete($gallery->photo);
        }

        $gallery->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Gallery item deleted successfully',
        ]);
    }

    /**
     * Upload a photo for a gallery item.
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|file|image|max:5120',
        ]);

        $path = $request->file('image')->store('galleries', 'public');
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

    /**
     * Return affiliations for gallery scope.
     */
    public function affiliations(Request $request): JsonResponse
    {
        $authUser = Auth::user();
        if (!$authUser instanceof User) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'type' => 'required|string|in:residen,clinical_fellowship,subspesialis,peer_group,kolegium',
        ]);

        $query = Affiliation::query()->where('type', $validated['type']);

        if (!$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds)) {
                $query->whereIn('id', $userAffiliationIds);
            }
        }

        $affiliations = $query->orderBy('name')->get();

        return response()->json(['status' => 'success', 'data' => $affiliations]);
    }

    /**
     * Public endpoint: list gallery items for an affiliation.
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'required|integer|exists:affiliations,id',
            'per_page' => 'nullable|integer|min:1|max:50',
            'page' => 'nullable|integer|min:1',
        ]);

        $galleries = Gallery::query()
            ->where('affiliation_id', $validated['affiliation_id'])
            ->orderByDesc('gallery_date')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 8));

        return response()->json([
            'status' => 'success',
            'data' => $galleries,
        ]);
    }
}
