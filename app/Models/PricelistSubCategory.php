<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PricelistSubCategory extends Model
{
    protected $guarded = ['id'];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($subCategory) {
            $subCategory->slug = Str::slug($subCategory->name);
        });
    }

    public function category()
    {
        return $this->belongsTo(PricelistCategory::class, 'category_id');
    }

    public function packages()
    {
        return $this->hasMany(PricelistPackage::class, 'sub_category_id');
    }
}
