<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricelistPackage extends Model
{
    protected $guarded = ['id'];

    protected $fillable = [
        'sub_category_id',
        'name',
        'slug',
        'price_display',
        'price_numeric',
        'is_popular',
        'features',
        'duration',
        'max_sessions',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($package) {
            // Get sub-category name for more descriptive slug
            $subCategory = \App\Models\PricelistSubCategory::find($package->sub_category_id);
            $subCategorySlug = $subCategory ? \Illuminate\Support\Str::slug($subCategory->name) : '';

            // Create clean slug: subcategory-packagename
            $baseSlug = $subCategorySlug ? $subCategorySlug . '-' . \Illuminate\Support\Str::slug($package->name) : \Illuminate\Support\Str::slug($package->name);

            // Check for uniqueness and add number if needed
            $slug = $baseSlug;
            $count = 1;
            while (\App\Models\PricelistPackage::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $count;
                $count++;
            }

            $package->slug = $slug;
        });
    }

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
