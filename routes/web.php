<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GoogleDrivePhotoController;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/selector-photo', function () {
    return Inertia::render('SelectorPhoto');
});

// Google Drive API routes
Route::prefix('api/google-drive')->group(function () {
    Route::get('/photos', [GoogleDrivePhotoController::class, 'index'])->name('google-drive.photos');
    Route::post('/selections', [GoogleDrivePhotoController::class, 'storeSelection'])->name('google-drive.selections');
});
