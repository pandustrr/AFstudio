<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EditRequest extends Model
{
    protected $fillable = [
        'photo_session_id',
        'selected_photos',
        'status',
    ];

    protected $casts = [
        'selected_photos' => 'array',
    ];

    public function photoEditing()
    {
        return $this->belongsTo(PhotoEditing::class, 'photo_session_id');
    }
}
