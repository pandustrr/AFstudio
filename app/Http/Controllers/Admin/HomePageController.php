<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use App\Models\HomePageGallery;
use App\Models\JourneyStep;
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
            'journeySteps' => JourneyStep::orderBy('order')->get(),
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
            'running_text' => 'nullable|string',
            'gallery_title' => 'nullable|string|max:255',
            'gallery_subtitle' => 'nullable|string',
            'services_title' => 'nullable|string|max:255',
            'services_subtitle' => 'nullable|string|max:255',
            'services_description' => 'nullable|string',
            'contact_label' => 'nullable|string|max:255',
            'contact_title' => 'nullable|string|max:255',
            'contact_description' => 'nullable|string',
            'operation_title' => 'nullable|string|max:255',
            'operation_days' => 'nullable|string|max:255',
            'operation_hours' => 'nullable|string|max:255',
            'response_title' => 'nullable|string|max:255',
            'response_method' => 'nullable|string|max:255',
            'response_time' => 'nullable|string|max:255',
            'contact_form_title' => 'nullable|string|max:255',
            'contact_form_placeholder' => 'nullable|string|max:255',
            'contact_button_text' => 'nullable|string|max:255',
            'admin_whatsapp' => 'nullable|string|max:20',
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

    public function updateJourney(Request $request, JourneyStep $journey)
    {
        $validated = $request->validate([
            'step_number' => 'required|string|max:10',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:1',
        ]);

        $journey->update($validated);

        return back()->with('success', 'Langkah perjalanan berhasil diperbarui.');
    }

    public function destroyJourney(JourneyStep $journey)
    {
        $journey->delete();

        return back()->with('success', 'Langkah perjalanan berhasil dihapus.');
    }
}
