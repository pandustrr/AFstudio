<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Photographer/Profile', [
            'user' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'current_password' => ['nullable', 'required_with:password'],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
        ]);

        if ($request->filled('password')) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return redirect()->back()->withErrors(['current_password' => 'Password saat ini salah.']);
            }
            $data['password'] = Hash::make($validated['password']);
        }

        $data['username'] = $validated['username'];
        $data['phone'] = $validated['phone'];

        $user->update($data);

        return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
    }
}
