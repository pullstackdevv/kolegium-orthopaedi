<?php

namespace App\Enums;

enum AffiliationType: string
{
    case KOLEGIUM = 'kolegium';
    case RESIDEN = 'residen';
    case CLINICAL_FELLOWSHIP = 'clinical_fellowship';
    case SUBSPESIALIS = 'subspesialis';
    case PEER_GROUP = 'peer_group';

    public function label(): string
    {
        return match($this) {
            self::KOLEGIUM => 'Kolegium',
            self::RESIDEN => 'Residen',
            self::CLINICAL_FELLOWSHIP => 'Clinical Fellowship',
            self::SUBSPESIALIS => 'Subspesialis',
            self::PEER_GROUP => 'Peer Group',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label()
        ], self::cases());
    }
}
