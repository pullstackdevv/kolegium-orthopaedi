<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait HasAffiliationScope
{
    /**
     * Scope query to filter by user's affiliations.
     * Super admin can see all records.
     */
    public function scopeForUserAffiliations(Builder $query, $user = null): Builder
    {
        $user = $user ?? Auth::user();

        if (!$user) {
            return $query->whereRaw('1 = 0');
        }

        if ($user->hasRole('super_admin')) {
            return $query;
        }

        $affiliationIds = $user->affiliations()->pluck('affiliations.id')->toArray();

        if (empty($affiliationIds)) {
            return $query->whereRaw('1 = 0');
        }

        return $query->whereIn('affiliation_id', $affiliationIds);
    }

    /**
     * Scope query to filter by specific affiliation type.
     */
    public function scopeForAffiliationType(Builder $query, string $type): Builder
    {
        return $query->whereHas('affiliation', function ($q) use ($type) {
            $q->where('type', $type);
        });
    }

    /**
     * Scope query to filter by specific affiliation.
     */
    public function scopeForAffiliation(Builder $query, int $affiliationId): Builder
    {
        return $query->where('affiliation_id', $affiliationId);
    }
}
