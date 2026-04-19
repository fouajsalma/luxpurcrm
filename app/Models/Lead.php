<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'contact_name',
        'contact_email',
        'contact_phone',
        'priority',
        'status',
        'category_id',
        'source_id',
         'assigned_to',
    ];

    protected $casts = [
        'priority' => 'string',
        'status' => 'string',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function source()
    {
        return $this->belongsTo(LeadSource::class, 'source_id');
    }

    public function activities()
    {
        return $this->hasMany(LeadActivity::class);
    }

    public function pipelineLeads()
    {
        return $this->hasMany(PipelineLead::class);
    }

    public function pipelineHistories()
    {
        return $this->hasMany(PipelineHistory::class);
    }

     public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function currentStage()
    {
        return $this->hasOneThrough(PipelineStage::class, PipelineLead::class, 'lead_id', 'id', 'id', 'stage_id');
    }
}
