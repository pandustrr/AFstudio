<?php

namespace App\Http\Controllers;

use App\Models\PhotoSelection;
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Drive;
use Illuminate\Support\Facades\Log;

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

        try {
            $service = $this->getDriveService();

            $optParams = [
                'pageSize' => 1000,
                'fields' => 'nextPageToken, files(id, name, thumbnailLink, webContentLink)',
                'q' => "'{$folderId}' in parents and trashed = false and (mimeType contains 'image/')"
            ];

            $results = $service->files->listFiles($optParams);
            $files = $results->getFiles();

            $photos = collect($files)->map(function ($file) {
                return [
                    'id' => $file->id,
                    'name' => $file->name,
                    'thumbnail' => $file->thumbnailLink,
                    'downloadLink' => $file->webContentLink,
                ];
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
     * Store photo selection from user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeSelection(Request $request)
    {
        $validated = $request->validate([
            'uid' => 'required|string',
            'driveType' => 'required|string',
            'selectedPhotos' => 'required|array',
            'review' => 'nullable|string',
        ]);

        try {
            $selection = PhotoSelection::create([
                'uid' => $validated['uid'],
                'drive_type' => $validated['driveType'],
                'selected_photos' => $validated['selectedPhotos'],
                'review' => $validated['review'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pilihan foto berhasil disimpan',
                'data' => $selection
            ]);
        } catch (\Exception $e) {
            Log::error('Store Selection Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Gagal menyimpan pilihan foto',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
