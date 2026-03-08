<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'photo_session_id',
        'review_text',
        'additional_fields',
        'rating',
        'photo_path',
        'is_visible',
    ];

    protected $casts = [
        'additional_fields' => 'array',
    ];

    public function photoEditing()
    {
        return $this->belongsTo(PhotoEditing::class, 'photo_session_id');
    }
}
