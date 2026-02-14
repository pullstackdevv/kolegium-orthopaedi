<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MemberAchievement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'database_member_id',
        'title',
        'description',
        'date',
        'category',
        'sort_order',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function databaseMember(): BelongsTo
    {
        return $this->belongsTo(DatabaseMember::class);
    }
}
