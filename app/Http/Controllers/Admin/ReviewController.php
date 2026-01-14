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
        $query = Review::with('photoEditing')->latest();
        $filter = request('filter', 'all');

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

        // Clone query for stats to avoid modifying the main query if we needed to do pagination later, 
        // though currently we are doing get(). But calculating avg on the filtered set is correct.
        // We can just use the collection methods if the dataset is small, or clone query for efficiency on large datasets.
        // For now, let's execute the query to get reviews first.

        $reviewsData = $query->get();

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

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'averageRating' => round($averageRating, 1),
            'totalReviews' => $totalReviews,
            'currentFilter' => $filter,
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
