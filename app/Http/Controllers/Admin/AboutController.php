<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\Moodboard;
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
            'about' => $about,
            'moodboards' => Moodboard::latest()->get()
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
                Storage::disk('public')->delete($about->image_path);
            }
            $path = $request->file('image')->store('about-images', 'public');
            $about->image_path = $path;
        }

        $about->update($request->except('image'));

        return back()->with('success', 'Halaman About berhasil diperbarui.');
    }
    public function storeMoodboard(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
            'title' => 'nullable|string|max:255',
        ]);

        $path = $request->file('image')->store('moodboards', 'public');

        Moodboard::create([
            'image_path' => $path,
            'title' => $request->title,
        ]);

        return back()->with('success', 'Moodboard berhasil ditambahkan.');
    }

    public function destroyMoodboard(Moodboard $moodboard)
    {
        if ($moodboard->image_path) {
            Storage::disk('public')->delete($moodboard->image_path);
        }
        $moodboard->delete();

        return back()->with('success', 'Moodboard berhasil dihapus.');
    }
}
