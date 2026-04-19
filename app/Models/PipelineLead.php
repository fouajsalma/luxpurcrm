<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PipelineLead extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'stage_id',
        'moved_at',
    ];

    protected $casts = [
        'moved_at' => 'datetime',
    ];

    // Relationships
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function stage()
    {
        return $this->belongsTo(PipelineStage::class, 'stage_id');
    }
}
