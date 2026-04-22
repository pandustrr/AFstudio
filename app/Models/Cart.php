<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cart_uid',
        'pricelist_package_id',
        'quantity',
        'scheduled_date',
        'start_time',
        'end_time',
        'room_id',
        'room_name',
        'photographer_id',
        'session_ids',
        'sessions_needed',
        'selected_times',
        'is_direct',
    ];

    protected $casts = [
        'session_ids' => 'array',
        'selected_times' => 'array',
        'is_direct' => 'boolean',
    ];

    protected $appends = [
        'adjusted_sessions'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(PricelistPackage::class, 'pricelist_package_id');
    }

    public function photographerSessions()
    {
        // Many-to-many style lookup based on session IDs or date/time
        // selected_times are stored as H:i format, but DB uses H:i:s — normalize to H:i:s
        $times = $this->selected_times ?: [$this->start_time];
        $normalizedTimes = array_map(function ($t) {
            if (!$t) return $t;
            // If already H:i:s, keep as-is; otherwise append :00
            return strlen($t) === 5 ? $t . ':00' : $t;
        }, $times);

        return $this->hasMany(PhotographerSession::class, 'photographer_id', 'photographer_id')
                    ->where('date', $this->scheduled_date)
                    ->whereIn('start_time', $normalizedTimes);
    }

    public function getAdjustedSessionsAttribute()
    {
        // Optimization: Use pre-loaded relation if available to avoid N+1 queries
        $sessions = $this->relationLoaded('photographerSessions') 
                    ? $this->photographerSessions 
                    : $this->photographerSessions()->get();
        
        $sessions = $sessions->sortBy('start_time');

        // FALLBACK: If sessions records don't exist in DB yet (for future months like June)
        // We generate virtual adjusted sessions from selected_times for the UI
        if ($sessions->isEmpty() && !empty($this->selected_times)) {
            return collect($this->selected_times)->sort()->map(function($t) {
                // Determine if it's already H:i:s or just H:i
                $startTime = strlen($t) === 5 ? $t . ':00' : $t;
                return [
                    'id' => null,
                    'start_time' => $startTime,
                    'end_time' => \Carbon\Carbon::parse($startTime)->addMinutes(30)->format('H:i:s'),
                    'adjusted_start_time' => $startTime,
                    'adjusted_end_time' => \Carbon\Carbon::parse($startTime)->addMinutes(30)->format('H:i:s'),
                    'is_customized' => false
                ];
            })->values()->toArray();
        }

        return $sessions->map(function($s) {
            return [
                'id' => $s->id,
                'start_time' => $s->start_time,
                'end_time' => $s->override_end_time ?: \Carbon\Carbon::parse($s->start_time)->addMinutes(30)->format('H:i:s'),
                'adjusted_start_time' => $s->adjusted_start_time,
                'adjusted_end_time' => $s->adjusted_end_time,
                'is_customized' => $s->is_customized
            ];
        })->values()->toArray();
    }
}
