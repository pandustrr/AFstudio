<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\PhotoSelectorController;
use App\Http\Controllers\Admin\PhotoEditingController;
use App\Http\Controllers\Admin\ReviewController;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/selector-photo', function () {
    return Inertia::render('SelectorPhoto');
});

// Photo Selector API routes
Route::prefix('api/photo-selector')->group(function () {
    Route::get('/sessions/{uid}', [PhotoSelectorController::class, 'show']);
    Route::get('/sessions/{uid}/photos', [PhotoSelectorController::class, 'getPhotos']);
    Route::post('/sessions/{uid}/edit-request', [PhotoSelectorController::class, 'storeEditRequest']);
    Route::post('/sessions/{uid}/review', [PhotoSelectorController::class, 'storeReview']);
});

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/login', [\App\Http\Controllers\AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

        Route::resource('photo-editing', PhotoEditingController::class)->names('admin.photo-editing');
        Route::resource('reviews', ReviewController::class)->only(['index', 'show', 'destroy'])->names('admin.reviews');
    });
});
