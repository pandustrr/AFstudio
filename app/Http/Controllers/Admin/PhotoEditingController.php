<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PhotoEditing;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PhotoEditingController extends Controller
{
    public function index()
    {
        $sessions = PhotoEditing::latest()->get();
        return Inertia::render('Admin/PhotoEditing/Index', [
            'sessions' => $sessions
        ]);
    }

    // Create & Store methods removed as per user request

    public function show(PhotoEditing $session)
    {
        $session->load(['editRequests', 'reviews']);
        return Inertia::render('Admin/PhotoEditing/Show', [
            'session' => $session
        ]);
    }

    public function edit(PhotoEditing $session)
    {
        return Inertia::render('Admin/PhotoEditing/Edit', [
            'session' => $session
        ]);
    }

    public function update(Request $request, PhotoEditing $session)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'raw_folder_id' => 'required|string|max:255',
            'edited_folder_id' => 'nullable|string|max:255',
            'max_edit_requests' => 'nullable|integer|min:1',
            'status' => 'required|in:pending,processing,done,cancelled',
        ]);

        $session->update($validated);

        return redirect()->route('admin.photo-editing.index')->with('success', 'Photo Request updated successfully.');
    }

    public function destroy(PhotoEditing $session)
    {
        $session->delete();
        return redirect()->route('admin.photo-editing.index')->with('success', 'Photo Request deleted successfully.');
    }
}
