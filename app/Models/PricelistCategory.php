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
            $slug = Str::slug($category->name);
            $count = 1;
            $originalSlug = $slug;

            // Check if slug already exists and increment if it does
            while (static::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }

            $category->slug = $slug;
        });
    }

    public function subCategories()
    {
        return $this->hasMany(PricelistSubCategory::class, 'category_id');
    }
}
