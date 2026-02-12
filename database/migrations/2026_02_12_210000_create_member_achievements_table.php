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
        Schema::create('member_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('database_member_id')->constrained('database_members')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('date')->nullable();
            $table->string('category')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('database_member_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_achievements');
    }
};
