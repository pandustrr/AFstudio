<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GoogleDrivePhotoController extends Controller
{
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
            // Get Google Drive API key from environment
            $apiKey = env('GOOGLE_DRIVE_API_KEY');

            if (!$apiKey) {
                return response()->json(['error' => 'Google Drive API key not configured'], 500);
            }

            // Call Google Drive API to list files in folder
            $response = Http::get('https://www.googleapis.com/drive/v3/files', [
                'q' => "'{$folderId}' in parents and (mimeType contains 'image/' or fileExtension='jpg' or fileExtension='jpeg' or fileExtension='png')",
                'key' => $apiKey,
                'fields' => 'files(id, name, mimeType, thumbnailLink, webContentLink)',
                'pageSize' => 1000
            ]);

            if ($response->failed()) {
                return response()->json([
                    'error' => 'Failed to fetch photos from Google Drive',
                    'details' => $response->json()
                ], $response->status());
            }

            $files = $response->json()['files'] ?? [];

            // Transform the data to include thumbnail URLs
            $photos = collect($files)->map(function ($file) {
                return [
                    'id' => $file['id'],
                    'name' => $file['name'],
                    'mimeType' => $file['mimeType'] ?? 'image/jpeg',
                    'thumbnail' => $file['thumbnailLink'] ?? null,
                    'downloadLink' => "https://drive.google.com/uc?export=download&id={$file['id']}",
                    'viewLink' => "https://drive.google.com/file/d/{$file['id']}/view"
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'count' => count($photos),
                'photos' => $photos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while fetching photos',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get direct image URL for a specific file
     *
     * @param string $fileId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFileUrl($fileId)
    {
        try {
            $apiKey = env('GOOGLE_DRIVE_API_KEY');

            if (!$apiKey) {
                return response()->json(['error' => 'Google Drive API key not configured'], 500);
            }

            // Get file metadata
            $response = Http::get("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                'key' => $apiKey,
                'fields' => 'id, name, mimeType, thumbnailLink, webContentLink, webViewLink'
            ]);

            if ($response->failed()) {
                return response()->json(['error' => 'File not found'], 404);
            }

            $file = $response->json();

            return response()->json([
                'success' => true,
                'file' => [
                    'id' => $file['id'],
                    'name' => $file['name'],
                    'thumbnail' => $file['thumbnailLink'] ?? null,
                    'downloadLink' => "https://drive.google.com/uc?export=download&id={$file['id']}",
                    'viewLink' => $file['webViewLink'] ?? null
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
