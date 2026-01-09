<?php

namespace App\Models;

use App\Enums\AffiliationType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Affiliation extends Model
{
    protected $fillable = [
        'name',
        'type',
        'code',
        'since',
        'logo',
    ];

    protected $casts = [
        'type' => AffiliationType::class,
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_affiliations')
            ->withTimestamps();
    }

    public function userAffiliations(): HasMany
    {
        return $this->hasMany(UserAffiliation::class);
    }

    public function agendaEvents(): HasMany
    {
        return $this->hasMany(AgendaEvent::class);
    }
}
