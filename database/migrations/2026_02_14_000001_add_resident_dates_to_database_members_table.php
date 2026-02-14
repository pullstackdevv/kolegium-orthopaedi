<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('database_members', function (Blueprint $table) {
            $table->date('graduated_at')->nullable()->after('entry_date');
            $table->date('leave_at')->nullable()->after('graduated_at');
            $table->date('active_again_at')->nullable()->after('leave_at');
        });
    }

    public function down(): void
    {
        Schema::table('database_members', function (Blueprint $table) {
            $table->dropColumn(['graduated_at', 'leave_at', 'active_again_at']);
        });
    }
};
