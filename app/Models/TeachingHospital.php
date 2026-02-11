<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeachingHospital extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'affiliation_id',
        'category',
        'name',
        'location',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
