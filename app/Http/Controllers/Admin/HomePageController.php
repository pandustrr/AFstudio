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

        // Build validation rules based on what's being submitted
        $rules = [
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string|max:255',
            'hero_description' => 'nullable|string',
            'hero_image' => 'nullable|image|max:5120',
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
        ];

        $validated = $request->validate($rules);

        if ($request->hasFile('hero_image')) {
            if ($homePage->hero_image_path) {
                Storage::disk('public')->delete($homePage->hero_image_path);
            }
            $path = $request->file('hero_image')->store('home-images', 'public');
            $validated['hero_image_path'] = $path;
        }

        $homePage->update($validated);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Halaman Home berhasil diperbarui.']);
        }

        return back()->with('success', 'Halaman Home berhasil diperbarui.');
    }

    public function storeGallery(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|max:5120',
                'title' => 'nullable|string|max:255',
            ]);

            $path = $request->file('image')->store('home-gallery', 'public');
            $maxOrder = HomePageGallery::max('order') ?? 0;

            $gallery = HomePageGallery::create([
                'image_path' => $path,
                'title' => $request->title,
                'order' => $maxOrder + 1,
            ]);

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Gambar berhasil ditambahkan.', 'gallery' => $gallery]);
            }

            return back()->with('success', 'Gambar berhasil ditambahkan.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $e->errors()
                ], 422);
            }
            throw $e;
        }
    }

    public function updateGallery(Request $request, HomePageGallery $gallery)
    {
        try {
            $validated = $request->validate([
                'image' => 'nullable|image|max:5120',
                'title' => 'nullable|string|max:255',
                'order' => 'nullable|integer|min:1',
            ]);

            // Handle image update
            if ($request->hasFile('image')) {
                if ($gallery->image_path) {
                    Storage::disk('public')->delete($gallery->image_path);
                }
                $path = $request->file('image')->store('home-gallery', 'public');
                $validated['image_path'] = $path;
            }

            $gallery->update($validated);

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Gambar berhasil diperbarui.', 'gallery' => $gallery]);
            }

            return back()->with('success', 'Gambar berhasil diperbarui.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $e->errors()
                ], 422);
            }
            throw $e;
        }
    }

    public function destroyGallery(Request $request, HomePageGallery $gallery)
    {
        if ($gallery->image_path) {
            Storage::disk('public')->delete($gallery->image_path);
        }
        $gallery->delete();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Gambar berhasil dihapus.']);
        }

        return back()->with('success', 'Gambar berhasil dihapus.');
    }

    public function updateJourney(Request $request, JourneyStep $journey)
    {
        try {
            $validated = $request->validate([
                'step_number' => 'required|string|max:10',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'order' => 'nullable|integer|min:1',
            ]);

            $journey->update($validated);

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Langkah perjalanan berhasil diperbarui.']);
            }

            return back()->with('success', 'Langkah perjalanan berhasil diperbarui.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $e->errors()
                ], 422);
            }
            throw $e;
        }
    }

    public function storeJourney(Request $request)
    {
        try {
            $validated = $request->validate([
                'step_number' => 'required|string|max:10',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'order' => 'nullable|integer|min:1',
            ]);

            // Auto-generate order if not provided
            if (empty($validated['order'])) {
                $maxOrder = JourneyStep::max('order') ?? 0;
                $validated['order'] = $maxOrder + 1;
            }

            $journey = JourneyStep::create($validated);

            if ($request->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Langkah perjalanan berhasil ditambahkan.', 'journey' => $journey]);
            }

            return back()->with('success', 'Langkah perjalanan berhasil ditambahkan.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $e->errors()
                ], 422);
            }
            throw $e;
        }
    }

    public function destroyJourney(Request $request, JourneyStep $journey)
    {
        $journey->delete();

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Langkah perjalanan berhasil dihapus.']);
        }

        return back()->with('success', 'Langkah perjalanan berhasil dihapus.');
    }
}
