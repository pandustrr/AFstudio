<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'pricelist_package_id',
        'quantity',
        'price',
        'subtotal',
        'scheduled_date',
        'start_time',
        'end_time',
        'room_id',
        'photographer_id',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function photographer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'photographer_id');
    }

    public function sessions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PhotographerSession::class, 'booking_item_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(PricelistPackage::class, 'pricelist_package_id');
    }
}
