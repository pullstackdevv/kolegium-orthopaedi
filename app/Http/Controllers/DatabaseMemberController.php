<?php

namespace App\Http\Controllers;

use App\Models\DatabaseMember;
use App\Models\Affiliation;
use App\Models\Regency;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class DatabaseMemberController extends Controller
{
    private const ORG_TYPES = [
        'koti',
        'kolkes',
        'resident',
        'fellow',
        'trainee',
        'peer_group',
    ];

    private const SPECIALIZATION_OPTIONS = [
        'Hip and Knee (Adult Reconstruction, Trauma, and Sports)',
        'Orthopaedic Sports Injury',
        'Advanced Orthopaedic Trauma',
        'Shoulder and Elbow',
        'Foot and Ankle',
        'Pediatric Orthopaedic',
        'Orthopaedic Oncology',
        'Hand, Upper Limb and Microsurgery',
        'Orthopaedic Spine',
    ];

    private function permissionKey(string $organizationType, string $action): string
    {
        return match ($organizationType) {
            'koti' => "database.kolegium.koti.{$action}",
            'kolkes' => "database.kolegium.kolkes.{$action}",
            'resident' => "database.study_program.resident.{$action}",
            'fellow' => "database.study_program.fellow.{$action}",
            'trainee' => "database.study_program.trainee.{$action}",
            'peer_group' => "database.peer_group.{$action}",
            default => "database.{$organizationType}.{$action}",
        };
    }

    private function ensurePermission(string $organizationType, string $action): ?JsonResponse
    {
        $authUser = Auth::user();

        if (!$authUser instanceof User) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.',
            ], 403);
        }

        if ($authUser->hasRole('super_admin')) {
            return null;
        }

        if (!$authUser->hasPermission($this->permissionKey($organizationType, $action))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.',
            ], 403);
        }

        return null;
    }

    private function resolveAffiliationIdForWrite(array $validated, ?User $authUser, bool $requireAffiliationWhenUserHasNone = true): array
    {
        if (!$authUser instanceof User) {
            return $validated;
        }

        if ($authUser->hasRole('super_admin')) {
            return $validated;
        }

        $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();

        if (!empty($userAffiliationIds)) {
            if (array_key_exists('affiliation_id', $validated) && $validated['affiliation_id'] !== null) {
                if (!in_array($validated['affiliation_id'], $userAffiliationIds, true)) {
                    return [
                        '__error' => [
                            'status' => 'error',
                            'message' => 'You do not have access to the selected affiliation.',
                            'code' => 403,
                        ],
                    ];
                }
            } else {
                $validated['affiliation_id'] = $userAffiliationIds[0];
            }

            return $validated;
        }

        if ($requireAffiliationWhenUserHasNone && (!array_key_exists('affiliation_id', $validated) || $validated['affiliation_id'] === null)) {
            return [
                '__error' => [
                    'status' => 'error',
                    'message' => 'Affiliation is required.',
                    'code' => 422,
                ],
            ];
        }

        return $validated;
    }

    private function ensureRecordAffiliationAccess(DatabaseMember $member, ?User $authUser): ?JsonResponse
    {
        if (!$authUser instanceof User) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.',
            ], 403);
        }

        if ($authUser->hasRole('super_admin')) {
            return null;
        }

        $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();

        if (empty($userAffiliationIds)) {
            return null;
        }

        if ($member->affiliation_id !== null && !in_array($member->affiliation_id, $userAffiliationIds, true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'You do not have access to this record.',
            ], 403);
        }

        return null;
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'view')) {
            return $resp;
        }

        $authUser = Auth::user();

        $query = DatabaseMember::query()->where('organization_type', $orgType);

        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();

            if (!empty($userAffiliationIds)) {
                $query->forUserAffiliations($authUser);
            } else {
                if (!isset($validated['affiliation_id'])) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Affiliation is required.',
                    ], 422);
                }

                $query->where('affiliation_id', $validated['affiliation_id']);
            }
        } elseif (isset($validated['affiliation_id'])) {
            $query->where('affiliation_id', $validated['affiliation_id']);
        }

        $members = $query
            ->with(['affiliation:id,name,code', 'regency:id,province_id,name', 'regency.province:id,name'])
            ->orderBy('name')
            ->paginate($request->integer('per_page', 10));

        return response()->json([
            'status' => 'success',
            'data' => $members,
        ]);
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'required|integer|exists:affiliations,id',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
            'status' => ['nullable', 'string', Rule::in(['active', 'graduated', 'leave'])],
            'search' => 'nullable|string|max:255',
        ]);

        $orgType = $validated['organization_type'];
        $affiliationId = (int) $validated['affiliation_id'];

        $baseQuery = DatabaseMember::query()
            ->where('organization_type', $orgType)
            ->where('affiliation_id', $affiliationId);

        $query = (clone $baseQuery)
            ->when(!empty($validated['status']), fn ($q) => $q->where('status', $validated['status']))
            ->when(!empty($validated['search']), function ($q) use ($validated) {
                $search = $validated['search'];
                $q->where(function ($qq) use ($search) {
                    $qq->where('name', 'like', "%{$search}%")
                        ->orWhere('member_code', 'like', "%{$search}%");
                });
            })
            ->orderBy('name');

        $members = $query->paginate($request->integer('per_page', 10));

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'active' => (clone $baseQuery)->where('status', 'active')->count(),
            'graduated' => (clone $baseQuery)->where('status', 'graduated')->count(),
            'leave' => (clone $baseQuery)->where('status', 'leave')->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $members,
            'stats' => $stats,
        ]);
    }

    public function publicIndexAll(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
            'status' => ['nullable', 'string', Rule::in(['active', 'graduated', 'leave'])],
            'search' => 'nullable|string|max:255',
            'organization_type' => ['nullable', 'string', Rule::in(['resident', 'fellow', 'trainee'])],
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
        ]);

        $baseQuery = DatabaseMember::query()
            ->whereIn('organization_type', ['resident', 'fellow', 'trainee'])
            ->when(!empty($validated['organization_type']), fn ($q) => $q->where('organization_type', $validated['organization_type']))
            ->with('affiliation:id,name,code');

        $query = (clone $baseQuery)
            ->when(!empty($validated['status']), fn ($q) => $q->where('status', $validated['status']))
            ->when(!empty($validated['affiliation_id']), fn ($q) => $q->where('affiliation_id', $validated['affiliation_id']))
            ->when(!empty($validated['search']), function ($q) use ($validated) {
                $search = $validated['search'];
                $q->where(function ($qq) use ($search) {
                    $qq->where('name', 'like', "%{$search}%")
                        ->orWhere('member_code', 'like', "%{$search}%");
                });
            })
            ->orderBy('name');

        $members = $query->paginate($request->integer('per_page', 12));

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'active' => (clone $baseQuery)->where('status', 'active')->count(),
            'graduated' => (clone $baseQuery)->where('status', 'graduated')->count(),
            'leave' => (clone $baseQuery)->where('status', 'leave')->count(),
            'resident' => (clone $baseQuery)->where('organization_type', 'resident')->count(),
            'fellow' => (clone $baseQuery)->where('organization_type', 'fellow')->count(),
            'trainee' => (clone $baseQuery)->where('organization_type', 'trainee')->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $members,
            'stats' => $stats,
        ]);
    }

    public function exportExcel(Request $request)
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'view')) {
            return $resp;
        }

        $authUser = Auth::user();

        $query = DatabaseMember::query()->where('organization_type', $orgType);

        if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();

            if (!empty($userAffiliationIds)) {
                $query->forUserAffiliations($authUser);
            } else {
                if (!isset($validated['affiliation_id'])) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Affiliation is required.',
                    ], 422);
                }

                $query->where('affiliation_id', $validated['affiliation_id']);
            }
        } elseif (isset($validated['affiliation_id'])) {
            $query->where('affiliation_id', $validated['affiliation_id']);
        }

        $isPeerGroup = $orgType === 'peer_group';
        $isResident = $orgType === 'resident';

        if ($isPeerGroup) {
            $allowedColumns = ['photo', 'member_code', 'name', 'gender', 'status'];
        } elseif ($isResident) {
            $allowedColumns = ['photo', 'member_code', 'name', 'gender', 'entry_date', 'semester', 'status', 'regency'];
        } else {
            $allowedColumns = ['photo', 'member_code', 'name', 'gender', 'entry_date', 'specialization', 'status'];
        }

        $headerLabels = [
            'photo' => 'Foto',
            'member_code' => 'NIK',
            'name' => 'Nama',
            'gender' => 'Jenis Kelamin',
            'entry_date' => 'Tanggal Masuk',
            'specialization' => 'Spesialisasi',
            'semester' => 'Semester',
            'status' => 'Status',
            'regency' => 'Kabupaten/Kota',
        ];

        $selectColumns = array_values(array_unique(array_merge(
            array_filter($allowedColumns, fn ($c) => !in_array($c, ['semester', 'regency'], true)),
            ['title', 'regency_id']
        )));
        $members = $query->with('regency:id,name')->orderBy('name')->get($selectColumns);

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($allowedColumns as $i => $col) {
            $cell = Coordinate::stringFromColumnIndex($i + 1) . '1';
            $sheet->setCellValue($cell, $headerLabels[$col] ?? $col);
        }

        $specializationIndex = array_search('specialization', $allowedColumns, true);
        if ($specializationIndex !== false) {
            $optionsSheet = $spreadsheet->createSheet();
            $optionsSheet->setTitle('Options');
            $optionsSheet->setSheetState(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet::SHEETSTATE_HIDDEN);

            foreach (self::SPECIALIZATION_OPTIONS as $idx => $opt) {
                $optionsSheet->setCellValue('A' . (string) ($idx + 1), $opt);
            }

            $colLetter = Coordinate::stringFromColumnIndex(((int) $specializationIndex) + 1);
            $lastRow = count(self::SPECIALIZATION_OPTIONS);
            $formula = "=Options!\$A\$1:\$A\${lastRow}";

            for ($r = 2; $r <= 500; $r++) {
                $validation = new DataValidation();
                $validation->setType(DataValidation::TYPE_LIST);
                $validation->setErrorStyle(DataValidation::STYLE_STOP);
                $validation->setAllowBlank(true);
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                $validation->setShowDropDown(true);
                $validation->setErrorTitle('Input error');
                $validation->setError('Value is not in list.');
                $validation->setPromptTitle('Spesialisasi');
                $validation->setPrompt('Pilih salah satu opsi.');
                $validation->setFormula1($formula);

                $sheet->getCell($colLetter . (string) $r)->setDataValidation($validation);
            }
        }

        $rowNum = 2;
        foreach ($members as $member) {
            foreach ($allowedColumns as $i => $col) {
                $val = $member->{$col};

                if ($col === 'photo') {
                    $val = $this->resolveImageUrlForExport($val === null ? null : (string) $val);
                } elseif ($col === 'name') {
                    $val = $this->buildDisplayNameForExport($member);
                } elseif ($col === 'gender') {
                    $val = $this->formatGenderLabel($val === null ? null : (string) $val);
                } elseif ($col === 'entry_date') {
                    if (!$val) {
                        $val = '';
                    } elseif ($val instanceof \DateTimeInterface) {
                        $val = $val->format('Y-m-d');
                    } elseif (is_string($val)) {
                        $val = substr($val, 0, 10);
                    } else {
                        $val = substr((string) $val, 0, 10);
                    }
                } elseif ($col === 'semester') {
                    $entryDateRaw = $member->entry_date;
                    if ($entryDateRaw instanceof \DateTimeInterface) {
                        $entryDateRaw = $entryDateRaw->format('Y-m-d');
                    } elseif ($entryDateRaw !== null) {
                        $entryDateRaw = substr((string) $entryDateRaw, 0, 10);
                    }
                    $val = $this->calculateSemester($entryDateRaw);
                } elseif ($col === 'status') {
                    $val = $this->formatStatusLabel($val === null ? null : (string) $val);
                } elseif ($col === 'regency') {
                    $val = $member->regency ? $member->regency->name : '';
                } elseif ($val === null) {
                    $val = '';
                }

                $cell = Coordinate::stringFromColumnIndex($i + 1) . (string) $rowNum;
                $sheet->setCellValue($cell, $val);
            }
            $rowNum++;
        }

        $writer = new Xlsx($spreadsheet);

        $affiliationName = '';
        if (isset($validated['affiliation_id']) && $validated['affiliation_id'] !== null) {
            $aff = Affiliation::query()->find($validated['affiliation_id']);
            if ($aff instanceof Affiliation) {
                $affiliationName = (string) ($aff->name ?? '');
            }
        } else {
            if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
                $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
                if (count($userAffiliationIds) === 1) {
                    $aff = Affiliation::query()->find($userAffiliationIds[0]);
                    if ($aff instanceof Affiliation) {
                        $affiliationName = (string) ($aff->name ?? '');
                    }
                } elseif (count($userAffiliationIds) > 1) {
                    $affiliationName = 'all-affiliations';
                }
            }
        }

        $affiliationName = trim($affiliationName);
        if ($affiliationName === '') {
            $affiliationName = 'database-members';
        }

        $safeAffiliationName = mb_strtolower($affiliationName);
        $safeAffiliationName = preg_replace('/[^a-z0-9]+/i', '_', $safeAffiliationName) ?? $safeAffiliationName;
        $safeAffiliationName = trim($safeAffiliationName, '_');

        $exportDate = now()->format('M_j_Y');
        $filename = $safeAffiliationName . '-' . $exportDate . '.xlsx';

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function affiliations(Request $request): JsonResponse
    {
        $authUser = Auth::user();

        if (!$authUser instanceof User) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.',
            ], 403);
        }

        $hasDatabasePermission = false;
        foreach ($authUser->getAllPermissions() as $perm) {
            if (is_string($perm) && str_starts_with($perm, 'database.')) {
                $hasDatabasePermission = true;
                break;
            }
        }

        if (!$authUser->hasRole('super_admin') && !$hasDatabasePermission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized.',
            ], 403);
        }

        $type = $request->string('type')->toString();

        $query = Affiliation::query()
            ->when($type !== '', fn ($q) => $q->where('type', $type));

        // Non-super-admin: only return user's own affiliations
        if (!$authUser->hasRole('super_admin')) {
            $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
            if (!empty($userAffiliationIds)) {
                $query->whereIn('id', $userAffiliationIds);
            }
        }

        $affiliations = $query->orderBy('type')->orderBy('name')->get();

        return response()->json([
            'status' => 'success',
            'data' => $affiliations,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
            'member_code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'photo' => 'nullable|string|max:1000',
            'contact' => 'nullable|string|max:255',
            'entry_date' => 'nullable|date',
            'gender' => ['nullable', 'string', Rule::in(['male', 'female'])],
            'specialization' => ['nullable', 'string', Rule::in(self::SPECIALIZATION_OPTIONS)],
            'status' => ['sometimes', 'string', Rule::in(['active', 'graduated', 'leave'])],
            'specialty' => 'nullable|string|max:255',
            'group' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'regency_id' => 'nullable|integer|exists:regencies,id',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'create')) {
            return $resp;
        }

        $authUser = Auth::user();

        $resolved = $this->resolveAffiliationIdForWrite($validated, $authUser instanceof User ? $authUser : null, true);
        if (isset($resolved['__error'])) {
            return response()->json([
                'status' => $resolved['__error']['status'],
                'message' => $resolved['__error']['message'],
            ], $resolved['__error']['code']);
        }

        $resolved['position'] = $resolved['position'] ?? '';
        $resolved['status'] = $resolved['status'] ?? 'active';

        $dupExists = DatabaseMember::query()
            ->where('organization_type', $orgType)
            ->where('affiliation_id', $resolved['affiliation_id'] ?? null)
            ->where('member_code', $resolved['member_code'])
            ->exists();

        if ($dupExists) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nomor Identitas sudah digunakan.',
            ], 422);
        }

        $member = DatabaseMember::create($resolved);

        return response()->json([
            'status' => 'success',
            'message' => 'Database member created successfully',
            'data' => $member,
        ], 201);
    }

    public function update(Request $request, DatabaseMember $databaseMember): JsonResponse
    {
        $orgType = $databaseMember->organization_type;

        if ($resp = $this->ensurePermission($orgType, 'edit')) {
            return $resp;
        }

        $authUser = Auth::user();

        if ($resp = $this->ensureRecordAffiliationAccess($databaseMember, $authUser instanceof User ? $authUser : null)) {
            return $resp;
        }

        $validated = $request->validate([
            'affiliation_id' => 'sometimes|nullable|integer|exists:affiliations,id',
            'member_code' => 'sometimes|required|string|max:255',
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|nullable|string|max:255',
            'photo' => 'nullable|string|max:1000',
            'contact' => 'nullable|string|max:255',
            'entry_date' => 'nullable|date',
            'gender' => ['nullable', 'string', Rule::in(['male', 'female'])],
            'specialization' => ['nullable', 'string', Rule::in(self::SPECIALIZATION_OPTIONS)],
            'status' => ['sometimes', 'string', Rule::in(['active', 'graduated', 'leave'])],
            'specialty' => 'nullable|string|max:255',
            'group' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'regency_id' => 'nullable|integer|exists:regencies,id',
        ]);

        $validated['organization_type'] = $orgType;

        $resolved = $this->resolveAffiliationIdForWrite($validated, $authUser instanceof User ? $authUser : null, false);
        if (isset($resolved['__error'])) {
            return response()->json([
                'status' => $resolved['__error']['status'],
                'message' => $resolved['__error']['message'],
            ], $resolved['__error']['code']);
        }

        unset($resolved['organization_type']);

        if (array_key_exists('position', $resolved) && $resolved['position'] === null) {
            $resolved['position'] = '';
        }

        if (array_key_exists('member_code', $resolved) || array_key_exists('affiliation_id', $resolved)) {
            $targetMemberCode = $resolved['member_code'] ?? $databaseMember->member_code;
            $targetAffiliationId = $resolved['affiliation_id'] ?? $databaseMember->affiliation_id;

            $dupExists = DatabaseMember::query()
                ->where('organization_type', $orgType)
                ->where('affiliation_id', $targetAffiliationId)
                ->where('member_code', $targetMemberCode)
                ->where('id', '!=', $databaseMember->id)
                ->exists();

            if ($dupExists) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Nomor Identitas sudah digunakan.',
                ], 422);
            }
        }

        $databaseMember->update($resolved);

        return response()->json([
            'status' => 'success',
            'message' => 'Database member updated successfully',
            'data' => $databaseMember->fresh(),
        ]);
    }

    public function destroy(DatabaseMember $databaseMember): JsonResponse
    {
        $orgType = $databaseMember->organization_type;

        if ($resp = $this->ensurePermission($orgType, 'delete')) {
            return $resp;
        }

        $authUser = Auth::user();

        if ($resp = $this->ensureRecordAffiliationAccess($databaseMember, $authUser instanceof User ? $authUser : null)) {
            return $resp;
        }

        $databaseMember->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Database member deleted successfully',
        ]);
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'image' => 'required|file|image|max:5120',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'create')) {
            return $resp;
        }

        $path = $request->file('image')->store('database-members', 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'status' => 'success',
            'message' => 'Photo uploaded successfully',
            'data' => [
                'path' => $path,
                'url' => $url,
            ],
        ]);
    }

    public function uploadPhotoForMember(Request $request, DatabaseMember $databaseMember): JsonResponse
    {
        $request->validate([
            'image' => 'required|file|image|max:5120',
        ]);

        $orgType = $databaseMember->organization_type;

        if ($resp = $this->ensurePermission($orgType, 'edit')) {
            return $resp;
        }

        $authUser = Auth::user();

        if ($resp = $this->ensureRecordAffiliationAccess($databaseMember, $authUser instanceof User ? $authUser : null)) {
            return $resp;
        }

        $path = $request->file('image')->store('database-members', 'public');
        $url = asset('storage/' . $path);

        $databaseMember->update([
            'photo' => $url,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Photo uploaded successfully',
            'data' => [
                'path' => $path,
                'url' => $url,
                'member' => $databaseMember->fresh(),
            ],
        ]);
    }

    private function normalizeHeader(string $header): string
    {
        $h = trim(mb_strtolower($header));
        $h = preg_replace('/[^a-z0-9]+/i', '_', $h) ?? $h;
        $h = trim($h, '_');
        return $h;
    }

    private function mapHeaderToDbColumn(string $header): ?string
    {
        $normalized = $this->normalizeHeader($header);
        if ($normalized === '') {
            return null;
        }

        $aliases = [
            // identifiers
            'kode_anggota' => 'member_code',
            'kode' => 'member_code',
            'kode_member' => 'member_code',
            'kode_member_code' => 'member_code',
            'membercode' => 'member_code',
            'member_code' => 'member_code',
            'nomor_identitas' => 'member_code',
            'no_identitas' => 'member_code',
            'nomorid' => 'member_code',
            'nik' => 'member_code',

            // core fields
            'nama' => 'name',
            'name' => 'name',
            'jabatan' => 'position',
            'posisi' => 'position',
            'position' => 'position',

            // misc
            'foto' => 'photo',
            'photo' => 'photo',
            'kontak' => 'contact',
            'contact' => 'contact',
            'tanggal_masuk' => 'entry_date',
            'tgl_masuk' => 'entry_date',
            'entry_date' => 'entry_date',
            'gender' => 'gender',
            'jenis_kelamin' => 'gender',
            'spesialisasi' => 'specialization',
            'specialization' => 'specialization',
            'status' => 'status',
            'spesialti' => 'specialty',
            'subspesialis' => 'specialty',
            'specialty' => 'specialty',
            'komisi' => 'group',
            'divisi' => 'group',
            'komisi_divisi' => 'group',
            'group' => 'group',
            'gelar' => 'title',
            'title' => 'title',
            'lokasi' => 'location',
            'location' => 'location',
            'kabupaten' => 'kabupaten_kota',
            'kabupaten_kota' => 'kabupaten_kota',
            'kota' => 'kabupaten_kota',
            'district' => 'kabupaten_kota',
            'regency' => 'kabupaten_kota',
        ];

        return $aliases[$normalized] ?? $normalized;
    }

    private function normalizeEnumValue(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $v = trim(mb_strtolower($value));
        if ($v === '') {
            return null;
        }

        $v = str_replace([' ', '-', '.'], '_', $v);
        $v = preg_replace('/_+/', '_', $v) ?? $v;
        $v = trim($v, '_');

        return $v;
    }

    private function parseExcelDate(mixed $raw): ?string
    {
        if ($raw === null) {
            return null;
        }

        if (is_numeric($raw)) {
            try {
                return ExcelDate::excelToDateTimeObject((float) $raw)->format('Y-m-d');
            } catch (\Throwable $e) {
                return null;
            }
        }

        $s = trim((string) $raw);
        if ($s === '') {
            return null;
        }

        $ts = strtotime($s);
        if ($ts === false) {
            return null;
        }

        return date('Y-m-d', $ts);
    }

    private function resolveImageUrlForExport(?string $raw): string
    {
        if ($raw === null) {
            return '';
        }

        $s = trim((string) $raw);
        if ($s === '') {
            return '';
        }

        if (str_starts_with($s, 'http://') || str_starts_with($s, 'https://') || str_starts_with($s, 'data:') || str_starts_with($s, '//')) {
            return $s;
        }

        if (str_starts_with($s, '/')) {
            return asset(ltrim($s, '/'));
        }

        if (str_starts_with($s, 'public/')) {
            $s = ltrim(preg_replace('/^public\//', '', $s) ?? $s, '/');
            return asset($s);
        }

        if (str_starts_with($s, 'storage/')) {
            return asset($s);
        }

        if (str_starts_with($s, 'assets/')) {
            return asset($s);
        }

        return asset($s);
    }

    private function formatGenderLabel(?string $gender): string
    {
        $g = trim((string) $gender);
        return match ($g) {
            'male' => 'Laki-laki',
            'female' => 'Perempuan',
            default => '',
        };
    }

    private function formatStatusLabel(?string $status): string
    {
        $s = trim((string) $status);
        return match ($s) {
            'active' => 'Aktif',
            'graduated' => 'Lulus',
            'leave' => 'Cuti',
            default => $s,
        };
    }

    private function calculateSemester(?string $entryDate): string
    {
        if ($entryDate === null || $entryDate === '') {
            return '-';
        }

        $ts = strtotime($entryDate);
        if ($ts === false) {
            return '-';
        }

        $entryYear = (int) date('Y', $ts);
        $entryMonth = (int) date('n', $ts);
        $nowYear = (int) date('Y');
        $nowMonth = (int) date('n');

        $entryIdx = $entryYear * 2 + ($entryMonth >= 7 ? 1 : 0);
        $nowIdx = $nowYear * 2 + ($nowMonth >= 7 ? 1 : 0);
        $sem = $nowIdx - $entryIdx + 1;

        return $sem > 0 ? (string) $sem : '-';
    }

    private function buildDisplayNameForExport(DatabaseMember $member): string
    {
        $baseName = trim((string) ($member->name ?? ''));
        $title = trim((string) ($member->title ?? ''));

        if ($baseName === '') {
            return $title;
        }

        if ($title === '') {
            return $baseName;
        }

        return $baseName . ' ' . $title;
    }

    public function templateExcel(Request $request)
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'import')) {
            return $resp;
        }

        $authUser = Auth::user();

        $isPeerGroup = $orgType === 'peer_group';
        $isResident = $orgType === 'resident';

        if ($isPeerGroup) {
            $allowedColumns = ['member_code', 'name', 'photo', 'gender', 'status'];
        } elseif ($isResident) {
            $allowedColumns = ['member_code', 'name', 'photo', 'gender', 'status', 'entry_date', 'kabupaten_kota'];
        } else {
            $allowedColumns = ['member_code', 'name', 'photo', 'gender', 'status', 'entry_date', 'specialization'];
        }

        $headerLabels = [
            'member_code' => 'NIK',
            'name' => 'Nama',
            'photo' => 'Foto',
            'gender' => 'Jenis Kelamin',
            'status' => 'Status',
            'entry_date' => 'Tanggal Masuk',
            'specialization' => 'Spesialisasi',
            'kabupaten_kota' => 'Kabupaten/Kota',
        ];

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($allowedColumns as $i => $col) {
            $cell = Coordinate::stringFromColumnIndex($i + 1) . '1';
            $sheet->setCellValue($cell, $headerLabels[$col] ?? $col);
        }

        $writer = new Xlsx($spreadsheet);

        $affiliationName = '';
        if (isset($validated['affiliation_id']) && $validated['affiliation_id'] !== null) {
            $aff = Affiliation::query()->find($validated['affiliation_id']);
            if ($aff instanceof Affiliation) {
                $affiliationName = (string) ($aff->name ?? '');
            }
        } else {
            if ($authUser instanceof User && !$authUser->hasRole('super_admin')) {
                $userAffiliationIds = $authUser->affiliations()->pluck('affiliations.id')->toArray();
                if (count($userAffiliationIds) === 1) {
                    $aff = Affiliation::query()->find($userAffiliationIds[0]);
                    if ($aff instanceof Affiliation) {
                        $affiliationName = (string) ($aff->name ?? '');
                    }
                } elseif (count($userAffiliationIds) > 1) {
                    $affiliationName = 'all-affiliations';
                }
            }
        }

        $affiliationName = trim($affiliationName);
        if ($affiliationName === '') {
            $affiliationName = 'database-members';
        }

        $safeAffiliationName = mb_strtolower($affiliationName);
        $safeAffiliationName = preg_replace('/[^a-z0-9]+/i', '_', $safeAffiliationName) ?? $safeAffiliationName;
        $safeAffiliationName = trim($safeAffiliationName, '_');

        $exportDate = now()->format('dmY');
        $filename = 'template-' . $safeAffiliationName . '-' . $exportDate . '.xlsx';

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function importExcel(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_type' => ['required', 'string', Rule::in(self::ORG_TYPES)],
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $orgType = $validated['organization_type'];

        if ($resp = $this->ensurePermission($orgType, 'import')) {
            return $resp;
        }

        $authUser = Auth::user();

        $isPeerGroup = $orgType === 'peer_group';
        $isResident = $orgType === 'resident';

        $resolvedAff = $this->resolveAffiliationIdForWrite(
            [
                'affiliation_id' => $validated['affiliation_id'] ?? null,
            ],
            $authUser instanceof User ? $authUser : null,
            true
        );

        if (isset($resolvedAff['__error'])) {
            return response()->json([
                'status' => $resolvedAff['__error']['status'],
                'message' => $resolvedAff['__error']['message'],
            ], $resolvedAff['__error']['code']);
        }

        $affiliationId = $resolvedAff['affiliation_id'] ?? null;

        if ($affiliationId === null && $authUser instanceof User && !$authUser->hasRole('super_admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Affiliation is required.',
            ], 422);
        }

        $allowedColumns = [
            'member_code',
            'name',
            'position',
            'photo',
            'contact',
            'entry_date',
            'gender',
            'specialization',
            'status',
            'specialty',
            'group',
            'title',
            'location',
            'kabupaten_kota',
        ];

        $requiredColumns = [
            'member_code',
            'name',
        ];

        $errors = [];

        $filePath = $request->file('file')->getRealPath();
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        if (!is_array($rows) || count($rows) < 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'Excel file is empty.',
            ], 422);
        }

        $headerRow = $rows[1] ?? [];
        $colMap = [];

        foreach ($headerRow as $colLetter => $headerVal) {
            if ($headerVal === null) {
                continue;
            }

            $dbCol = $this->mapHeaderToDbColumn((string) $headerVal);
            if ($dbCol === null) {
                continue;
            }

            if (in_array($dbCol, $allowedColumns, true)) {
                $colMap[$dbCol] = $colLetter;
            }
        }

        foreach ($requiredColumns as $col) {
            if (!array_key_exists($col, $colMap)) {
                $errors[] = [
                    'row' => 1,
                    'column' => $col,
                    'message' => "Missing required column: {$col}",
                ];
            }
        }

        if (!empty($errors)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid excel header.',
                'errors' => $errors,
            ], 422);
        }

        $now = now();
        $rowsToPersist = [];
        $seenCompositeKeys = [];

        $normalizedSpecializations = [];
        foreach (self::SPECIALIZATION_OPTIONS as $opt) {
            $normalized = preg_replace('/\s+/', ' ', trim((string) $opt)) ?? trim((string) $opt);
            $normalizedSpecializations[$normalized] = $opt;
        }

        foreach ($rows as $idx => $row) {
            if ($idx === 1) {
                continue;
            }

            $excelRowNumber = $idx;

            $payload = [
                'organization_type' => $orgType,
                'affiliation_id' => $affiliationId,
                'status' => 'active',
            ];

            foreach ($allowedColumns as $dbCol) {
                if (!array_key_exists($dbCol, $colMap)) {
                    continue;
                }

                $cellVal = $row[$colMap[$dbCol]] ?? null;

                if ($dbCol === 'entry_date') {
                    $payload[$dbCol] = $this->parseExcelDate($cellVal);
                    continue;
                }

                $payload[$dbCol] = $cellVal === null ? null : trim((string) $cellVal);
                if ($payload[$dbCol] === '') {
                    $payload[$dbCol] = null;
                }
            }

            if (isset($payload['specialization']) && $payload['specialization'] !== null) {
                $normalized = preg_replace('/\s+/', ' ', trim((string) $payload['specialization'])) ?? trim((string) $payload['specialization']);
                $payload['specialization'] = $normalizedSpecializations[$normalized] ?? $payload['specialization'];
            }

            if (isset($payload['gender']) && $payload['gender'] !== null) {
                $gv = $this->normalizeEnumValue($payload['gender']);
                $genderMap = [
                    'male' => 'male',
                    'm' => 'male',
                    'laki_laki' => 'male',
                    'laki' => 'male',
                    'pria' => 'male',
                    'lelaki' => 'male',
                    'lk' => 'male',
                    'female' => 'female',
                    'f' => 'female',
                    'perempuan' => 'female',
                    'wanita' => 'female',
                    'p' => 'female',
                ];

                $payload['gender'] = $genderMap[$gv] ?? $payload['gender'];
            }

            if (isset($payload['status']) && $payload['status'] !== null) {
                $sv = $this->normalizeEnumValue($payload['status']);
                $statusMap = [
                    'active' => 'active',
                    'aktif' => 'active',
                    'graduated' => 'graduated',
                    'lulus' => 'graduated',
                    'graduate' => 'graduated',
                    'leave' => 'leave',
                    'cuti' => 'leave',
                ];

                $payload['status'] = $statusMap[$sv] ?? $payload['status'];
            }

            // Enforce org-type-specific fields (match manual form)
            if ($isPeerGroup) {
                // Peer group form: only member_code, name, photo, gender, status
                unset($payload['entry_date']);
                unset($payload['specialization']);
                unset($payload['kabupaten_kota']);
            } elseif ($isResident) {
                // Resident form: member_code, name, photo, gender, status, entry_date, regency (when graduated)
                unset($payload['specialization']);
            } else {
                // Fellow/Trainee form: member_code, name, photo, gender, status, entry_date, specialization
                unset($payload['kabupaten_kota']);
            }

            $regencyName = isset($payload['kabupaten_kota']) ? trim((string) ($payload['kabupaten_kota'] ?? '')) : '';
            unset($payload['kabupaten_kota']);

            if ($orgType === 'resident' && ($payload['status'] ?? '') === 'graduated' && $regencyName !== '') {
                $regency = Regency::query()
                    ->whereRaw('LOWER(name) = ?', [mb_strtolower($regencyName)])
                    ->first();
                if ($regency) {
                    $payload['regency_id'] = $regency->id;
                } else {
                    $errors[] = [
                        'row' => $excelRowNumber,
                        'column' => 'kabupaten_kota',
                        'message' => "Kabupaten/Kota '{$regencyName}' tidak ditemukan di database.",
                    ];
                    continue;
                }
            } elseif ($orgType === 'resident' && ($payload['status'] ?? '') !== 'graduated') {
                $payload['regency_id'] = null;
            }

            if ($payload['member_code'] === null) {
                $errors[] = [
                    'row' => $excelRowNumber,
                    'column' => 'member_code',
                    'message' => 'member_code is required.',
                ];
                continue;
            }

            $normalizedMemberCodeKey = mb_strtolower(trim((string) $payload['member_code']));
            $normalizedNameKey = mb_strtolower(trim((string) ($payload['name'] ?? '')));
            $compositeKey = $normalizedMemberCodeKey . '|' . $normalizedNameKey . '|' . (string) ($payload['affiliation_id'] ?? '');
            if ($normalizedMemberCodeKey !== '' && $normalizedNameKey !== '') {
                if (array_key_exists($compositeKey, $seenCompositeKeys)) {
                    $errors[] = [
                        'row' => $excelRowNumber,
                        'column' => 'member_code',
                        'message' => 'Duplicate record in excel file.',
                    ];
                    continue;
                }
                $seenCompositeKeys[$compositeKey] = true;
            }

            if ($payload['name'] === null) {
                $errors[] = [
                    'row' => $excelRowNumber,
                    'column' => 'name',
                    'message' => 'name is required.',
                ];
                continue;
            }

            if (!$isPeerGroup && !$isResident && isset($payload['specialization']) && $payload['specialization'] !== null) {
                $normalized = preg_replace('/\s+/', ' ', trim((string) $payload['specialization'])) ?? trim((string) $payload['specialization']);
                if (!array_key_exists($normalized, $normalizedSpecializations)) {
                    $errors[] = [
                        'row' => $excelRowNumber,
                        'column' => 'specialization',
                        'message' => 'specialization is invalid.',
                    ];
                    continue;
                }
            }

            if (isset($payload['gender']) && $payload['gender'] !== null) {
                if (!in_array($payload['gender'], ['male', 'female'], true)) {
                    $errors[] = [
                        'row' => $excelRowNumber,
                        'column' => 'gender',
                        'message' => 'gender must be male or female.',
                    ];
                    continue;
                }
            }

            if (isset($payload['status']) && $payload['status'] !== null) {
                if (!in_array($payload['status'], ['active', 'graduated', 'leave'], true)) {
                    $errors[] = [
                        'row' => $excelRowNumber,
                        'column' => 'status',
                        'message' => 'status must be active, graduated, or leave.',
                    ];
                    continue;
                }
            }

            $payload['created_at'] = $now;
            $payload['updated_at'] = $now;
            $payload['deleted_at'] = null;

            $payload['position'] = $payload['position'] ?? '';
            if ($payload['position'] === null) {
                $payload['position'] = '';
            }

            $rowsToPersist[] = $payload;
        }

        if (!empty($errors) && empty($rowsToPersist)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Semua baris gagal divalidasi.',
                'errors' => $errors,
                'data' => [
                    'processed' => 0,
                    'failed' => count($errors),
                ],
            ], 422);
        }

        try {
            DB::beginTransaction();

            $processed = 0;
            foreach ($rowsToPersist as $payload) {
                $existing = DatabaseMember::query()
                    ->where('organization_type', $payload['organization_type'])
                    ->where('affiliation_id', $payload['affiliation_id'])
                    ->where('member_code', $payload['member_code'])
                    ->where('name', $payload['name'])
                    ->first();

                $updateData = $payload;
                unset($updateData['organization_type']);
                unset($updateData['affiliation_id']);
                unset($updateData['member_code']);
                unset($updateData['created_at']);

                if ($existing) {
                    $existing->update($updateData);
                } else {
                    DatabaseMember::create($payload);
                }

                $processed++;
            }

            DB::commit();

            $response = [
                'status' => 'success',
                'message' => empty($errors)
                    ? "Import berhasil. {$processed} data berhasil diproses."
                    : "Import selesai. {$processed} data berhasil, " . count($errors) . " data gagal.",
                'data' => [
                    'processed' => $processed,
                    'failed' => count($errors),
                ],
            ];

            if (!empty($errors)) {
                $response['errors'] = $errors;
            }

            return response()->json($response);
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search_type' => ['required', 'string', 'in:member_code,nama,contact'],
            'search_value' => 'required|string|max:255',
            'affiliation_id' => 'nullable|integer|exists:affiliations,id',
        ]);

        $searchType = $validated['search_type'];
        $searchValue = $validated['search_value'];
        $affiliationId = $validated['affiliation_id'] ?? null;

        \Log::info('Member Search Debug', [
            'search_type' => $searchType,
            'search_value' => $searchValue,
            'affiliation_id' => $affiliationId,
        ]);

        $query = DatabaseMember::query();

        // Filter by affiliation if provided
        if ($affiliationId) {
            $query->where('affiliation_id', $affiliationId);
        }

        // Search by type
        if ($searchType === 'member_code') {
            $query->where('member_code', $searchValue);
        } elseif ($searchType === 'nama') {
            $query->where('name', 'like', "%{$searchValue}%");
        } elseif ($searchType === 'contact') {
            $query->where('contact', 'like', "%{$searchValue}%");
        }

        \Log::info('Member Search Query', [
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings(),
        ]);

        $member = $query->select(['id', 'member_code', 'name', 'contact', 'affiliation_id'])->first();

        \Log::info('Member Search Result', [
            'found' => $member ? true : false,
            'member' => $member ? $member->toArray() : null,
        ]);

        if ($member) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'id' => $member->id,
                    'member_code' => $member->member_code,
                    'name' => $member->name,
                    'contact' => $member->contact,
                    'affiliation_id' => $member->affiliation_id,
                ],
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Member not found',
            'data' => null,
            'debug' => [
                'search_type' => $searchType,
                'search_value' => $searchValue,
                'affiliation_id' => $affiliationId,
            ],
        ], 404);
    }
}
