<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class AccessController extends Controller
{
    public function unlock($token)
    {
        // Simple token check, could be expanded to use database if needed
        $secretToken = 'afstudio-unlock';
        
        if ($token === $secretToken) {
            Session::put('unlocked_access', true);
            return redirect()->route('price-list')->with('success', 'Akses Pricelist Terbuka!');
        }

        return redirect()->route('home')->with('error', 'Token akses tidak valid.');
    }
}
