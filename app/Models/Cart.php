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
        'is_direct_buy',
        'is_direct',
    ];

    protected $casts = [
        'session_ids' => 'array',
        'selected_times' => 'array',
        'is_direct_buy' => 'boolean',
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
        return $this->hasMany(PhotographerSession::class, 'photographer_id', 'photographer_id')
                    ->where('date', $this->scheduled_date)
                    ->whereIn('start_time', $this->selected_times ?: [$this->start_time]);
    }

    public function getAdjustedSessionsAttribute()
    {
        $sessions = $this->photographerSessions->sortBy('start_time');
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
