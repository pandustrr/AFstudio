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

        // Apply Filters based on Scheduled Date (from Booking Items)
        if ($year) {
            $query->whereHas('booking.items', function($q) use ($year) {
                $q->whereYear('scheduled_date', $year);
            });
        }
        if ($month) {
            $query->whereHas('booking.items', function($q) use ($month) {
                $q->whereMonth('scheduled_date', $month);
            });
        }
        if ($day) {
            $query->whereHas('booking.items', function($q) use ($day) {
                $q->whereDay('scheduled_date', $day);
            });
        }
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $sessions = $query->latest()->get();

        // Sort by Scheduled Date (Descending) in PHP for better stability (avoiding SQL 500 error)
        $sessions = $sessions->sortByDesc(function ($session) {
            try {
                $item = $session->booking ? $session->booking->items->first() : null;
                if ($item && $item->scheduled_date) {
                    $datePart = is_string($item->scheduled_date) ? substr($item->scheduled_date, 0, 10) : $item->scheduled_date->format('Y-m-d');
                    $timePart = $item->start_time ?: '00:00:00';
                    return $datePart . ' ' . $timePart;
                }
            } catch (\Exception $e) {
                // Fallback on any error during date processing
            }
            return $session->created_at ? $session->created_at->toDateTimeString() : '0000-00-00 00:00:00';
        })->values();

        // Get Available Options
        // Years: Always available
        // Get Available Options based on Scheduled Date
        // Years
        $availableYears = \App\Models\BookingItem::whereHas('booking.photoSession')
            ->selectRaw('YEAR(scheduled_date) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
            
        // Fallback to PhotoEditing created_at years if no booking items found
        if (empty($availableYears)) {
            $availableYears = PhotoEditing::selectRaw('YEAR(created_at) as year')
                ->distinct()
                ->orderBy('year', 'desc')
                ->pluck('year')
                ->toArray();
        }

        // Ensure current filtered year is in options
        if ($year && !in_array((int)$year, $availableYears)) {
            $availableYears[] = (int)$year;
            rsort($availableYears);
        }

        // Months: Available if Year is selected
        $availableMonths = [];
        if ($year) {
            $availableMonths = \App\Models\BookingItem::whereHas('booking.photoSession')
                ->whereYear('scheduled_date', $year)
                ->selectRaw('MONTH(scheduled_date) as month')
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
            $availableDays = \App\Models\BookingItem::whereHas('booking.photoSession')
                ->whereYear('scheduled_date', $year)
                ->whereMonth('scheduled_date', $month)
                ->selectRaw('DAY(scheduled_date) as day')
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
