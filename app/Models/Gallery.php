<?php

namespace App\Models;

use App\Traits\HasAffiliationScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gallery extends Model
{
    use SoftDeletes, HasAffiliationScope;

    protected $fillable = [
        'affiliation_id',
        'user_id',
        'photo',
        'title',
        'description',
        'gallery_date',
    ];

    protected $casts = [
        'gallery_date' => 'date',
    ];

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
