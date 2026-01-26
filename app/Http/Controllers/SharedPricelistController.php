<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SharedPricelistController extends Controller
{
    public function category($slug)
    {
        $category = \App\Models\PricelistCategory::where('slug', $slug)
            ->with(['subCategories.packages'])
            ->firstOrFail();

        // Pass ONLY this category as a single-element list to reused view, or handle 'locked' mode
        return \Inertia\Inertia::render('Pricelist', [
            'categories' => [$category], // Only this category
            'locked' => [
                'type' => 'category',
                'name' => $category->name,
            ],
            'rooms' => \App\Models\Room::all()
        ]);
    }

    public function all()
    {
        $categories = \App\Models\PricelistCategory::with(['subCategories.packages'])
            ->orderBy('id')
            ->get();

        return \Inertia\Inertia::render('Pricelist', [
            'categories' => $categories,
            'locked' => [
                'type' => 'all',
                'name' => 'Full Pricelist',
            ],
            'rooms' => \App\Models\Room::all()
        ]);
    }

    public function package($slug)
    {
        $package = \App\Models\PricelistPackage::where('slug', $slug)
            ->with(['subCategory.category'])
            ->firstOrFail();

        // Even more specific: we prefer to just show the modal or the card isolated.
        // For now, let's wrap it in its category hierarchy so the page renders,
        // but tell Frontend to focus/lock on this package.

        $sub = $package->subCategory;
        $sub->setRelation('packages', collect([$package]));

        $cat = $sub->category;
        $cat->setRelation('subCategories', collect([$sub]));

        return \Inertia\Inertia::render('Pricelist', [
            'categories' => [$cat],
            'locked' => [
                'type' => 'package',
                'name' => $package->name,
                'package_id' => $package->id
            ],
            'rooms' => \App\Models\Room::all()
        ]);
    }

    public function subCategory($slug)
    {
        $sub = \App\Models\PricelistSubCategory::where('slug', $slug)
            ->with(['category', 'packages'])
            ->firstOrFail();

        $cat = $sub->category;
        $cat->setRelation('subCategories', collect([$sub]));

        return \Inertia\Inertia::render('Pricelist', [
            'categories' => [$cat],
            'locked' => [
                'type' => 'sub-category',
                'name' => $sub->name,
                'sub_category_id' => $sub->id
            ],
            'rooms' => \App\Models\Room::all()
        ]);
    }
}
