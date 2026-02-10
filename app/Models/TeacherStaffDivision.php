<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeacherStaffDivision extends Model
{
    protected $fillable = [
        'name',
    ];

    public function teacherStaffMembers(): HasMany
    {
        return $this->hasMany(TeacherStaffMember::class);
    }
}
