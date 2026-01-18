<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class RoomController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Bookings/Rooms/Index', [
            'rooms' => Room::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
        ]);

        Room::create([
            'label' => $validated['label'],
            'name' => Str::slug($validated['label'], '_'),
        ]);

        return back()->with('success', 'Room created successfully');
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
        ]);

        $room->update([
            'label' => $validated['label'],
            'name' => Str::slug($validated['label'], '_'),
        ]);

        return back()->with('success', 'Room updated successfully');
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return back()->with('success', 'Room deleted successfully');
    }
}
