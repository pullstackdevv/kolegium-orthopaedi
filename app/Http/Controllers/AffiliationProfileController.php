<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\Affiliation;
use App\Models\AffiliationProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AffiliationProfileController extends Controller
{
    /**
     * Resolve the permission key based on scope and section.
     * e.g. scope=study_program, section=resident => "profile.study_program.resident"
     * e.g. scope=peer_group => "profile.peer_group"
     */
    private function resolvePermissionPrefix(Request $request): string
    {
        $scope = $request->query('scope', '');
        $section = $request->query('section', '');

        if ($scope === 'peer_group') {
            return 'profile.peer_group';
        }

        if ($scope === 'study_program' && $section) {
            return "profile.study_program.{$section}";
        }

        return 'profile';
    }

    /**
     * Resolve the affiliation type from scope/section for filtering.
     */
    private function resolveAffiliationType(string $scope, string $section): ?string
    {
        if ($scope === 'peer_group') {
            return 'peer_group';
        }

        if ($scope === 'study_program') {
            return match ($section) {
                'resident' => 'residen',
                'fellow' => 'clinical_fellowship',
                'trainee' => 'subspesialis',
                default => null,
            };
        }

        return null;
    }

    /**
     * Get the profile for a specific affiliation (used by CMS).
     * Auto-resolves affiliation based on user's affiliation or allows super_admin to pick.
     */
    public function show(Request $request): JsonResponse
    {
        $user = Auth::user();
        $scope = $request->query('scope', '');
        $section = $request->query('section', '');
        $affiliationId = $request->query('affiliation_id');

        $permPrefix = $this->resolvePermissionPrefix($request);

        if (!$user->hasRole('super_admin') && !$user->hasRole('owner') && !$user->hasPermission("{$permPrefix}.view")) {
            return ResponseFormatter::error('Unauthorized', [], 403);
        }

        // Resolve affiliation
        if ($user->hasRole('super_admin') || $user->hasRole('owner')) {
            if ($affiliationId) {
                $affiliation = Affiliation::find($affiliationId);
            } else {
                // Return list of affiliations for super_admin to pick
                $affiliationType = $this->resolveAffiliationType($scope, $section);
                $affiliations = Affiliation::query()
                    ->select(['id', 'name', 'code', 'type'])
                    ->when($affiliationType, fn($q) => $q->where('type', $affiliationType))
                    ->orderBy('name')
                    ->get();

                return ResponseFormatter::success('Select an affiliation', [
                    'affiliations' => $affiliations,
                    'profile' => null,
                ]);
            }
        } else {
            // Non-super-admin: auto-resolve from user's affiliations
            $affiliationType = $this->resolveAffiliationType($scope, $section);
            $affiliation = $user->affiliations()
                ->when($affiliationType, fn($q) => $q->where('type', $affiliationType))
                ->first();
        }

        if (!$affiliation) {
            return ResponseFormatter::error('Affiliation not found', [], 404);
        }

        $profile = AffiliationProfile::where('affiliation_id', $affiliation->id)->first();

        // Resolve cover_image and logo URLs
        if ($profile && $profile->cover_image) {
            $profile->cover_image_url = Storage::url($profile->cover_image);
        }
        if ($profile && $profile->logo) {
            $profile->logo_url = Storage::url($profile->logo);
        }

        return ResponseFormatter::success('Profile retrieved', [
            'affiliation' => $affiliation->only(['id', 'name', 'code', 'type', 'logo']),
            'profile' => $profile,
        ]);
    }

    /**
     * Create or update the profile for an affiliation.
     */
    public function upsert(Request $request): JsonResponse
    {
        $user = Auth::user();
        $permPrefix = $this->resolvePermissionPrefix($request);

        if (!$user->hasRole('super_admin') && !$user->hasRole('owner') && !$user->hasPermission("{$permPrefix}.edit")) {
            return ResponseFormatter::error('Unauthorized', [], 403);
        }

        $validated = $request->validate([
            'affiliation_id' => 'required|exists:affiliations,id',
            'description' => 'nullable|string',
            'sub_title' => 'nullable|string|max:255',
            'accreditation' => 'nullable|string|max:255',
            'established_year' => 'nullable|string|max:50',
            'program_duration' => 'nullable|string|max:100',
            'capacity' => 'nullable|string|max:100',
            'contact_address' => 'nullable|string',
            'contact_phone' => 'nullable|string|max:50',
            'contact_email' => 'nullable|string|email|max:255',
            'contact_website' => 'nullable|string|max:255',
            'registration_info' => 'nullable|string',
            'registration_url' => 'nullable|string|max:500',
        ]);

        // Verify user has access to this affiliation (non-super-admin)
        if (!$user->hasRole('super_admin') && !$user->hasRole('owner')) {
            $hasAccess = $user->affiliations()->where('affiliations.id', $validated['affiliation_id'])->exists();
            if (!$hasAccess) {
                return ResponseFormatter::error('You do not have access to this affiliation', [], 403);
            }
        }

        $profile = AffiliationProfile::withTrashed()
            ->where('affiliation_id', $validated['affiliation_id'])
            ->first();

        if ($profile && $profile->trashed()) {
            $profile->restore();
        }

        $profile = AffiliationProfile::updateOrCreate(
            ['affiliation_id' => $validated['affiliation_id']],
            collect($validated)->except('affiliation_id')->toArray()
        );

        return ResponseFormatter::success('Profile saved successfully', $profile);
    }

    /**
     * Upload cover image for an affiliation profile.
     */
    public function uploadCoverImage(Request $request): JsonResponse
    {
        $user = Auth::user();
        $permPrefix = $this->resolvePermissionPrefix($request);

        if (!$user->hasRole('super_admin') && !$user->hasRole('owner') && !$user->hasPermission("{$permPrefix}.edit")) {
            return ResponseFormatter::error('Unauthorized', [], 403);
        }

        $request->validate([
            'affiliation_id' => 'required|exists:affiliations,id',
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $affiliationId = $request->input('affiliation_id');

        // Verify access for non-super-admin
        if (!$user->hasRole('super_admin') && !$user->hasRole('owner')) {
            $hasAccess = $user->affiliations()->where('affiliations.id', $affiliationId)->exists();
            if (!$hasAccess) {
                return ResponseFormatter::error('You do not have access to this affiliation', [], 403);
            }
        }

        $profile = AffiliationProfile::firstOrCreate(
            ['affiliation_id' => $affiliationId]
        );

        // Delete old cover image if exists
        if ($profile->cover_image && Storage::exists($profile->cover_image)) {
            Storage::delete($profile->cover_image);
        }

        $path = $request->file('cover_image')->store('affiliation-profiles/covers', 'public');
        $profile->update(['cover_image' => $path]);

        return ResponseFormatter::success('Cover image uploaded', [
            'cover_image' => $path,
            'cover_image_url' => Storage::url($path),
        ]);
    }

    /**
     * Upload logo for an affiliation profile.
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        $user = Auth::user();
        $permPrefix = $this->resolvePermissionPrefix($request);

        if (!$user->hasRole('super_admin') && !$user->hasRole('owner') && !$user->hasPermission("{$permPrefix}.edit")) {
            return ResponseFormatter::error('Unauthorized', [], 403);
        }

        $request->validate([
            'affiliation_id' => 'required|exists:affiliations,id',
            'logo' => 'required|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
        ]);

        $affiliationId = $request->input('affiliation_id');

        // Verify access for non-super-admin
        if (!$user->hasRole('super_admin') && !$user->hasRole('owner')) {
            $hasAccess = $user->affiliations()->where('affiliations.id', $affiliationId)->exists();
            if (!$hasAccess) {
                return ResponseFormatter::error('You do not have access to this affiliation', [], 403);
            }
        }

        $profile = AffiliationProfile::firstOrCreate(
            ['affiliation_id' => $affiliationId]
        );

        // Delete old logo if exists
        if ($profile->logo && Storage::exists($profile->logo)) {
            Storage::delete($profile->logo);
        }

        $path = $request->file('logo')->store('affiliation-profiles/logos', 'public');
        $profile->update(['logo' => $path]);

        return ResponseFormatter::success('Logo uploaded', [
            'logo' => $path,
            'logo_url' => Storage::url($path),
        ]);
    }

    /**
     * Soft delete the profile for an affiliation.
     */
    public function destroy(Request $request, int $affiliationId): JsonResponse
    {
        $user = Auth::user();
        $permPrefix = $this->resolvePermissionPrefix($request);

        if (!$user->hasRole('super_admin') && !$user->hasRole('owner') && !$user->hasPermission("{$permPrefix}.edit")) {
            return ResponseFormatter::error('Unauthorized', [], 403);
        }

        // Verify access for non-super-admin
        if (!$user->hasRole('super_admin') && !$user->hasRole('owner')) {
            $hasAccess = $user->affiliations()->where('affiliations.id', $affiliationId)->exists();
            if (!$hasAccess) {
                return ResponseFormatter::error('You do not have access to this affiliation', [], 403);
            }
        }

        $profile = AffiliationProfile::where('affiliation_id', $affiliationId)->first();

        if (!$profile) {
            return ResponseFormatter::error('Profile not found', [], 404);
        }

        $profile->delete(); // Soft delete

        return ResponseFormatter::success('Profile deleted', null);
    }

    /**
     * Public endpoint: get profile by affiliation ID (for public detail pages).
     */
    public function publicShow(int $affiliationId): JsonResponse
    {
        $affiliation = Affiliation::with('profile')->find($affiliationId);

        if (!$affiliation) {
            return ResponseFormatter::error('Affiliation not found', [], 404);
        }

        $profile = $affiliation->profile;

        if ($profile && $profile->cover_image) {
            $profile->cover_image_url = Storage::url($profile->cover_image);
        }
        if ($profile && $profile->logo) {
            $profile->logo_url = Storage::url($profile->logo);
        }

        return ResponseFormatter::success('Profile retrieved', [
            'affiliation' => $affiliation->only(['id', 'name', 'code', 'type', 'logo']),
            'profile' => $profile,
        ]);
    }
}
