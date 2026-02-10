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
        Schema::table('database_members', function (Blueprint $table) {
            $table->dropColumn('district');
            $table->unsignedBigInteger('regency_id')->nullable()->after('location');
            $table->foreign('regency_id')->references('id')->on('regencies')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('database_members', function (Blueprint $table) {
            $table->dropForeign(['regency_id']);
            $table->dropColumn('regency_id');
            $table->string('district')->nullable()->after('location');
        });
    }
};
