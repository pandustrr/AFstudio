<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhotoSelection extends Model
{
    protected $fillable = [
        'uid',
        'drive_type',
        'selected_photos',
        'review',
    ];

    protected $casts = [
        'selected_photos' => 'array',
    ];
}
