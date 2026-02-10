<?php

namespace App\Models;

use App\Traits\HasAffiliationScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeacherStaffMember extends Model
{
    use SoftDeletes, HasAffiliationScope;

    protected $fillable = [
        'name',
        'photo',
        'institution_origin',
        'teacher_staff_division_id',
        'affiliation_id',
    ];

    public function division(): BelongsTo
    {
        return $this->belongsTo(TeacherStaffDivision::class, 'teacher_staff_division_id');
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
