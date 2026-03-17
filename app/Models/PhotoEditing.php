<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhotoEditing extends Model
{
    protected $table = 'photo_sessions';

    protected $fillable = [
        'uid',
        'customer_name',
        'raw_folder_id',
        'is_raw_accessible',
        'edited_folder_id',
        'is_edited_accessible',
        'status',
        'quota_request',
        'extra_editing_quota',
        'cancelled_photos',
    ];

    protected $casts = [
        'cancelled_photos' => 'array',
        'is_raw_accessible' => 'boolean',
        'is_edited_accessible' => 'boolean',
    ];

    public function editRequests()
    {
        return $this->hasMany(EditRequest::class, 'photo_session_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'photo_session_id');
    }

    public function booking()
    {
        return $this->hasOne(Booking::class, 'guest_uid', 'uid');
    }
}
