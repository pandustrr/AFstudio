<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pricelist;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PricelistController extends Controller
{
    public function index()
    {
        $pricelists = Pricelist::latest()->get();
        return Inertia::render('Admin/Pricelist/Index', [
            'pricelists' => $pricelists
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
        ]);

        Pricelist::create($validated);

        return back()->with('success', 'Paket harga berhasil ditambahkan.');
    }

    public function update(Request $request, Pricelist $pricelist)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $pricelist->update($validated);

        return back()->with('success', 'Paket harga berhasil diperbarui.');
    }

    public function destroy(Pricelist $pricelist)
    {
        $pricelist->delete();
        return back()->with('success', 'Paket harga berhasil dihapus.');
    }
}
