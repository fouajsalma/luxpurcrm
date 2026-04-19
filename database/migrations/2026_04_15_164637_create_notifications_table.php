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
    { Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // user
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // content
            $table->string('title')->nullable();
            $table->text('message');

            // business type
            $table->string('type'); 
            // task_assigned, new_lead...

            // polymorphic relation
            $table->string('related_type')->nullable();
            $table->unsignedBigInteger('related_id')->nullable();

            // extra data (🔥 قوية)
            $table->json('data')->nullable();

            // read tracking (PRO)
            $table->timestamp('read_at')->nullable();

            $table->timestamps();

            // performance
            $table->index(['user_id', 'read_at']);
            $table->index(['related_type', 'related_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
