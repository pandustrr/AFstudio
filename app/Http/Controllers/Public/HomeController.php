<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\PricelistCategory;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = PricelistCategory::all();
        return Inertia::render('Home', [
            'categories' => $categories
        ]);
    }
}
