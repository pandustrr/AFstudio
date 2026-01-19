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
        $segment = $request->segment(1);
        $guard = 'web';

        if ($segment === 'editor') $guard = 'editor';
        elseif ($segment === 'photographer') $guard = 'photographer';

        if (Auth::guard($guard)->check()) {
            if ($guard === 'editor') return redirect()->route('editor.dashboard');
            if ($guard === 'photographer') return redirect()->route('photographer.dashboard');
            return redirect()->route('admin.dashboard');
        }

        if ($segment === 'photographer') return Inertia::render('Photographer/Login');
        return Inertia::render('Admin/Login');
    }

    /**
     * Handle authentication attempt.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

        // Detect guard based on type input or user's role in database
        $user = \App\Models\User::where('username', $request->username)->first();

        $type = $request->input('type');
        $guard = 'web';

        if ($type === 'photographer' || ($user && $user->role === 'photographer')) {
            $guard = 'photographer';
        } elseif ($type === 'editor' || ($user && $user->role === 'editor')) {
            $guard = 'editor';
        }

        if (Auth::guard($guard)->attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::guard($guard)->user();

            if ($guard === 'editor' && $user->role !== 'editor' && $user->role !== 'admin') {
                Auth::guard($guard)->logout();
                return back()->withErrors(['username' => 'Akses khusus Editor.']);
            }

            if ($guard === 'photographer' && $user->role !== 'photographer' && $user->role !== 'admin') {
                Auth::guard($guard)->logout();
                return back()->withErrors(['username' => 'Akses khusus Photographer.']);
            }

            if ($guard === 'web' && $user->role !== 'admin') {
                Auth::guard($guard)->logout();
                return back()->withErrors(['username' => 'Akses khusus Admin.']);
            }

            $request->session()->regenerate();

            if ($guard === 'editor') return redirect()->intended(route('editor.dashboard'));
            if ($guard === 'photographer') return redirect()->intended(route('photographer.dashboard'));
            return redirect()->intended(route('admin.dashboard'));
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
        $guard = 'web';
        if ($request->is('admin*')) $guard = 'web';
        elseif ($request->is('editor*')) $guard = 'editor';
        elseif ($request->is('photographer*')) $guard = 'photographer';

        Auth::guard($guard)->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }
}
