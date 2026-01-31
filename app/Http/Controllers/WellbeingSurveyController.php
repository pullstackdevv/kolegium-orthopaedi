<?php

namespace App\Http\Controllers;

use App\Models\WellbeingSurvey;
use App\Models\Affiliation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WellbeingSurveyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('WellbeingSurvey/Index');
    }

    public function show(Request $request): Response
    {
        $code = $request->query('code');
        $affiliation = null;
        $crisisResources = null;

        if ($code) {
            $affiliation = Affiliation::where('code', $code)->first();
            
            if ($affiliation) {
                $crisisResources = $this->resolveCrisisResources($affiliation);
            }
        }

        return Inertia::render('WellbeingSurvey/Show', [
            'affiliation' => $affiliation,
            'crisisResources' => $crisisResources,
        ]);
    }

    private function resolveCrisisResources(Affiliation $affiliation): array
    {
        return [
            'local' => [
                'name' => 'Faculty Counseling Unit',
                'description' => 'Professional support from faculty',
            ],
            'emergency' => [
                'name' => 'University Hospital Emergency Unit',
                'description' => 'Emergency mental health support',
            ],
            'lifeline' => [
                'name' => 'Suicide & Crisis Lifeline',
                'phone' => '+62 811-2800-244',
                'availability' => '24 hours, 7 days a week',
            ],
            'professional_committee' => [
                'name' => 'Professional Behavior Committee',
                'phone' => '+62 811-2800-2440',
                'availability' => 'Monday–Friday, 10:00–18:00 WIB',
            ],
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'affiliation_id' => 'required|exists:affiliations,id',
            'affiliation_code' => 'nullable|string',
            'participant_type' => 'nullable|string',
            'university' => 'nullable|string',
            'faculty' => 'nullable|string',
            'study_program_name' => 'nullable|string',
            'program_type' => 'nullable|string',
            'mood' => 'required|in:happy,normal,worry,depressed,help_me',
            'burnout' => 'required|boolean',
            'emotional_hardening' => 'required|boolean',
            'depressed' => 'required|boolean',
            'sleep_issue' => 'required|boolean',
            'bullying' => 'required|boolean',
            'discomfort' => 'required|boolean',
            'discomfort_note' => 'nullable|string|max:1000',
        ]);

        try {
            $survey = new WellbeingSurvey($validated);
            $survey->user_id = Auth::id();
            $survey->survey_type = 'wellbeing';
            
            $affiliation = Affiliation::find($validated['affiliation_id']);
            if ($affiliation) {
                $survey->crisis_resources = $this->resolveCrisisResources($affiliation);
            }
            
            $survey->mental_health_score = $survey->calculateMentalHealthScore();
            $survey->risk_level = $survey->calculateRiskLevel();

            $survey->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Survey submitted successfully.',
                'data' => [
                    'id' => $survey->id,
                    'risk_level' => $survey->risk_level,
                    'affirmation_message' => $survey->getAffirmationMessage(),
                    'mental_health_score' => $survey->mental_health_score,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit survey.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getResult(int $surveyId): JsonResponse
    {
        $survey = WellbeingSurvey::find($surveyId);

        if (!$survey) {
            return response()->json([
                'status' => 'error',
                'message' => 'Survey not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $survey->id,
                'risk_level' => $survey->risk_level,
                'mental_health_score' => $survey->mental_health_score,
                'affirmation_message' => $survey->getAffirmationMessage(),
                'mood' => $survey->mood,
                'discomfort' => $survey->discomfort,
                'discomfort_note' => $survey->discomfort_note,
                'created_at' => $survey->created_at,
            ],
        ]);
    }

    public function getStats(Request $request): JsonResponse
    {
        $affiliationId = $request->query('affiliation_id');
        $query = WellbeingSurvey::query();

        if ($affiliationId) {
            $query->where('affiliation_id', $affiliationId);
        }

        $stats = [
            'total_surveys' => $query->count(),
            'risk_distribution' => [
                'low' => $query->where('risk_level', 'low')->count(),
                'mild' => $query->where('risk_level', 'mild')->count(),
                'moderate' => $query->where('risk_level', 'moderate')->count(),
                'high' => $query->where('risk_level', 'high')->count(),
            ],
            'mood_distribution' => $query->groupBy('mood')
                ->selectRaw('mood, count(*) as count')
                ->get()
                ->pluck('count', 'mood'),
            'discomfort_percentage' => $query->where('discomfort', true)->count() / max($query->count(), 1) * 100,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    public function list(Request $request): JsonResponse
    {
        $affiliationId = $request->query('affiliation_id');
        $riskLevel = $request->query('risk_level');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 15);

        $query = WellbeingSurvey::query();

        if ($affiliationId) {
            $query->where('affiliation_id', $affiliationId);
        }

        if ($riskLevel) {
            $query->where('risk_level', $riskLevel);
        }

        $surveys = $query->with('affiliation')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => 'success',
            'data' => $surveys->items(),
            'pagination' => [
                'total' => $surveys->total(),
                'per_page' => $surveys->perPage(),
                'current_page' => $surveys->currentPage(),
                'last_page' => $surveys->lastPage(),
            ],
        ]);
    }
}
