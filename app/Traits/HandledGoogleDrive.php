<?php

namespace App\Traits;

use Google\Client;
use Google\Service\Drive;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

trait HandledGoogleDrive
{
    protected function getDriveService()
    {
        try {
            $client = new Client();
            $client->setAuthConfig(storage_path('app/google/drive.json'));
            $client->addScope(Drive::DRIVE_READONLY);
            return new Drive($client);
        } catch (\Exception $e) {
            Log::error('Google Drive Service Init Error: ' . $e->getMessage());
            throw $e;
        }
    }

    protected function extractFolderId($input)
    {
        if (empty($input)) return null;

        // If it looks like a full URL with /folders/ID
        if (preg_match('/folders\/([a-zA-Z0-9-_]+)/', $input, $matches)) {
            return $matches[1];
        }

        // If it's a sharing link like drive.google.com/.../ID
        if (str_contains($input, 'drive.google.com')) {
            $parts = explode('/', rtrim($input, '/'));
            return end($parts);
        }

        return $input;
    }

    protected function listPhotosFromFolder($folderId)
    {
        $folderId = $this->extractFolderId($folderId);
        $service = $this->getDriveService();

        $optParams = [
            'pageSize' => 1000,
            'fields' => 'nextPageToken, files(id, name, thumbnailLink, webContentLink, mimeType)',
            'q' => "'{$folderId}' in parents and trashed = false and (mimeType contains 'image/')"
        ];

        $results = $service->files->listFiles($optParams);
        $files = $results->getFiles();

        return collect($files)->map(function ($file) {
            return [
                'id'           => $file->id,
                'name'         => $file->name,
                'thumbnail'    => $file->thumbnailLink,  // used as fallback
                'thumbnailUrl' => url("/api/photo-selector/thumbnail/{$file->id}"),
                'downloadLink' => $file->webContentLink,
                'isImage'      => str_contains($file->mimeType, 'image/'),
            ];
        });
    }

    protected function getFileMetadata($fileId)
    {
        $service = $this->getDriveService();
        return $service->files->get($fileId, [
            'fields'            => 'id, name, mimeType, size',
            'supportsAllDrives' => true,
        ]);
    }

    /**
     * Proxy a thumbnail from Google Drive through the server.
     * Needed because thumbnailLink URLs require Google authentication.
     */
    protected function streamThumbnailProxy($fileId)
    {
        $service = $this->getDriveService();

        $file = $service->files->get($fileId, [
            'fields'            => 'id, thumbnailLink',
            'supportsAllDrives' => true,
        ]);

        $thumbUrl = $file->getThumbnailLink();
        if (!$thumbUrl) {
            return response()->json(['error' => 'Thumbnail not available'], 404);
        }

        $thumbUrl = preg_replace('/=s\d+$/', '=s400', $thumbUrl);

        $httpClient = $service->getClient()->authorize();
        $response   = $httpClient->get($thumbUrl);

        $contentType = $response->getHeaderLine('Content-Type') ?: 'image/jpeg';
        $body        = $response->getBody();

        return response()->stream(function () use ($body) {
            while (!$body->eof()) {
                echo $body->read(8192);
                flush();
            }
        }, 200, [
            'Content-Type'  => $contentType,
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    /**
     * Stream full-quality file from Google Drive using service account.
     * Streams in 8KB chunks to keep memory usage low.
     */
    protected function streamFileToResponse($fileId)
    {
        $service = $this->getDriveService();
        $file    = $this->getFileMetadata($fileId);

        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $fileName = $file->getName();
        $fileSize = $file->getSize();

        // Download from Drive using alt=media (raw bytes)
        $driveResponse = $service->files->get($fileId, ['alt' => 'media']);
        $body          = $driveResponse->getBody();

        $headers = [
            'Content-Type'        => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . addslashes($fileName) . '"',
            'Cache-Control'       => 'no-cache, no-store, must-revalidate',
            'Pragma'              => 'no-cache',
            'Expires'             => '0',
        ];

        // Include Content-Length so browser can show download progress bar
        if ($fileSize) {
            $headers['Content-Length'] = $fileSize;
        }

        return response()->stream(function () use ($body) {
            // Stream in 8KB chunks — memory safe for large files
            while (!$body->eof()) {
                echo $body->read(8192);
                flush();
            }
        }, 200, $headers);
    }
}
