<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::with('photoEditing')
            ->latest()
            ->paginate(12) // Pagination for public view
            ->through(function ($review) {
                return [
                    'id' => $review->id,
                    'review_text' => $review->review_text,
                    'rating' => $review->rating,
                    'photo_url' => $review->photo_path ? asset('storage/' . $review->photo_path) : null,
                    'created_at' => $review->created_at->format('d M Y'),
                    'customer_name' => $review->photoEditing->customer_name,
                    'customer_initial' => substr($review->photoEditing->customer_name, 0, 1),
                ];
            });

        return Inertia::render('Review', [
            'reviews' => $reviews,
        ]);
    }
}
