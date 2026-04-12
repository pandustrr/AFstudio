<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        // If no user in default guard, check specific guards
        if (!$user) {
            if (\Illuminate\Support\Facades\Auth::guard('photographer')->check()) {
                $user = \Illuminate\Support\Facades\Auth::guard('photographer')->user();
            } elseif (\Illuminate\Support\Facades\Auth::guard('editor')->check()) {
                $user = \Illuminate\Support\Facades\Auth::guard('editor')->user();
            }
        }

        if (!$user || (strtolower($user->role) !== strtolower($role) && strtolower($user->role) !== 'admin')) {
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
