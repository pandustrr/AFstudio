<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhotographerSession extends Model
{
    protected $fillable = [
        'photographer_id',
        'cart_uid',
        'date',
        'start_time',
        'status',
        'booking_item_id',
        'offset_minutes',
        'offset_description',
        'block_identifier',
    ];

    public function photographer()
    {
        return $this->belongsTo(User::class, 'photographer_id');
    }

    public function bookingItem()
    {
        return $this->belongsTo(BookingItem::class);
    }
}
