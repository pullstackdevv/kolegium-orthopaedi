<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgendaEvent extends Model
{
    protected $fillable = [
        'scope',
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
}
