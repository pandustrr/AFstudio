<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'photo_session_id',
        'review_text',
        'rating',
    ];

    public function photoEditing()
    {
        return $this->belongsTo(PhotoEditing::class, 'photo_session_id');
    }
}
