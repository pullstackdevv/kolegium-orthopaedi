<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $dropIndexCandidates = [
            'database_members_unique_key',
            'database_members_organization_type_affiliation_id_member_code_name_unique',
        ];

        foreach ($dropIndexCandidates as $indexName) {
            try {
                DB::statement("ALTER TABLE `database_members` DROP INDEX `{$indexName}`");
            } catch (\Throwable $e) {
            }
        }

        if (Schema::hasColumn('database_members', 'deleted_at_key')) {
            DB::statement('ALTER TABLE `database_members` DROP COLUMN `deleted_at_key`');
        }

        if (!Schema::hasColumn('database_members', 'deleted_scope')) {
            DB::statement("ALTER TABLE `database_members` ADD COLUMN `deleted_scope` varchar(32) GENERATED ALWAYS AS (IF(`deleted_at` IS NULL, '0', CAST(`deleted_at` AS CHAR))) STORED");
        }

        Schema::table('database_members', function (Blueprint $table) {
            $table->unique(['organization_type', 'affiliation_id', 'member_code', 'deleted_scope'], 'database_members_unique_member_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $dropIndexCandidates = [
            'database_members_unique_member_code',
            'database_members_organization_type_affiliation_id_member_code_deleted_scope_unique',
        ];

        foreach ($dropIndexCandidates as $indexName) {
            try {
                DB::statement("ALTER TABLE `database_members` DROP INDEX `{$indexName}`");
            } catch (\Throwable $e) {
            }
        }

        if (Schema::hasColumn('database_members', 'deleted_scope')) {
            DB::statement('ALTER TABLE `database_members` DROP COLUMN `deleted_scope`');
        }

        Schema::table('database_members', function (Blueprint $table) {
            $table->unique(['organization_type', 'affiliation_id', 'member_code', 'name'], 'database_members_unique_key');
        });
    }
};
