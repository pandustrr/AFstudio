<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhotographerDateMark extends Model
{
    protected $fillable = [
        'photographer_id',
        'date',
        'color',
        'label',
    ];
}
