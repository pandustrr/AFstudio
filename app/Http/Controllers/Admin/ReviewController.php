<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\PhotoEditing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of all reviews
     */
    public function index()
    {
        $year = request('year');
        $month = request('month');
        $day = request('day');
        $filter = request('filter', 'all');

        $query = Review::with('photoEditing');

        // Apply Date Filters
        if ($year) {
            $query->whereYear('created_at', $year);
        }
        if ($month) {
            $query->whereMonth('created_at', $month);
        }
        if ($day) {
            $query->whereDay('created_at', $day);
        }

        // Retain existing filter logic for time ranges if no specific date is selected or as an alternative
        // However, user requested LIKE photo editing, which uses specific date dropdowns. 
        // We will prioritize the specific date filters if present.
        // If the 'filter' param is passed (legacy/buttons), we can still use it if needed, 
        // but typically the dropdowns replace the 'daily/weekly/monthly' buttons. 
        // Let's support both but specific dates take precedence or work alongside.

        if (!$year && !$month && !$day) {
            if ($filter === 'daily') {
                $query->whereDate('created_at', today());
            } elseif ($filter === 'weekly') {
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
            } elseif ($filter === 'monthly') {
                $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year);
            } elseif ($filter === 'yearly') {
                $query->whereYear('created_at', now()->year);
            }
        }

        $reviewsData = $query->latest()->get();

        $reviews = $reviewsData->map(function ($review) {
            return [
                'id' => $review->id,
                'review_text' => $review->review_text,
                'rating' => $review->rating,
                'photo_url' => $review->photo_path ? asset('storage/' . $review->photo_path) : null,
                'created_at' => $review->created_at->format('d M Y, H:i'),
                'is_visible' => (bool) $review->is_visible,
                'session' => [
                    'uid' => $review->photoEditing->uid,
                    'customer_name' => $review->photoEditing->customer_name,
                ],
            ];
        });

        // Calculate stats based on filtered data
        $averageRating = $reviewsData->avg('rating') ?: 0;
        $totalReviews = $reviewsData->count();

        // Get Available Options for Dropdowns
        $availableYears = Review::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        // Ensure current filtered year is in options
        if ($year && !in_array((int)$year, $availableYears)) {
            $availableYears[] = (int)$year;
            rsort($availableYears);
        }

        $availableMonths = [];
        if ($year) {
            $availableMonths = Review::whereYear('created_at', $year)
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

        $availableDays = [];
        if ($year && $month) {
            $availableDays = Review::whereYear('created_at', $year)
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

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'averageRating' => round($averageRating, 1),
            'totalReviews' => $totalReviews,
            'currentFilter' => $filter,
            'filters' => [
                'year' => $year,
                'month' => $month,
                'day' => $day,
            ],
            'options' => [
                'years' => $availableYears,
                'months' => $availableMonths,
                'days' => $availableDays
            ]
        ]);
    }

    /**
     * Display the specified review
     */
    public function show(Review $review)
    {
        $review->load('photoEditing');

        return Inertia::render('Admin/Reviews/Show', [
            'review' => [
                'id' => $review->id,
                'review_text' => $review->review_text,
                'rating' => $review->rating,
                'photo_url' => $review->photo_path ? asset('storage/' . $review->photo_path) : null,
                'created_at' => $review->created_at->format('d M Y, H:i'),
                'is_visible' => (bool) $review->is_visible,
                'session' => [
                    'id' => $review->photoEditing->id,
                    'uid' => $review->photoEditing->uid,
                    'customer_name' => $review->photoEditing->customer_name,
                    'status' => $review->photoEditing->status,
                ],
            ]
        ]);
    }

    /**
     * Toggle review visibility
     */
    public function toggleVisibility(Review $review)
    {
        $review->update([
            'is_visible' => !$review->is_visible
        ]);

        return back()->with('success', 'Status visibilitas review berhasil diperbarui.');
    }

    /**
     * Remove the specified review from storage
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review berhasil dihapus.');
    }
}
