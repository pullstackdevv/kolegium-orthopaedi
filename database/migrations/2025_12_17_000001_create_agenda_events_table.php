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
        Schema::create('agenda_events', function (Blueprint $table) {
            $table->id();

            $table->string('scope');
            $table->string('type');
            $table->string('title');
            $table->text('description')->nullable();

            $table->string('location')->nullable();
            $table->string('registration_url')->nullable();
            $table->string('image_url')->nullable();

            $table->date('start_date');
            $table->date('end_date')->nullable();

            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['scope', 'start_date']);
            $table->index(['is_published', 'start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agenda_events');
    }
};
