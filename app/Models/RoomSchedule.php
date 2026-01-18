<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomSchedule extends Model
{
    protected $fillable = ['room_id', 'day_of_week', 'date', 'start_time', 'end_time', 'is_active'];
    protected $casts = [
        'is_active' => 'boolean',
    ];
}
