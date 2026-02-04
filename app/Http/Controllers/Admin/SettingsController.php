<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = HomePage::first();
        if (!$settings) {
            $settings = HomePage::create([
                'hero_title' => 'MELAMPAUI MOMEN.',
            ]);
        }

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $settings = HomePage::firstOrFail();

        $validated = $request->validate([
            'admin_whatsapp' => 'required|string|max:20',
        ]);

        $settings->update($validated);

        return back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
