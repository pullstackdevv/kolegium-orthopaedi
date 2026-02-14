<?php

namespace App\Models;

use App\Traits\HasAffiliationScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class WellbeingSurvey extends Model
{
    use SoftDeletes, HasAffiliationScope;

    protected $fillable = [
        'user_id',
        'affiliation_id',
        'member_id',
        'member_code',
        'member_name',
        'member_contact',
        'survey_type',
        'survey_period',
        'participant_type',
        'affiliation_code',
        'university',
        'faculty',
        'study_program_name',
        'program_type',
        'mood',
        'burnout',
        'emotional_hardening',
        'depressed',
        'sleep_issue',
        'bullying',
        'discomfort',
        'discomfort_note',
        'mental_health_score',
        'risk_level',
        'affirmation_message',
        'star_rating',
        'crisis_resources',
    ];

    protected $casts = [
        'burnout' => 'boolean',
        'emotional_hardening' => 'boolean',
        'depressed' => 'boolean',
        'sleep_issue' => 'boolean',
        'bullying' => 'boolean',
        'discomfort' => 'boolean',
        'crisis_resources' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }

    public function calculateMentalHealthScore(): int
    {
        $score = 0;
        $score += $this->burnout ? 1 : 0;
        $score += $this->emotional_hardening ? 1 : 0;
        $score += $this->depressed ? 1 : 0;
        $score += $this->sleep_issue ? 1 : 0;
        $score += $this->bullying ? 1 : 0;

        return $score;
    }

    public function calculateRiskLevel(): string
    {
        $score = $this->calculateMentalHealthScore();

        if ($this->mood === 'depressed' || $this->mood === 'help_me') {
            return 'high';
        }

        if ($this->mood === 'worry') {
            return 'mild';
        }

        return match ($score) {
            0, 1 => 'low',
            2, 3 => 'moderate',
            4, 5 => 'high',
            default => 'low',
        };
    }

    public function getAffirmationMessage(): string
    {
        $riskLevel = $this->risk_level ?? $this->calculateRiskLevel();

        if ($riskLevel === 'low' || $riskLevel === 'mild') {
            return 'You are a great person and we love you. Keep your spirit high. You can do this! :)';
        }

        return 'You are not alone. Support is available and help is near. Please consider reaching out to the resources below.';
    }
}
