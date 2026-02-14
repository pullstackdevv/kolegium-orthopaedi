<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wellbeing_surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('affiliation_id')->constrained()->onDelete('cascade');
            $table->string('survey_type')->default('wellbeing');
            $table->string('participant_type')->nullable();
            $table->string('affiliation_code')->nullable();
            $table->string('university')->nullable();
            $table->string('faculty')->nullable();
            $table->string('study_program_name')->nullable();
            $table->string('program_type')->nullable();
            
            $table->string('mood')->nullable();
            $table->boolean('burnout')->default(false);
            $table->boolean('emotional_hardening')->default(false);
            $table->boolean('depressed')->default(false);
            $table->boolean('sleep_issue')->default(false);
            $table->boolean('bullying')->default(false);
            
            $table->boolean('discomfort')->default(false);
            $table->longText('discomfort_note')->nullable();
            
            $table->integer('mental_health_score')->nullable();
            $table->string('risk_level')->nullable();
            
            $table->json('crisis_resources')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wellbeing_surveys');
    }
};
