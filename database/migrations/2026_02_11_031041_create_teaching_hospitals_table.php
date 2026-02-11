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
        Schema::create('teaching_hospitals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliation_id')->constrained('affiliations')->onDelete('cascade');
            $table->string('category'); // main, satellite, international
            $table->string('name');
            $table->string('location')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teaching_hospitals');
    }
};
