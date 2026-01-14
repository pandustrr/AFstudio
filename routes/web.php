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

Route::get('/about', [\App\Http\Controllers\Public\PageController::class, 'about'])->name('about');
Route::get('/price-list', [\App\Http\Controllers\Public\PageController::class, 'pricelist'])->name('price-list');
Route::get('/review', [\App\Http\Controllers\PublicReviewController::class, 'index']);

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
        Route::patch('/reviews/{review}/toggle', [\App\Http\Controllers\Admin\ReviewController::class, 'toggleVisibility'])->name('admin.reviews.toggle');
        Route::resource('reviews', ReviewController::class)->only(['index', 'show', 'destroy'])->names('admin.reviews');

        // About & Pricelist
        Route::get('/about', [\App\Http\Controllers\Admin\AboutController::class, 'index'])->name('admin.about.index');
        Route::post('/about', [\App\Http\Controllers\Admin\AboutController::class, 'update'])->name('admin.about.update');

        Route::prefix('pricelist')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\PricelistController::class, 'index'])->name('admin.pricelist.index');

            // Category
            Route::post('/category', [\App\Http\Controllers\Admin\PricelistController::class, 'storeCategory'])->name('admin.pricelist.category.store');
            Route::put('/category/{category}', [\App\Http\Controllers\Admin\PricelistController::class, 'updateCategory'])->name('admin.pricelist.category.update');
            Route::delete('/category/{category}', [\App\Http\Controllers\Admin\PricelistController::class, 'destroyCategory'])->name('admin.pricelist.category.destroy');

            // SubCategory
            Route::post('/sub-category', [\App\Http\Controllers\Admin\PricelistController::class, 'storeSubCategory'])->name('admin.pricelist.sub-category.store');
            Route::put('/sub-category/{subCategory}', [\App\Http\Controllers\Admin\PricelistController::class, 'updateSubCategory'])->name('admin.pricelist.sub-category.update');
            Route::delete('/sub-category/{subCategory}', [\App\Http\Controllers\Admin\PricelistController::class, 'destroySubCategory'])->name('admin.pricelist.sub-category.destroy');

            // Package
            Route::post('/package', [\App\Http\Controllers\Admin\PricelistController::class, 'storePackage'])->name('admin.pricelist.package.store');
            Route::put('/package/{package}', [\App\Http\Controllers\Admin\PricelistController::class, 'updatePackage'])->name('admin.pricelist.package.update');
            Route::delete('/package/{package}', [\App\Http\Controllers\Admin\PricelistController::class, 'destroyPackage'])->name('admin.pricelist.package.destroy');
        });
    });
});
