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
        Schema::create('database_members', function (Blueprint $table) {
            $table->id();

            $table->string('organization_type');

            $table->foreignId('affiliation_id')->nullable()->constrained('affiliations')->nullOnDelete();

            $table->string('member_code');
            $table->string('name');
            $table->string('position');

            $table->string('photo')->nullable();
            $table->string('contact')->nullable();
            $table->date('entry_date')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('specialization')->nullable();
            $table->enum('status', ['active', 'graduated', 'leave'])->default('active');
            $table->string('specialty')->nullable();
            $table->string('group')->nullable();
            $table->string('title')->nullable();
            $table->string('location')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_type', 'affiliation_id', 'member_code', 'name'], 'database_members_unique_key');
            $table->index(['organization_type', 'affiliation_id']);
            $table->index('affiliation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('database_members');
    }
};
