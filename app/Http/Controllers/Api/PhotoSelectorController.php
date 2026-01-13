<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PhotoEditing;
use App\Models\EditRequest;
use App\Models\Review;
use App\Traits\HandledGoogleDrive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PhotoSelectorController extends Controller
{
    use HandledGoogleDrive;

    /**
     * Validate UID and return session details
     */
    public function show(Request $request, $uid)
    {
        $session = PhotoEditing::where('uid', $uid)->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'UID tidak ditemukan. Silakan cek kembali atau hubungi admin.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'uid' => $session->uid,
                'customer_name' => $session->customer_name,
                'has_raw' => !empty($session->raw_folder_id),
                'has_edited' => !empty($session->edited_folder_id),
                'status' => $session->status,
                'max_edit_requests' => $session->max_edit_requests,
            ]
        ]);
    }

    /**
     * Get photos from folder based on type
     */
    public function getPhotos(Request $request, $uid)
    {
        $type = $request->query('type'); // 'raw' or 'edited'
        $session = PhotoEditing::where('uid', $uid)->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $folderId = ($type === 'edited') ? $session->edited_folder_id : $session->raw_folder_id;

        if (!$folderId) {
            return response()->json(['error' => 'Folder ID not set'], 400);
        }

        try {
            $photos = $this->listPhotosFromFolder($folderId);
            return response()->json([
                'success' => true,
                'count' => count($photos),
                'photos' => $photos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal mengambil foto',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store edit request
     */
    public function storeEditRequest(Request $request, $uid)
    {
        $session = PhotoEditing::where('uid', $uid)->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $validated = $request->validate([
            'selectedPhotos' => 'required|array',
        ]);

        if (count($validated['selectedPhotos']) > $session->max_edit_requests) {
            return response()->json([
                'error' => "Maksimal pilihan foto adalah {$session->max_edit_requests}"
            ], 422);
        }

        try {
            $editRequest = EditRequest::create([
                'photo_session_id' => $session->id,
                'selected_photos' => $validated['selectedPhotos'],
                'status' => 'pending',
            ]);

            // Update session status if needed
            $session->update(['status' => 'processing']);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan edit sedang diproses (estimasi 7–14 hari kerja)',
                'data' => $editRequest
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal menyimpan permintaan edit',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store review
     */
    public function storeReview(Request $request, $uid)
    {
        $session = PhotoEditing::where('uid', $uid)->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $validated = $request->validate([
            'reviewText' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        try {
            $review = Review::create([
                'photo_session_id' => $session->id,
                'review_text' => $validated['reviewText'],
                'rating' => $validated['rating'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Terima kasih atas ulasan Anda!',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal menyimpan ulasan',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
