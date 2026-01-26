<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricelistCategory;
use App\Models\PricelistSubCategory;
use App\Models\PricelistPackage;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PricelistController extends Controller
{
    public function index()
    {
        $categories = PricelistCategory::with(['subCategories.packages'])->get();
        return Inertia::render('Admin/Pricelist/Index', [
            'categories' => $categories
        ]);
    }

    // Category CRUD
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:room,photographer',
        ]);

        PricelistCategory::create($validated);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, PricelistCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:room,photographer',
        ]);

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyCategory(PricelistCategory $category)
    {
        $category->delete();
        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    // SubCategory CRUD
    public function storeSubCategory(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:pricelist_categories,id',
            'name' => 'required|string|max:255',
        ]);

        PricelistSubCategory::create($validated);

        return back()->with('success', 'Sub-Kategori berhasil ditambahkan.');
    }

    public function updateSubCategory(Request $request, PricelistSubCategory $subCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $subCategory->update($validated);

        return back()->with('success', 'Sub-Kategori berhasil diperbarui.');
    }

    public function destroySubCategory(PricelistSubCategory $subCategory)
    {
        $subCategory->delete();
        return back()->with('success', 'Sub-Kategori berhasil dihapus.');
    }

    // Package CRUD
    public function storePackage(Request $request)
    {
        $validated = $request->validate([
            'sub_category_id' => 'required|exists:pricelist_sub_categories,id',
            'name' => 'required|string|max:255',
            'price_display' => 'required|string',
            'price_numeric' => 'nullable|numeric',
            'features' => 'nullable|array',
            'is_popular' => 'boolean',
            'max_sessions' => 'required|integer|min:1',
            'max_editing_quota' => 'required|integer|min:0',
        ]);

        PricelistPackage::create($validated);

        return back()->with('success', 'Paket berhasil ditambahkan.');
    }

    public function updatePackage(Request $request, PricelistPackage $package)
    {
        // Debug: lihat data yang diterima
        Log::info('Update Package Request:', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price_display' => 'required|string',
            'price_numeric' => 'nullable|numeric',
            'features' => 'nullable|array',
            'is_popular' => 'boolean',
            'max_sessions' => 'required|integer|min:1',
            'max_editing_quota' => 'required|integer|min:0',
        ]);

        Log::info('Validated Data:', $validated);

        $package->update($validated);

        Log::info('Package after update:', $package->toArray());

        return back()->with('success', 'Paket berhasil diperbarui.');
    }

    public function destroyPackage(PricelistPackage $package)
    {
        $package->delete();
        return back()->with('success', 'Paket berhasil dihapus.');
    }
}
