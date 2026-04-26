<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'contact_name',
        'contact_email',
        'contact_phone',
        'category_id',
        'status',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function classifications()
    {
        return $this->belongsToMany(Classification::class, 'client_classification');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'client_products')->withPivot(['start_date', 'end_date']);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
