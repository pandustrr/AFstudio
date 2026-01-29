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
        $session = PhotoEditing::where('uid', $uid)->with(['editRequests', 'booking.items.package'])->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'UID tidak ditemukan. Silakan cek kembali atau hubungi admin.'
            ], 404);
        }

        // Calculate total photos already requested
        $requestedCount = $session->editRequests->sum(function ($request) {
            return count($request->selected_photos ?? []);
        });

        // Get max editing quota from package
        $maxEditingQuota = 0;
        if ($session->booking && $session->booking->items->isNotEmpty()) {
            $maxEditingQuota = $session->booking->items->first()->package->max_editing_quota ?? 0;
        }

        // Fetch associated booking info (if any)
        $booking = \App\Models\Booking::where('guest_uid', $uid)->with('items.package')->first();
        $bookingDetail = null;
        if ($booking && $booking->items->isNotEmpty()) {
            $item = $booking->items->first();
            $bookingDetail = [
                'package_name' => $item->package->name,
                'scheduled_date' => $item->scheduled_date, // Raw string YYYY-MM-DD
                'start_time' => $item->start_time,
                'end_time' => $item->end_time,
                'room_id' => $item->room_id,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'uid' => $session->uid,
                'customer_name' => $session->customer_name,
                'has_raw' => !empty($session->raw_folder_id),
                'has_edited' => !empty($session->edited_folder_id),
                'status' => $session->status,
                'requested_count' => $requestedCount,
                'max_editing_quota' => $maxEditingQuota,
                'quota_request' => $session->quota_request,
                'booking' => $bookingDetail,
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
        $session = PhotoEditing::where('uid', $uid)->with(['editRequests', 'booking.items.package'])->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $validated = $request->validate([
            'selectedPhotos' => 'required|array',
        ]);

        // Get max editing quota from package
        $maxEditingQuota = 0;
        if ($session->booking && $session->booking->items->isNotEmpty()) {
            $maxEditingQuota = $session->booking->items->first()->package->max_editing_quota ?? 0;
        }

        // Check if editing is allowed (0 = no editing allowed)
        if ($maxEditingQuota === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Paket Anda tidak memiliki akses untuk melakukan editing'
            ], 403);
        }

        // Calculate total edit requests already made
        $totalEditRequestsMade = $session->editRequests->count();

        // Check if quota exceeded
        if ($totalEditRequestsMade >= $maxEditingQuota) {
            return response()->json([
                'success' => false,
                'message' => "Anda sudah mencapai batas maksimal editing ({$maxEditingQuota}x). Tidak bisa membuat permintaan edit baru."
            ], 403);
        }

        // Calculate total photos already requested
        $previousRequestedCount = $session->editRequests->sum(function ($request) {
            return count($request->selected_photos ?? []);
        });

        $newCount = count($validated['selectedPhotos']);
        $totalCount = $previousRequestedCount + $newCount;


        try {
            // Debugging: Log the incoming photo data
            \Illuminate\Support\Facades\Log::info("Incoming Edit Request for Session: {$session->uid}", [
                'photos_count' => $newCount,
                'total_new_count' => $totalCount,
                'edit_quota_remaining' => ($maxEditingQuota - $totalEditRequestsMade - 1)
            ]);

            $editRequest = EditRequest::create([
                'photo_session_id' => $session->id,
                'selected_photos' => $validated['selectedPhotos'],
                'status' => 'pending',
            ]);

            // Ensure status is processing
            if ($session->status === 'pending') {
                $session->update(['status' => 'processing']);
            }

            // Refresh session to get updated counts
            $session->load('editRequests');
            $refreshedRequestedCount = $session->editRequests->sum(function ($request) {
                return count($request->selected_photos ?? []);
            });
            $editRequestsCount = $session->editRequests->count();

            return response()->json([
                'success' => true,
                'message' => 'Permintaan edit sedang diproses (estimasi 7–14 hari kerja)',
                'data' => $editRequest,
                'session' => [
                    'requested_count' => $refreshedRequestedCount,
                    'edit_requests_made' => $editRequestsCount,
                    'edit_quota_remaining' => max(0, $maxEditingQuota - $editRequestsCount),
                    'status' => $session->status,
                ]
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
            'rating' => 'required|integer|min:1|max:5',
            'photo' => 'nullable|image|max:5120', // Max 5MB
        ]);

        try {
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('reviews', 'public');
            }

            $review = Review::create([
                'photo_session_id' => $session->id,
                'review_text' => $validated['reviewText'],
                'rating' => $validated['rating'],
                'photo_path' => $photoPath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Terima kasih ulasannya!',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal menyimpan ulasan',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Store quota request
     */
    public function storeQuotaRequest(Request $request, $uid)
    {
        $session = PhotoEditing::where('uid', $uid)->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $validated = $request->validate([
            'quota_request' => 'required|string|max:255',
        ]);

        try {
            $session->update([
                'quota_request' => $validated['quota_request'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan kuota telah dikirim ke admin!',
                'quota_request' => $session->quota_request
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal mengirim permintaan kuota',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
