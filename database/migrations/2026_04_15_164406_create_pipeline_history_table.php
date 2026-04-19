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
      Schema::create('pipeline_history', function (Blueprint $table) {
    $table->id();
    $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
    $table->foreignId('from_stage_id')->nullable()->constrained('pipeline_stages');
    $table->foreignId('to_stage_id')->nullable()->constrained('pipeline_stages');
    $table->timestamp('changed_at')->nullable();
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pipeline_history');
    }
};
