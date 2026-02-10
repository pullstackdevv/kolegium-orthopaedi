<?php

namespace App\Models;

use App\Traits\HasAffiliationScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DatabaseMember extends Model
{
    use SoftDeletes, HasAffiliationScope;

    protected $fillable = [
        'organization_type',
        'affiliation_id',
        'member_code',
        'name',
        'position',
        'photo',
        'contact',
        'entry_date',
        'gender',
        'specialization',
        'status',
        'specialty',
        'group',
        'title',
        'location',
        'regency_id',
    ];

    protected $casts = [
        'entry_date' => 'date',
    ];

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }

    public function regency(): BelongsTo
    {
        return $this->belongsTo(Regency::class);
    }
}
