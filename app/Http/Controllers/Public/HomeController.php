<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use App\Models\HomePageGallery;
use App\Models\PricelistCategory;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $homePage = HomePage::first();
        $categories = PricelistCategory::all();
        $galleries = HomePageGallery::orderBy('order')->get();

        $stats = [
            'booking_count' => \App\Models\Booking::count(),
            'package_count' => \App\Models\PricelistPackage::count(),
            'rating' => round(\App\Models\Review::avg('rating') ?? 5, 1),
        ];

        return Inertia::render('Home', [
            'homePage' => $homePage,
            'categories' => $categories,
            'galleries' => $galleries,
            'stats' => $stats,
        ]);
    }
}
