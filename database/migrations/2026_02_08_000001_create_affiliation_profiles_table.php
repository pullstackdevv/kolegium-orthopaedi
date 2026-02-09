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
        Schema::create('affiliation_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliation_id')->constrained('affiliations')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('accreditation')->nullable();
            $table->string('established_year')->nullable();
            $table->string('program_duration')->nullable();
            $table->string('capacity')->nullable();
            $table->text('contact_address')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_website')->nullable();
            $table->text('registration_info')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique('affiliation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliation_profiles');
    }
};
