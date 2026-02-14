<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wellbeing_surveys', function (Blueprint $table) {
            $table->unsignedBigInteger('member_id')->nullable()->after('affiliation_id');
            $table->string('member_code')->nullable()->after('member_id');
            $table->string('member_name')->nullable()->after('member_code');
            $table->string('member_contact')->nullable()->after('member_name');
            $table->string('survey_period')->nullable()->after('survey_type');
            $table->string('affirmation_message')->nullable()->after('risk_level');
            $table->integer('star_rating')->nullable()->after('affirmation_message');
        });
    }

    public function down(): void
    {
        Schema::table('wellbeing_surveys', function (Blueprint $table) {
            $table->dropColumn([
                'member_id',
                'member_code',
                'member_name',
                'member_contact',
                'survey_period',
                'affirmation_message',
                'star_rating',
            ]);
        });
    }
};
