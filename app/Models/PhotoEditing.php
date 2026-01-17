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
        'edited_folder_id',
        'status',
    ];

    public function editRequests()
    {
        return $this->hasMany(EditRequest::class, 'photo_session_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'photo_session_id');
    }
}
