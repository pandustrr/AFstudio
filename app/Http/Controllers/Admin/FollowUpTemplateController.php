<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FollowUpTemplate;
use Illuminate\Http\Request;

class FollowUpTemplateController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        FollowUpTemplate::create($validated);

        return back()->with('success', 'Template berhasil ditambahkan.');
    }

    public function update(Request $request, FollowUpTemplate $followUpTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $followUpTemplate->update($validated);

        return back()->with('success', 'Template berhasil diperbarui.');
    }

    public function destroy(FollowUpTemplate $followUpTemplate)
    {
        $followUpTemplate->delete();

        return back()->with('success', 'Template berhasil dihapus.');
    }
}
