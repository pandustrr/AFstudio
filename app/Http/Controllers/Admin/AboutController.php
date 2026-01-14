<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function index()
    {
        $about = About::first();
        if (!$about) {
            $about = About::create([
                'title' => 'About AF Studio',
            ]);
        }

        return Inertia::render('Admin/About/Index', [
            'about' => $about
        ]);
    }

    public function update(Request $request)
    {
        $about = About::firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'email' => 'nullable|string',
            'phone' => 'nullable|string',
            'instagram' => 'nullable|string',
            'address' => 'nullable|string',
            'maps_link' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            if ($about->image_path) {
                Storage::delete($about->image_path); // Make sure 'public' disk is configured or specified
            }
            $path = $request->file('image')->store('about-images', 'public');
            $about->image_path = $path;
        }

        $about->update($request->except('image'));

        return back()->with('success', 'Halaman About berhasil diperbarui.');
    }
}
