<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interaction extends Model
{
    protected $fillable = [
        'event_type',
        'page_name',
        'url',
        'item_id',
        'item_name',
        'payload',
        'ip_address',
        'user_agent',
        'device_hash',
        'user_id',
        'session_id',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
