<?php

namespace App\Models;

use App\Traits\HasAffiliationScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrgStructureMember extends Model
{
    use SoftDeletes, HasAffiliationScope;

    protected $fillable = [
        'organization_type',
        'affiliation_id',
        'name',
        'position',
        'email',
        'photo',
        'position_order',
    ];

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
