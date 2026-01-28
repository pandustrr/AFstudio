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

    protected $appends = ['adjusted_start_time', 'adjusted_end_time'];

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

    // --- Cascading Offset Logic ---
    protected static $daySessionCache = [];

    public function getAdjustedStartTimeAttribute()
    {
        return $this->getAdjustedTimes()['start'];
    }

    public function getAdjustedEndTimeAttribute()
    {
        return $this->getAdjustedTimes()['end'];
    }

    protected function getAdjustedTimes()
    {
        if (!$this->photographer_id || !$this->scheduled_date) {
            return ['start' => $this->start_time, 'end' => $this->end_time];
        }

        $cacheKey = $this->photographer_id . '_' . $this->scheduled_date;

        if (!isset(static::$daySessionCache[$cacheKey])) {
            $sessions = \App\Models\PhotographerSession::where('photographer_id', $this->photographer_id)
                ->where('date', $this->scheduled_date)
                ->orderBy('start_time', 'asc')
                ->get();

            $cumulative = 0;
            $matrix = [];

            foreach ($sessions as $s) {
                if ($s->status === 'booked') {
                    $cumulative += ($s->offset_minutes ?? 0);
                } else {
                    $cumulative = 0; // Reset on open/off
                }
                $matrix[$s->start_time] = $cumulative;
            }
            static::$daySessionCache[$cacheKey] = $matrix;
        }

        $offsetMins = static::$daySessionCache[$cacheKey][$this->start_time] ?? 0;

        if ($offsetMins === 0) {
            return ['start' => $this->start_time, 'end' => $this->end_time];
        }

        $start = \Carbon\Carbon::createFromTimeString($this->start_time)->addMinutes($offsetMins);
        $end = \Carbon\Carbon::createFromTimeString($this->end_time)->addMinutes($offsetMins);

        return [
            'start' => $start->format('H:i:s'),
            'end' => $end->format('H:i:s')
        ];
    }
}
