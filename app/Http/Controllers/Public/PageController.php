<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\Pricelist;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        $about = About::first();
        return Inertia::render('About', [
            'about' => $about
        ]);
    }

    public function pricelist()
    {
        $categories = \App\Models\PricelistCategory::with(['subCategories.packages'])->get();
        return Inertia::render('Pricelist', [
            'categories' => $categories
        ]);
    }
}
