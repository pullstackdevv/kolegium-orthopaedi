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
        Schema::create('teacher_staff_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('photo', 1000)->nullable();
            $table->foreignId('teacher_staff_division_id')->constrained('teacher_staff_divisions')->onDelete('cascade');
            $table->foreignId('affiliation_id')->constrained('affiliations')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_staff_members');
    }
};
