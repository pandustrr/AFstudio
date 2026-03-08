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
        $requestedPhotoIds = $session->editRequests->flatMap(function ($request) {
            return collect($request->selected_photos)->pluck('id');
        })->unique()->values()->all();

        $requestedCount = count($requestedPhotoIds);

        // Get max editing quota from package
        $maxEditingQuota = 0;
        if ($session->booking && $session->booking->items->isNotEmpty()) {
            $maxEditingQuota = ($session->booking->items->first()->package->max_editing_quota ?? 0) + ($session->extra_editing_quota ?? 0);
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
                'review_template' => $item->package->review_template,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'uid' => $session->uid,
                'customer_name' => $session->customer_name,
                'has_raw' => !empty($session->raw_folder_id) && $session->is_raw_accessible,
                'has_edited' => !empty($session->edited_folder_id) && $session->is_edited_accessible,
                'status' => $session->status,
                'requested_count' => $requestedCount,
                'max_editing_quota' => $maxEditingQuota,
                'quota_request' => $session->quota_request,
                'extra_editing_quota' => $session->extra_editing_quota,
                'requested_photo_ids' => $requestedPhotoIds,
                'cancelled_photo_ids' => collect($session->cancelled_photos ?? [])->pluck('id')->all(),
                'edit_quota_remaining' => max(0, $maxEditingQuota - $requestedCount),
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
        $isAccessible = ($type === 'edited') ? $session->is_edited_accessible : $session->is_raw_accessible;

        if (!$isAccessible) {
            return response()->json(['error' => 'Akses folder ini telah dinonaktifkan oleh admin.'], 403);
        }

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
            $maxEditingQuota = ($session->booking->items->first()->package->max_editing_quota ?? 0) + ($session->extra_editing_quota ?? 0);
        }

        // Check if editing is allowed (0 = no editing allowed)
        if ($maxEditingQuota === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Paket Anda tidak memiliki akses untuk melakukan editing'
            ], 403);
        }

        // Calculate total photos already requested
        $previousRequestedCount = $session->editRequests->sum(function ($request) {
            return count($request->selected_photos ?? []);
        });

        $newCount = count($validated['selectedPhotos']);
        $totalCount = $previousRequestedCount + $newCount;

        // Check if photo quota exceeded
        if ($totalCount > $maxEditingQuota) {
            return response()->json([
                'success' => false,
                'message' => "Kuota Anda tidak mencukupi. Anda mencoba mengajukan {$newCount} foto, tetapi sisa kuota Anda hanya " . ($maxEditingQuota - $previousRequestedCount) . " foto."
            ], 403);
        }


        try {
            // Debugging: Log the incoming photo data
            \Illuminate\Support\Facades\Log::info("Incoming Edit Request for Session: {$session->uid}", [
                'photos_count' => $newCount,
                'total_new_count' => $totalCount,
                'max_quota' => $maxEditingQuota
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
                    'max_editing_quota' => $maxEditingQuota,
                    'edit_quota_remaining' => max(0, $maxEditingQuota - $refreshedRequestedCount),
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
            'additional_fields' => 'nullable|string', // Sent as JSON string via FormData
        ]);

        try {
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('reviews', 'public');
            }

            $additionalFields = null;
            if ($request->filled('additional_fields')) {
                $additionalFields = json_decode($request->additional_fields, true);
            }

            $review = Review::create([
                'photo_session_id' => $session->id,
                'review_text' => $validated['reviewText'],
                'additional_fields' => $additionalFields,
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
            'quota_request' => 'required|integer|min:1',
        ]);

        try {
            $session->increment('extra_editing_quota', $validated['quota_request']);

            // Get updated max quota
            $maxEditingQuota = 0;
            if ($session->booking && $session->booking->items->isNotEmpty()) {
                $maxEditingQuota = ($session->booking->items->first()->package->max_editing_quota ?? 0) + $session->extra_editing_quota;
            }

            // Calculate remaining
            $requestedCount = $session->editRequests->sum(function ($request) {
                return count($request->selected_photos ?? []);
            });

            return response()->json([
                'success' => true,
                'message' => 'Kuota editing berhasil ditambahkan!',
                'extra_editing_quota' => $session->extra_editing_quota,
                'max_editing_quota' => $maxEditingQuota,
                'edit_quota_remaining' => max(0, $maxEditingQuota - $requestedCount)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal mengirim permintaan kuota',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel a specific photo edit request
     */
    public function cancelPhoto(Request $request, $uid)
    {
        $session = PhotoEditing::where('uid', $uid)->first();
        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $photoId = $request->input('photoId');
        if (!$photoId) {
            return response()->json(['error' => 'Photo ID is required'], 400);
        }

        // Find the edit request containing this photo
        $editRequests = EditRequest::where('photo_session_id', $session->id)
            ->where('status', 'pending')
            ->get();

        $targetRequest = null;
        foreach ($editRequests as $req) {
            $photos = collect($req->selected_photos);
            if ($photos->contains('id', $photoId)) {
                $targetRequest = $req;
                break;
            }
        }

        if (!$targetRequest) {
            return response()->json(['error' => 'Permintaan edit tidak ditemukan atau sudah diproses admin.'], 404);
        }

        // Find the target photo details to log it
        $cancelledPhoto = collect($targetRequest->selected_photos)->firstWhere('id', $photoId);

        // Remove the photo from the array
        $updatedPhotos = collect($targetRequest->selected_photos)->filter(function ($p) use ($photoId) {
            return $p['id'] !== $photoId;
        })->values()->all();

        if (empty($updatedPhotos)) {
            $targetRequest->delete();
        } else {
            $targetRequest->update(['selected_photos' => $updatedPhotos]);
        }

        // Log to cancelled_photos in session
        $currentCancelled = $session->cancelled_photos ?? [];
        $currentCancelled[] = [
            'id' => $photoId,
            'name' => $cancelledPhoto['name'] ?? 'Unnamed',
            'cancelled_at' => now()->format('Y-m-d H:i:s'),
            'original_request_id' => $targetRequest->id
        ];
        $session->update(['cancelled_photos' => $currentCancelled]);

        // Recalculate everything for response
        $session->load('editRequests', 'booking.items.package');

        $requestedPhotoIds = $session->editRequests->flatMap(function ($request) {
            return collect($request->selected_photos)->pluck('id');
        })->unique()->values()->all();

        $requestedCount = count($requestedPhotoIds);
        $cancelledPhotoIds = collect($session->cancelled_photos ?? [])->pluck('id')->all();

        $maxEditingQuota = 0;
        if ($session->booking && $session->booking->items->isNotEmpty()) {
            $maxEditingQuota = ($session->booking->items->first()->package->max_editing_quota ?? 0) + ($session->extra_editing_quota ?? 0);
        }

        return response()->json([
            'success' => true,
            'message' => 'Permintaan edit dibatalkan.',
            'requested_photo_ids' => $requestedPhotoIds,
            'cancelled_photo_ids' => $cancelledPhotoIds,
            'requested_count' => $requestedCount,
            'edit_quota_remaining' => max(0, $maxEditingQuota - $requestedCount)
        ]);
    }

    /**
     * Cancel multiple specific photo edit requests
     */
    public function cancelMultiplePhotos(Request $request, $uid)
    {
        $session = PhotoEditing::where('uid', $uid)->with(['editRequests', 'booking.items.package'])->firstOrFail();
        $photoIds = (array) $request->input('photoIds', []);

        if (empty($photoIds)) {
            return response()->json(['success' => false, 'message' => 'Tidak ada foto yang dipilih untuk dibatalkan.']);
        }

        $allRequests = EditRequest::where('photo_session_id', $session->id)
            ->where('status', 'pending')
            ->get();

        $currentCancelled = $session->cancelled_photos ?? [];
        $affectedCount = 0;

        foreach ($photoIds as $photoId) {
            foreach ($allRequests as $targetRequest) {
                $photos = collect($targetRequest->selected_photos);
                $found = $photos->firstWhere('id', $photoId);

                if ($found) {
                    $updated = $photos->filter(fn($p) => $p['id'] !== $photoId)->values()->all();

                    if (empty($updated)) {
                        $targetRequest->delete();
                    } else {
                        $targetRequest->update(['selected_photos' => $updated]);
                    }

                    $currentCancelled[] = [
                        'id' => $photoId,
                        'name' => $found['name'] ?? 'Unnamed',
                        'cancelled_at' => now()->format('Y-m-d H:i:s'),
                        'original_request_id' => $targetRequest->id
                    ];
                    $affectedCount++;
                    break;
                }
            }
        }

        if ($affectedCount > 0) {
            $session->update(['cancelled_photos' => $currentCancelled]);
        }

        $session->load('editRequests');
        $requestedPhotoIds = $session->editRequests->flatMap(fn($r) => collect($r->selected_photos)->pluck('id'))->unique()->values()->all();
        $requestedCount = count($requestedPhotoIds);
        $maxEditingQuota = 0;
        if ($session->booking && $session->booking->items->isNotEmpty()) {
            $maxEditingQuota = ($session->booking->items->first()->package->max_editing_quota ?? 0) + ($session->extra_editing_quota ?? 0);
        }

        return response()->json([
            'success' => true,
            'message' => "{$affectedCount} foto berhasil dibatalkan.",
            'requested_photo_ids' => $requestedPhotoIds,
            'requested_count' => $requestedCount,
            'edit_quota_remaining' => max(0, $maxEditingQuota - $requestedCount)
        ]);
    }

    /**
     * Cancel all pending edit requests
     */
    public function cancelAllPhotos(Request $request, $uid)
    {
        $session = PhotoEditing::where('uid', $uid)->first();
        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Find all pending edit requests
        $editRequests = EditRequest::where('photo_session_id', $session->id)
            ->where('status', 'pending')
            ->get();

        if ($editRequests->isEmpty()) {
            return response()->json(['error' => 'Tidak ada permintaan pending untuk dibatalkan.'], 404);
        }

        $currentCancelled = $session->cancelled_photos ?? [];
        $cancelledAt = now()->format('Y-m-d H:i:s');

        foreach ($editRequests as $req) {
            $photos = $req->selected_photos ?? [];
            foreach ($photos as $photo) {
                $currentCancelled[] = [
                    'id' => $photo['id'] ?? null,
                    'name' => $photo['name'] ?? 'Unnamed',
                    'cancelled_at' => $cancelledAt,
                    'original_request_id' => $req->id
                ];
            }
            $req->delete();
        }

        $session->update(['cancelled_photos' => $currentCancelled]);

        // Recalculate for response
        $session->load('editRequests', 'booking.items.package');

        $requestedPhotoIds = $session->editRequests->flatMap(function ($request) {
            return collect($request->selected_photos)->pluck('id');
        })->unique()->values()->all();

        $requestedCount = count($requestedPhotoIds);
        $cancelledPhotoIds = collect($session->cancelled_photos ?? [])->pluck('id')->all();

        $maxEditingQuota = 0;
        if ($session->booking && $session->booking->items->isNotEmpty()) {
            $maxEditingQuota = ($session->booking->items->first()->package->max_editing_quota ?? 0) + ($session->extra_editing_quota ?? 0);
        }

        return response()->json([
            'success' => true,
            'message' => 'Semua permintaan edit berhasil dibatalkan.',
            'requested_photo_ids' => $requestedPhotoIds,
            'cancelled_photo_ids' => $cancelledPhotoIds,
            'requested_count' => $requestedCount,
            'edit_quota_remaining' => max(0, $maxEditingQuota - $requestedCount)
        ]);
    }
}
