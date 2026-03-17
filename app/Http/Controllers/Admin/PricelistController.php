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
use Illuminate\Support\Facades\Storage;

class PricelistController extends Controller
{
    public function index()
    {
        $categories = PricelistCategory::with(['subCategories' => function($q) {
            $q->with('packages');
        }])->get();

        // Add has_bookings check to each subCategory
        foreach ($categories as $category) {
            foreach ($category->subCategories as $subCategory) {
                $packageIds = $subCategory->packages->pluck('id');
                $subCategory->has_bookings = \App\Models\BookingItem::whereIn('pricelist_package_id', $packageIds)->exists();
            }
        }

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
            'background_image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('category-backgrounds', 'public');
            $validated['background_image'] = $path; // Fixed: Use direct key background_image
        }

        PricelistCategory::create($validated);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, PricelistCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:room,photographer',
            'background_image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('background_image')) {
            if ($category->background_image) {
                Storage::disk('public')->delete($category->background_image);
            }
            $path = $request->file('background_image')->store('category-backgrounds', 'public');
            $validated['background_image'] = $path;
        }

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyCategory(PricelistCategory $category)
    {
        try {
            if ($category->background_image) {
                Storage::disk('public')->delete($category->background_image);
            }
            $category->delete();
            return back()->with('success', 'Kategori berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Gagal menghapus kategori: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus kategori. Pastikan tidak ada sub-kategori atau paket di dalamnya yang sudah dipesan klien.');
        }
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
        // Cek apakah ada paket di dalam sub-kategori ini yang sudah dipesan
        $packageIds = $subCategory->packages->pluck('id');
        $hasBookings = \App\Models\BookingItem::whereIn('pricelist_package_id', $packageIds)->exists();

        if ($hasBookings) {
            return back()->with('error', 'Gagal menghapus! Salah satu paket di sub-kategori ini sudah ada di daftar pesan (booking) klien. Silakan gunakan fitur arsip jika tidak ingin menampilkannya di publik.');
        }

        try {
            $subCategory->delete();
            return back()->with('success', 'Sub-Kategori beserta paket di dalamnya berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Gagal menghapus sub-kategori: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menghapus sub-kategori.');
        }
    }

    public function toggleSubCategoryStatus(PricelistSubCategory $subCategory)
    {
        $subCategory->update([
            'is_active' => !$subCategory->is_active
        ]);

        $status = $subCategory->is_active ? 'diaktifkan' : 'diarsipkan';
        return back()->with('success', "Sub-Kategori berhasil {$status}.");
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
            'allow_split_session' => 'boolean',
            'review_template' => 'nullable|array',
        ]);

        // Calculate duration based on max_sessions (1 session = 30 minutes)
        $validated['duration'] = $validated['max_sessions'] * 30;

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
            'allow_split_session' => 'boolean',
            'review_template' => 'nullable|array',
        ]);

        Log::info('Validated Data:', $validated);

        // Calculate duration based on max_sessions (1 session = 30 minutes)
        $validated['duration'] = $validated['max_sessions'] * 30;

        $package->update($validated);

        Log::info('Package after update:', $package->toArray());

        return back()->with('success', 'Paket berhasil diperbarui.');
    }

    public function destroyPackage(PricelistPackage $package)
    {
        try {
            $package->delete();
            return back()->with('success', 'Paket berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Gagal menghapus paket: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus paket karena paket ini sudah pernah dipesan oleh klien.');
        }
    }
}
