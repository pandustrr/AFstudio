<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class PhotographerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Photographers/Index', [
            'photographers' => User::where('role', 'photographer')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => 'photographer',
        ]);

        return back()->with('success', 'Photographer created successfully');
    }

    public function update(Request $request, User $photographer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $photographer->id,
            'password' => 'nullable|string|min:6',
        ]);

        $data = [
            'name' => $validated['name'],
            'username' => $validated['username'],
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($validated['password']);
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
