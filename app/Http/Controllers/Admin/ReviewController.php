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
        $reviews = Review::with('photoEditing')
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'review_text' => $review->review_text,
                    'rating' => $review->rating,
                    'created_at' => $review->created_at->format('d M Y, H:i'),
                    'session' => [
                        'uid' => $review->photoEditing->uid,
                        'customer_name' => $review->photoEditing->customer_name,
                    ],
                ];
            });

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews
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
                'created_at' => $review->created_at->format('d M Y, H:i'),
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
     * Remove the specified review from storage
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review berhasil dihapus.');
    }
}
