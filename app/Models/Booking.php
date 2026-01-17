<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($booking) {
            // "Nama Cust + Angka"
            // Sanitize name: remove spaces/symbols, convert to uppercase
            $namePart = strtoupper(Str::slug($booking->name ?? 'CUSTOMER', ''));
            
            // Generate code: NAME123
            // Using 3 digits as requested "angka" (usually implies simpler number than hash)
            // Adding loop for uniqueness to be safe
            $code = $namePart . rand(100, 999);
            
            while (self::where('booking_code', $code)->exists()) {
                $code = $namePart . rand(100, 999);
            }

            $booking->booking_code = $code;
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }
}
