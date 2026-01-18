<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PhotoEditing;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PhotoEditingController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');
        $status = $request->input('status');

        // Base Query
        $query = PhotoEditing::with(['editRequests'])
            ->withCount(['editRequests', 'reviews']);

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
            ]
        ]);
    }

    // Create & Store methods removed as per user request

    public function show(PhotoEditing $photoEditing)
    {
        return redirect()->route('admin.photo-editing.index');
    }

    public function edit(PhotoEditing $photoEditing)
    {
        return redirect()->route('admin.photo-editing.index');
    }

    public function update(Request $request, PhotoEditing $photoEditing)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'raw_folder_id' => 'required|string|max:255',
            'edited_folder_id' => 'nullable|string|max:255',
            'status' => 'required|in:pending,processing,done,cancelled',
        ]);

        $photoEditing->update($validated);

        return redirect()->back()->with('success', 'Photo Request updated successfully.');
    }

    public function destroy(PhotoEditing $photoEditing)
    {
        $photoEditing->delete();
        return redirect()->back()->with('success', 'Photo Request deleted successfully.');
    }
}
