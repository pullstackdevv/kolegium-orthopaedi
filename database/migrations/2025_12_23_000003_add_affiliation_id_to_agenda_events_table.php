<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('agenda_events', function (Blueprint $table) {
            $table->foreignId('affiliation_id')->nullable()->after('created_by')->constrained('affiliations')->nullOnDelete();
            $table->index('affiliation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agenda_events', function (Blueprint $table) {
            $table->dropForeign(['affiliation_id']);
            $table->dropIndex(['affiliation_id']);
            $table->dropColumn('affiliation_id');
        });
    }
};
