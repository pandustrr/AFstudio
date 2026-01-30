<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use App\Models\HomePageGallery;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class HomePageController extends Controller
{
    public function index()
    {
        $homePage = HomePage::first();
        if (!$homePage) {
            $homePage = HomePage::create([
                'hero_title' => 'MELAMPAUI MOMEN.',
                'hero_subtitle' => 'keanggunan ARTISTIK',
                'hero_description' => 'Mari abadikan setiap penggalan cerita Anda dengan sentuhan estetik yang tidak lekang oleh waktu.',
            ]);
        }

        return Inertia::render('Admin/HomePage/Index', [
            'homePage' => $homePage,
            'galleries' => HomePageGallery::orderBy('order')->get(),
        ]);
    }

    public function update(Request $request)
    {
        $homePage = HomePage::firstOrFail();

        $validated = $request->validate([
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'nullable|string|max:255',
            'hero_description' => 'nullable|string',
            'hero_image' => 'nullable|image|max:5120',
            'cta_button_text' => 'nullable|string|max:255',
            'about_button_text' => 'nullable|string|max:255',
            'gallery_title' => 'nullable|string|max:255',
            'gallery_subtitle' => 'nullable|string',
        ]);

        if ($request->hasFile('hero_image')) {
            if ($homePage->hero_image_path) {
                Storage::disk('public')->delete($homePage->hero_image_path);
            }
            $path = $request->file('hero_image')->store('home-images', 'public');
            $validated['hero_image_path'] = $path;
        }

        $homePage->update($validated);

        return back()->with('success', 'Halaman Home berhasil diperbarui.');
    }

    public function storeGallery(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
            'title' => 'nullable|string|max:255',
        ]);

        $path = $request->file('image')->store('home-gallery', 'public');
        $maxOrder = HomePageGallery::max('order') ?? 0;

        HomePageGallery::create([
            'image_path' => $path,
            'title' => $request->title,
            'order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Gambar berhasil ditambahkan.');
    }

    public function destroyGallery(HomePageGallery $gallery)
    {
        if ($gallery->image_path) {
            Storage::disk('public')->delete($gallery->image_path);
        }
        $gallery->delete();

        return back()->with('success', 'Gambar berhasil dihapus.');
    }
}
