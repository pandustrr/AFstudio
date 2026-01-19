<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLogin(Request $request)
    {
        $guard = $request->is('editor*') ? 'editor' : 'web';

        if (Auth::guard($guard)->check()) {
            return redirect()->route($guard === 'editor' ? 'editor.dashboard' : 'admin.dashboard');
        }

        return $guard === 'editor'
            ? Inertia::render('Editor/Login')
            : Inertia::render('Admin/Login');
    }

    /**
     * Handle authentication attempt.
     */
    public function login(Request $request)
    {
        $guard = $request->is('editor*') || $request->input('type') === 'editor' ? 'editor' : 'web';

        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

        if (Auth::guard($guard)->attempt($credentials, $request->boolean('remember'))) {
            // Check role after successful credentials check
            $user = Auth::guard($guard)->user();

            if ($guard === 'editor' && $user->role !== 'editor' && $user->role !== 'admin') {
                Auth::guard($guard)->logout();
                return back()->withErrors(['username' => 'Akses khusus Editor.']);
            }

            if ($guard === 'web' && $user->role !== 'admin') {
                Auth::guard($guard)->logout();
                return back()->withErrors(['username' => 'Akses khusus Admin.']);
            }

            $request->session()->regenerate();

            return redirect()->intended(route($guard === 'editor' ? 'editor.dashboard' : 'admin.dashboard'));
        }

        return back()->withErrors([
            'username' => 'Username atau password yang Anda masukkan salah.',
        ])->onlyInput('username');
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request)
    {
        $guard = $request->is('admin*') ? 'web' : 'editor';
        $otherGuard = $guard === 'web' ? 'editor' : 'web';

        Auth::guard($guard)->logout();

        // Only invalidate if the other guard is NOT logged in
        if (!Auth::guard($otherGuard)->check()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        } else {
            // Just regenerate to be safe but keep the session
            $request->session()->regenerate();
        }

        return redirect($guard === 'web' ? '/admin/login' : '/editor/login');
    }
}
