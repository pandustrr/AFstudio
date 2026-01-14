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
        $pricelists = Pricelist::where('is_active', true)->orderBy('is_popular', 'desc')->get();
        return Inertia::render('Pricelist', [
            'pricelists' => $pricelists
        ]);
    }
}
