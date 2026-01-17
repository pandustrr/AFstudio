<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricelistPackage extends Model
{
    protected $guarded = ['id'];

    protected $fillable = [
        'sub_category_id',
        'name',
        'price_display',
        'price_numeric',
        'is_popular',
        'features',
        'duration',
    ];

    protected $casts = [
        'features' => 'array',
        'is_popular' => 'boolean',
        'price_numeric' => 'decimal:2',
    ];

    public function subCategory()
    {
        return $this->belongsTo(PricelistSubCategory::class, 'sub_category_id');
    }
}
