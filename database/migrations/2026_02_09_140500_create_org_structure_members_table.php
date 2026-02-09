<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('org_structure_members', function (Blueprint $table) {
            $table->id();
            $table->string('organization_type'); // resident, fellow, trainee, peer_group, koti, kolkes
            $table->foreignId('affiliation_id')->nullable()->constrained('affiliations')->nullOnDelete();
            $table->string('name'); // nama lengkap beserta gelar
            $table->string('position')->nullable(); // keterangan jabatan
            $table->string('email')->nullable();
            $table->string('photo')->nullable();
            $table->integer('position_order')->default(0); // urutan tampil
            $table->timestamps();
            $table->softDeletes();

            $table->index(['organization_type', 'affiliation_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('org_structure_members');
    }
};
