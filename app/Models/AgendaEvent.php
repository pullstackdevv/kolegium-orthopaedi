<?php

namespace App\Models;

use App\Traits\HasAffiliationScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AgendaEvent extends Model
{
    use SoftDeletes, HasAffiliationScope;

    protected $fillable = [
        'scope',
        'section',
        'type',
        'title',
        'description',
        'location',
        'registration_url',
        'image_url',
        'start_date',
        'end_date',
        'is_published',
        'published_at',
        'created_by',
        'affiliation_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
