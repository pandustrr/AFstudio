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
            'photographers' => User::where('role', 'photographer')
                ->select('id', 'name', 'username', 'phone', 'plain_password', 'room_name', 'inactive_dates')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'room_name' => 'nullable|string|max:255',
        ]);

        $photographer = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'plain_password' => $validated['password'],
            'phone' => $validated['phone'],
            'role' => 'photographer',
            'room_name' => $validated['room_name'] ?? null,
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
            'room_name' => 'nullable|string|max:255',
            'inactive_dates' => 'nullable|array',
            'inactive_dates.*' => 'date',
            'is_active' => 'nullable|boolean',
        ]);

        $data = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'phone' => $validated['phone'],
            'room_name' => $validated['room_name'] ?? null,
            'inactive_dates' => $validated['inactive_dates'] ?? [],
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($validated['password']);
            $data['plain_password'] = $validated['password'];
        }

        $photographer->update($data);

        // Sync Inactive Dates
        // Validasi inactive_dates sebagai array (bisa kosong jika semua diaktifkan kembali)
        $newInactiveDates = $request->input('inactive_dates', []);
        
        // 1. Ambil semua sesi fotografer yang ada
        $sessions = \App\Models\PhotographerSession::where('photographer_id', $photographer->id)
            ->where('status', '!=', 'booked')
            ->get();

        foreach ($sessions as $session) {
            $isNowInactive = in_array($session->date, $newInactiveDates);
            $currentStatus = $session->status;

            if ($isNowInactive && $currentStatus === 'open') {
                $session->update(['status' => 'off']);
            } elseif (!$isNowInactive && $currentStatus === 'off') {
                $session->update(['status' => 'open']);
            }
        }

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
