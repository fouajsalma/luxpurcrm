<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PipelineStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'pipeline_id',
        'name',
        'position',
    ];

   
    // Relationships
    public function pipeline()
    {
        return $this->belongsTo(Pipeline::class);
    }

    public function pipelineLeads()
    {
        return $this->hasMany(PipelineLead::class, 'stage_id');
    }

    public function leads()
    {
        return $this->belongsToMany(Lead::class, 'pipeline_leads');
    }
}
