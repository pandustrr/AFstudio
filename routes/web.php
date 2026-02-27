<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\PhotoSelectorController;
use App\Http\Controllers\Admin\PhotoEditingController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Public\CartController;
use App\Http\Controllers\Public\BookingController;
use App\Http\Controllers\Public\ScheduleController;

Route::get('/', [\App\Http\Controllers\Public\HomeController::class, 'index'])->name('home');
Route::post('/api/track', [\App\Http\Controllers\Admin\InsightController::class, 'track']);

Route::get('/selector-photo', function () {
    return Inertia::render('SelectorPhoto');
});

Route::get('/about', [\App\Http\Controllers\Public\PageController::class, 'about'])->name('about');
Route::get('/price-list', [\App\Http\Controllers\Public\PageController::class, 'pricelist'])->name('price-list');
Route::get('/review', [\App\Http\Controllers\PublicReviewController::class, 'index']);
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::get('/schedule/check', [ScheduleController::class, 'checkAvailability'])->name('schedule.check');
Route::get('/schedule/check-time', [ScheduleController::class, 'checkTimeAvailability'])->name('schedule.check-time');
Route::get('/schedule/photographer-slots', [ScheduleController::class, 'getPhotographerTimeSlots']);
Route::get('/schedule/check-photographer-availability', [ScheduleController::class, 'checkPhotographerAvailability']);
Route::get('/schedule/available-rooms', [ScheduleController::class, 'getAvailableRooms']);

// Shared / Locked Routes
Route::get('/share/SemuaKategori', [\App\Http\Controllers\SharedPricelistController::class, 'all'])->name('share.all');
Route::get('/share/c/{slug}', [\App\Http\Controllers\SharedPricelistController::class, 'category'])->name('share.category');
Route::get('/share/s/{slug}', [\App\Http\Controllers\SharedPricelistController::class, 'subCategory'])->name('share.subCategory');
Route::get('/share/p/{slug}', [\App\Http\Controllers\SharedPricelistController::class, 'package'])->name('share.package');

// Booking Routes (Guest & Auth)
Route::get('/checkout', [BookingController::class, 'create'])->name('booking.create');
Route::post('/checkout', [BookingController::class, 'store'])->name('booking.store');

use App\Http\Controllers\Public\PdfController;

Route::get('/booking/{code}', [BookingController::class, 'show'])->name('booking.show');
Route::get('/pdf/booking/{bookingCode}', [PdfController::class, 'bookingInvoice'])->name('booking.pdf');
Route::post('/checkout/upload-proof', [BookingController::class, 'uploadProof'])->name('checkout.upload-proof');
Route::get('/api/booking/{id}/proof-status', [BookingController::class, 'getProofStatus']);

// Referral Code API routes
Route::post('/api/referral-codes/validate', [\App\Http\Controllers\Admin\ReferralCodeController::class, 'validate']);

// Photo Selector API routes
Route::prefix('api/photo-selector')->group(function () {
    Route::get('/sessions/{uid}', [PhotoSelectorController::class, 'show']);
    Route::get('/sessions/{uid}/photos', [PhotoSelectorController::class, 'getPhotos']);
    Route::post('/sessions/{uid}/edit-request', [PhotoSelectorController::class, 'storeEditRequest']);
    Route::post('/sessions/{uid}/review', [PhotoSelectorController::class, 'storeReview']);
    Route::post('/sessions/{uid}/quota-request', [PhotoSelectorController::class, 'storeQuotaRequest']);
});

use App\Http\Controllers\Admin\EditorDashboardController;
use App\Http\Controllers\Admin\PhotographerDashboardController;

// Editor Routes
Route::prefix('editor')->group(function () {
    Route::get('/login', [\App\Http\Controllers\AuthController::class, 'showLogin'])->name('editor.login');
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('editor.logout');

    Route::middleware(['auth:editor', 'role:editor'])->group(function () {
        Route::get('/dashboard', [EditorDashboardController::class, 'index'])->name('editor.dashboard');

        Route::resource('photo-editing', PhotoEditingController::class)->names('editor.photo-editing');
        Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('editor.profile.edit');
        Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('editor.profile.update');
    });
});

// Photographer Routes
Route::prefix('photographer')->group(function () {
    Route::get('/login', [\App\Http\Controllers\AuthController::class, 'showLogin'])->name('photographer.login');
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('photographer.logout');

    Route::middleware(['auth:photographer', 'role:photographer'])->group(function () {
        Route::get('/dashboard', [PhotographerDashboardController::class, 'index'])->name('photographer.dashboard');

        Route::get('/sessions', [\App\Http\Controllers\Admin\PhotographerSessionController::class, 'index'])->name('photographer.sessions.index');
        Route::post('/sessions/toggle', [\App\Http\Controllers\Admin\PhotographerSessionController::class, 'toggle'])->name('photographer.sessions.toggle');
        Route::post('/sessions/mark', [\App\Http\Controllers\Admin\PhotographerSessionController::class, 'updateDateMark'])->name('photographer.sessions.mark');

        Route::get('/reservations', [\App\Http\Controllers\Admin\PhotographerSessionController::class, 'reservations'])->name('photographer.reservations');
        Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('photographer.profile.edit');
        Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('photographer.profile.update');
    });
});

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/login', [\App\Http\Controllers\AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

    Route::middleware(['auth:web', 'role:admin'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');

        // Settings
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('admin.settings.index');
        Route::patch('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('admin.settings.update');

        Route::resource('photo-editing', PhotoEditingController::class)->names('admin.photo-editing');
        Route::patch('/reviews/{review}/toggle', [\App\Http\Controllers\Admin\ReviewController::class, 'toggleVisibility'])->name('admin.reviews.toggle');
        Route::resource('reviews', ReviewController::class)->only(['index', 'show', 'destroy'])->names('admin.reviews');

        // Home Page
        Route::get('/home', [\App\Http\Controllers\Admin\HomePageController::class, 'index'])->name('admin.home.index');
        Route::post('/home', [\App\Http\Controllers\Admin\HomePageController::class, 'update'])->name('admin.home.update');
        Route::post('/home/gallery', [\App\Http\Controllers\Admin\HomePageController::class, 'storeGallery'])->name('admin.home.gallery.store');
        Route::patch('/home/gallery/{gallery}', [\App\Http\Controllers\Admin\HomePageController::class, 'updateGallery'])->name('admin.home.gallery.update');
        Route::delete('/home/gallery/{gallery}', [\App\Http\Controllers\Admin\HomePageController::class, 'destroyGallery'])->name('admin.home.gallery.destroy');
        Route::post('/home/journey', [\App\Http\Controllers\Admin\HomePageController::class, 'storeJourney'])->name('admin.home.journey.store');
        Route::patch('/home/journey/{journey}', [\App\Http\Controllers\Admin\HomePageController::class, 'updateJourney'])->name('admin.home.journey.update');
        Route::delete('/home/journey/{journey}', [\App\Http\Controllers\Admin\HomePageController::class, 'destroyJourney'])->name('admin.home.journey.destroy');

        // About & Pricelist
        Route::get('/about', [\App\Http\Controllers\Admin\AboutController::class, 'index'])->name('admin.about.index');
        Route::post('/about', [\App\Http\Controllers\Admin\AboutController::class, 'update'])->name('admin.about.update');
        Route::post('/about/moodboard', [\App\Http\Controllers\Admin\AboutController::class, 'storeMoodboard'])->name('admin.about.moodboard.store');
        Route::delete('/about/moodboard/{moodboard}', [\App\Http\Controllers\Admin\AboutController::class, 'destroyMoodboard'])->name('admin.about.moodboard.destroy');

        // Bookings
        Route::get('/bookings/{booking}/invoice', [\App\Http\Controllers\Admin\BookingController::class, 'downloadInvoice'])->name('admin.bookings.invoice');
        Route::resource('bookings', \App\Http\Controllers\Admin\BookingController::class)
            ->only(['index', 'show', 'update', 'destroy'])
            ->names('admin.bookings')
            ->parameters(['bookings' => 'booking']);
        Route::delete('/bookings/{booking}/payment-proof', [\App\Http\Controllers\Admin\BookingController::class, 'deletePaymentProof'])->name('admin.bookings.delete-payment-proof');
        Route::post('/bookings-bulk-delete', [\App\Http\Controllers\Admin\BookingController::class, 'bulkDelete'])->name('admin.bookings.bulk-delete');
        Route::post('/bookings-bulk-delete-proofs', [\App\Http\Controllers\Admin\BookingController::class, 'bulkDeleteProofs'])->name('admin.bookings.bulk-delete-proofs');
        Route::patch('/booking-items/{item}', [\App\Http\Controllers\Admin\BookingController::class, 'updateItem'])->name('admin.booking-items.update');

        Route::resource('photographers', \App\Http\Controllers\Admin\PhotographerController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('admin.photographers');

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

        // Photographer Sessions Admin Management
        Route::prefix('photographer-sessions')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\PhotographerSessionController::class, 'adminIndex'])->name('admin.photographer-sessions.index');
            Route::post('/offset', [\App\Http\Controllers\Admin\PhotographerSessionController::class, 'updateOffset'])->name('admin.photographer-sessions.offset');
            Route::post('/reschedule', [\App\Http\Controllers\Admin\PhotographerSessionController::class, 'reschedule'])->name('admin.photographer-sessions.reschedule');
            Route::post('/mark', [\App\Http\Controllers\Admin\PhotographerSessionController::class, 'updateDateMark'])->name('admin.photographer-sessions.mark');
        });

        // Referral Codes
        Route::resource('referral-codes', \App\Http\Controllers\Admin\ReferralCodeController::class)
            ->names('admin.referral-codes');

        // Insights
        Route::get('/insights', [\App\Http\Controllers\Admin\InsightController::class, 'index'])->name('admin.insights.index');
        Route::get('/insights/page', [\App\Http\Controllers\Admin\InsightController::class, 'pageDetails'])->name('admin.insights.page');

        Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('admin.profile.edit');
        Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('admin.profile.update');
    });
});

Route::get('/fix-storage', function () {
    try {
        if (file_exists(public_path('storage'))) {
            return "Folder 'public/storage' sudah ada. Jika gambar tetap tidak muncul, hapus folder 'storage' yang ada di dalam folder 'public' terlebih dahulu di cPanel.";
        }

        \Illuminate\Support\Facades\Artisan::call('storage:link');
        return "Storage Link Berhasil Dibuat!";
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
});

Route::get('/clear-everything', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('route:clear');
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        \Illuminate\Support\Facades\Artisan::call('view:clear');

        // Coba reset OPcache jika tersedia
        if (function_exists('opcache_reset')) {
            opcache_reset();
        }

        return "Semua cache (Route, Config, Cache, View) & OPcache BERHASIL dibersihkan! Silakan coba lagi fiturnya.";
    } catch (\Exception $e) {
        return "Gagal membersihkan cache: " . $e->getMessage();
    }
});

Route::get('/debug-controller', function () {
    $class = \App\Http\Controllers\Admin\BookingController::class;
    $reflection = new \ReflectionClass($class);
    $methods = array_map(fn($m) => $m->name, $reflection->getMethods());
    $filePath = $reflection->getFileName();
    $fileTime = date('Y-m-d H:i:s', filemtime($filePath));

    return [
        'class' => $class,
        'file_path' => $filePath,
        'last_modified' => $fileTime,
        'has_bulkDelete' => in_array('bulkDelete', $methods),
        'has_bulkDeleteProofs' => in_array('bulkDeleteProofs', $methods),
        'available_methods' => $methods
    ];
});
