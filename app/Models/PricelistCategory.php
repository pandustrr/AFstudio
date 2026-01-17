<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PricelistCategory extends Model
{
    protected $guarded = ['id'];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($category) {
            $category->slug = Str::slug($category->name);
        });
    }

    public function subCategories()
    {
        return $this->hasMany(PricelistSubCategory::class, 'category_id');
    }
}
