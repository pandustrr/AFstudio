<?php

namespace App\Http\Controllers;

use App\Models\PhotoEditing;
use App\Models\EditRequest;
use App\Models\Review;
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Drive;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class GoogleDrivePhotoController extends Controller
{
    private function getDriveService()
    {
        $client = new Client();
        $client->setAuthConfig(storage_path('app/google/drive.json'));
        $client->addScope(Drive::DRIVE_READONLY);
        return new Drive($client);
    }

    /**
     * Validate UID and get photo session data
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateUid(Request $request)
    {
        $validated = $request->validate([
            'uid' => 'required|string',
        ]);

        try {
            $photoSession = PhotoEditing::where('uid', $validated['uid'])->first();

            if (!$photoSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'UID tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'UID valid',
                'data' => [
                    'uid' => $photoSession->uid,
                    'customer_name' => $photoSession->customer_name,
                    'raw_folder_id' => $photoSession->raw_folder_id,
                    'edited_folder_id' => $photoSession->edited_folder_id,
                    'status' => $photoSession->status,
                    'has_edited_photos' => !empty($photoSession->edited_folder_id),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Validate UID Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat validasi UID',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get list of photos from Google Drive folder
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $folderId = $request->query('folderId');

        if (!$folderId) {
            return response()->json(['error' => 'Folder ID is required'], 400);
        }

        $forceRefresh = $request->query('refresh') === 'true';
        $cacheKey = "gdrive_photos_" . md5($folderId);

        if ($forceRefresh) {
            Cache::forget($cacheKey);
        }

        try {
            $photos = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($folderId) {
                $service = $this->getDriveService();

                $optParams = [
                    'pageSize' => 1000,
                    'fields' => 'nextPageToken, files(id, name, thumbnailLink, webContentLink)',
                    'q' => "'{$folderId}' in parents and trashed = false and (mimeType contains 'image/')"
                ];

                $results = $service->files->listFiles($optParams);
                $files = $results->getFiles();

                return collect($files)->map(function ($file) {
                    return [
                        'id' => $file->id,
                        'name' => $file->name,
                        'thumbnail' => $file->thumbnailLink,
                        'downloadLink' => $file->webContentLink,
                    ];
                })->toArray();
            });

            return response()->json([
                'success' => true,
                'count' => count($photos),
                'photos' => $photos
            ]);
        } catch (\Exception $e) {
            Log::error('Google Drive Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Gagal mengambil foto dari Google Drive',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store edit request from user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeEditRequest(Request $request)
    {
        $validated = $request->validate([
            'uid' => 'required|string',
            'selected_photos' => 'required|array',
            'selected_photos.*' => 'string',
        ]);

        try {
            // Find photo session by UID
            $photoSession = PhotoEditing::where('uid', $validated['uid'])->first();

            if (!$photoSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'UID tidak ditemukan'
                ], 404);
            }


            // Create edit request
            $editRequest = EditRequest::create([
                'photo_session_id' => $photoSession->id,
                'selected_photos' => $validated['selected_photos'],
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan edit berhasil dikirim. Estimasi pengerjaan 7-14 hari kerja.',
                'data' => [
                    'edit_request_id' => $editRequest->id,
                    'selected_count' => count($validated['selected_photos']),
                    'status' => $editRequest->status,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Store Edit Request Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan permintaan edit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store review from user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeReview(Request $request)
    {
        $validated = $request->validate([
            'uid' => 'required|string',
            'review_text' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        try {
            // Find photo session by UID
            $photoSession = PhotoEditing::where('uid', $validated['uid'])->first();

            if (!$photoSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'UID tidak ditemukan'
                ], 404);
            }

            // Create review
            $review = Review::create([
                'photo_session_id' => $photoSession->id,
                'review_text' => $validated['review_text'],
                'rating' => $validated['rating'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Terima kasih atas review Anda!',
                'data' => [
                    'review_id' => $review->id,
                    'rating' => $review->rating,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Store Review Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if edited photos are available
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkEditedPhotosStatus(Request $request)
    {
        $validated = $request->validate([
            'uid' => 'required|string',
        ]);

        try {
            $photoSession = PhotoEditing::where('uid', $validated['uid'])->first();

            if (!$photoSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'UID tidak ditemukan'
                ], 404);
            }

            $isAvailable = !empty($photoSession->edited_folder_id);

            return response()->json([
                'success' => true,
                'is_available' => $isAvailable,
                'message' => $isAvailable
                    ? 'Foto hasil edit tersedia'
                    : 'Foto hasil edit belum tersedia',
                'edited_folder_id' => $isAvailable ? $photoSession->edited_folder_id : null,
            ]);
        } catch (\Exception $e) {
            Log::error('Check Edited Photos Status Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
