<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PhotographerSessionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class PhotographerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Photographers/Index', [
            'photographers' => User::where('role', 'photographer')->select('id', 'name', 'username', 'phone', 'plain_password')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
        ]);

        $photographer = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'plain_password' => $validated['password'],
            'phone' => $validated['phone'],
            'role' => 'photographer',
        ]);

        // Auto-generate default sessions (60 days ahead, all 'open')
        $sessionsCreated = PhotographerSessionService::generateDefaultSessions($photographer->id, 60);

        return back()->with('success', "Photographer created successfully with {$sessionsCreated} sessions generated.");
    }

    public function update(Request $request, User $photographer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $photographer->id,
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string|max:20',
        ]);

        $data = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'phone' => $validated['phone'],
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($validated['password']);
            $data['plain_password'] = $validated['password'];
        }

        $photographer->update($data);

        return back()->with('success', 'Photographer updated successfully');
    }

    public function destroy(User $photographer)
    {
        if ($photographer->role !== 'photographer') {
            return back()->with('error', 'Unauthorized action.');
        }

        $photographer->delete();
        return back()->with('success', 'Photographer deleted successfully');
    }
}
