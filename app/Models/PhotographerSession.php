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
        'override_start_time',
        'override_end_time',
        'is_customized',
    ];
 
    protected $casts = [
        'is_customized' => 'boolean',
    ];

    protected $appends = [
        'adjusted_start_time',
        'adjusted_end_time'
    ];

    public function photographer()
    {
        return $this->belongsTo(User::class, 'photographer_id');
    }

    public function bookingItem()
    {
        return $this->belongsTo(BookingItem::class);
    }

    // --- Cascading Offset Logic ---
    protected static $daySessionCache = [];
 
    public function getAdjustedStartTimeAttribute()
    {
        if (!$this->start_time || !$this->photographer_id) return $this->start_time;
 
        if ($this->is_customized && $this->override_start_time) {
            return \Carbon\Carbon::parse($this->override_start_time)->format('H:i:s');
        }
 
        $matrix = $this->getOffsetMatrix();
        $offsetMinutes = $matrix[$this->start_time] ?? 0;
        
        return \Carbon\Carbon::parse($this->start_time)->addMinutes($offsetMinutes)->format('H:i:s');
    }
 
    public function getAdjustedEndTimeAttribute()
    {
        if ($this->is_customized && $this->override_end_time) {
            return \Carbon\Carbon::parse($this->override_end_time)->format('H:i:s');
        }
 
        $matrix = $this->getOffsetMatrix();
        $offsetMinutes = $matrix[$this->start_time] ?? 0;
 
        $baseEndTime = \Carbon\Carbon::parse($this->start_time)->addMinutes(30)->format('H:i:s');
        return \Carbon\Carbon::parse($baseEndTime)->addMinutes($offsetMinutes)->format('H:i:s');
    }
 
    protected function getOffsetMatrix()
    {
        $cacheKey = $this->photographer_id . '_' . $this->date;
 
        if (!isset(static::$daySessionCache[$cacheKey])) {
            $sessions = self::where('photographer_id', $this->photographer_id)
                ->where('date', $this->date)
                ->orderBy('start_time', 'asc')
                ->get();
 
            $cumulative = 0;
            $matrix = [];
            
            foreach ($sessions as $s) {
                $cumulative += ($s->offset_minutes ?? 0);
                $matrix[$s->start_time] = $cumulative;
            }
            static::$daySessionCache[$cacheKey] = $matrix;
        }
 
        return static::$daySessionCache[$cacheKey];
    }
}
