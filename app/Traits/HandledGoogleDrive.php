<?php

namespace App\Traits;

use Google\Client;
use Google\Service\Drive;
use Illuminate\Support\Facades\Log;

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
                'id' => $file->id,
                'name' => $file->name,
                'thumbnail' => $file->thumbnailLink,
                'downloadLink' => $file->webContentLink,
                'isImage' => str_contains($file->mimeType, 'image/'),
            ];
        });
    }
}
