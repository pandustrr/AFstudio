<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'stats' => 'array',
        'dna' => 'array',
    ];
}
