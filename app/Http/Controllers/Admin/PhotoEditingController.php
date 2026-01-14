<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PhotoEditing;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PhotoEditingController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status');

        $sessions = PhotoEditing::with(['editRequests'])
            ->withCount(['editRequests', 'reviews'])
            ->when($status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->get();

        return Inertia::render('Admin/PhotoEditing/Index', [
            'sessions' => $sessions,
            'filters' => [
                'status' => $status ?? 'all'
            ]
        ]);
    }

    // Create & Store methods removed as per user request

    public function show(PhotoEditing $photoEditing)
    {
        return redirect()->route('admin.photo-editing.index');
    }

    public function edit(PhotoEditing $photoEditing)
    {
        return redirect()->route('admin.photo-editing.index');
    }

    public function update(Request $request, PhotoEditing $photoEditing)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'raw_folder_id' => 'required|string|max:255',
            'edited_folder_id' => 'nullable|string|max:255',
            'status' => 'required|in:pending,processing,done,cancelled',
        ]);

        $photoEditing->update($validated);

        return redirect()->route('admin.photo-editing.index')->with('success', 'Photo Request updated successfully.');
    }

    public function destroy(PhotoEditing $photoEditing)
    {
        $photoEditing->delete();
        return redirect()->route('admin.photo-editing.index')->with('success', 'Photo Request deleted successfully.');
    }
}
