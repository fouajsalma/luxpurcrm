<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Relationships
    public function clients()
    {
        return $this->belongsToMany(Client::class, 'client_products')->withPivot(['start_date', 'end_date']);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
