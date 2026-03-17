<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PhotoEditing;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;


class PhotoEditingController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');
        $status = $request->input('status');

        // Base Query
        $query = PhotoEditing::with(['editRequests', 'booking.items.package'])
            ->withCount(['editRequests', 'reviews']);

        // Photographer Filter: Only show sessions assigned to them
        if (Auth::user()->role === 'photographer') {
            $query->whereHas('booking.items', function ($q) {
                $q->where('photographer_id', Auth::id());
            });
        }

        // Apply Filters
        if ($year) {
            $query->whereYear('created_at', $year);
        }
        if ($month) {
            $query->whereMonth('created_at', $month);
        }
        if ($day) {
            $query->whereDay('created_at', $day);
        }
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $sessions = $query->latest()->get();

        // Get Available Options
        // Years: Always available
        $availableYears = PhotoEditing::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        // Ensure current filtered year is in options
        if ($year && !in_array((int)$year, $availableYears)) {
            $availableYears[] = (int)$year;
            rsort($availableYears);
        }

        // Months: Available if Year is selected
        $availableMonths = [];
        if ($year) {
            $availableMonths = PhotoEditing::whereYear('created_at', $year)
                ->selectRaw('MONTH(created_at) as month')
                ->distinct()
                ->orderBy('month', 'desc')
                ->pluck('month')
                ->toArray();

            // Ensure current filtered month is in options
            if ($month && !in_array((int)$month, $availableMonths)) {
                $availableMonths[] = (int)$month;
                rsort($availableMonths);
            }
        }

        // Days: Available if Year and Month are selected
        $availableDays = [];
        if ($year && $month) {
            $availableDays = PhotoEditing::whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->selectRaw('DAY(created_at) as day')
                ->distinct()
                ->orderBy('day', 'desc')
                ->pluck('day')
                ->toArray();

            // Ensure current filtered day is in options
            if ($day && !in_array((int)$day, $availableDays)) {
                $availableDays[] = (int)$day;
                rsort($availableDays);
            }
        }

        return Inertia::render('Admin/PhotoEditing/Index', [
            'sessions' => $sessions,
            'filters' => [
                'year' => $year,
                'month' => $month,
                'day' => $day,
                'status' => $status ?? 'all'
            ],
            'options' => [
                'years' => $availableYears,
                'months' => $availableMonths,
                'days' => $availableDays
            ],
            'user' => [
                'role' => Auth::user()->role
            ]
        ]);
    }

    // Create & Store methods removed as per user request

    public function show(PhotoEditing $photoEditing)
    {
        $route = request()->is('editor*') ? 'editor.photo-editing.index' : 'admin.photo-editing.index';
        return redirect()->route($route);
    }

    public function edit(PhotoEditing $photoEditing)
    {
        $route = request()->is('editor*') ? 'editor.photo-editing.index' : 'admin.photo-editing.index';
        return redirect()->route($route);
    }

    public function update(Request $request, PhotoEditing $photoEditing)
    {
        $rules = [
            'status' => 'required|in:pending,processing,done,cancelled',
        ];

        if (Auth::user()->role === 'photographer') {
            $rules['raw_folder_id'] = 'required|string|max:255';
            $rules['is_raw_accessible'] = 'boolean';
        } else {
            $rules['customer_name'] = 'required|string|max:255';
            $rules['raw_folder_id'] = 'required|string|max:255';
            $rules['is_raw_accessible'] = 'boolean';
            $rules['edited_folder_id'] = 'nullable|string|max:255';
            $rules['is_edited_accessible'] = 'boolean';
        }

        $validated = $request->validate($rules);

        // Automate status based on folder presence
        if (!empty($validated['edited_folder_id'])) {
            $validated['status'] = 'done';
        } elseif (!empty($validated['raw_folder_id'])) {
            $validated['status'] = 'processing';
        }

        $photoEditing->update($validated);

        // SYNC with Booking status
        $booking = \App\Models\Booking::where('guest_uid', $photoEditing->uid)->first();
        if ($booking) {
            if ($photoEditing->status === 'done') {
                $booking->update(['status' => 'completed']);
            } elseif ($photoEditing->status === 'processing') {
                $booking->update(['status' => 'request_edit']);
            }
        }

        return redirect()->back()->with('success', 'Photo Request updated successfully.');
    }

    public function destroy(PhotoEditing $photoEditing)
    {
        $photoEditing->delete();
        return redirect()->back()->with('success', 'Photo Request deleted successfully.');
    }
}
