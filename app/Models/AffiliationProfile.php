<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AffiliationProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'affiliation_id',
        'description',
        'sub_title',
        'logo',
        'cover_image',
        'accreditation',
        'established_year',
        'program_duration',
        'capacity',
        'contact_address',
        'contact_phone',
        'contact_email',
        'contact_website',
        'registration_info',
        'registration_url',
    ];

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
