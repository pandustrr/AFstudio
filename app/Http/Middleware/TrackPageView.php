<?php

namespace App\Http\Middleware;

use App\Models\PageView;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageView
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Hanya track GET requests dan bukan request AJAX
        if ($request->isMethod('GET') && !$request->ajax()) {
            try {
                $this->trackPageView($request);
            } catch (\Exception $e) {
                // Log error tapi jangan crash aplikasi
                \Log::error('Failed to track page view: ' . $e->getMessage());
            }
        }

        return $response;
    }

    private function trackPageView(Request $request): void
    {
        // Tentukan nama halaman berdasarkan route atau URL
        $pageName = $this->determinePageName($request);

        // Generate device hash dari IP + User Agent
        $deviceHash = $this->generateDeviceHash($request);
        $viewedDate = now()->toDateString();

        // Check apakah sudah ada record untuk halaman+device+tanggal ini
        $existingView = PageView::where('page_name', $pageName)
            ->where('device_hash', $deviceHash)
            ->where('viewed_date', $viewedDate)
            ->first();

        // Jika sudah ada record hari ini untuk device ini, update saja waktu terakhir
        if ($existingView) {
            $existingView->update([
                'viewed_at' => now(),
            ]);
            return;
        }

        // Jika belum ada, buat record baru
        PageView::create([
            'page_name' => $pageName,
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device_hash' => $deviceHash,
            'viewed_date' => $viewedDate,
            'user_id' => auth()->id(),
            'viewed_at' => now(),
        ]);
    }

    private function generateDeviceHash(Request $request): string
    {
        $ip = $request->ip();
        $userAgent = $request->userAgent();
        
        // Jika user login, gunakan user_id untuk lebih akurat
        if (auth()->check()) {
            return hash('sha256', auth()->id() . '_' . now()->toDateString());
        }
        
        // Jika tidak login, gunakan kombinasi IP + User Agent
        return hash('sha256', $ip . '|' . $userAgent);
    }

    private function determinePageName(Request $request): string
    {
        $routeName = $request->route()?->getName();
        
        // Mapping nama route ke nama halaman yang lebih friendly
        $pageMapping = [
            'home' => 'Home',
            'about' => 'About',
            'price-list' => 'Price List',
            'pricelist' => 'Price List',
            'pricelist.show' => 'Price List Detail',
            'booking.create' => 'Booking',
            'review' => 'Review',
            'cart.index' => 'Cart',
            'photo-editing' => 'Photo Editing',
        ];

        if ($routeName && isset($pageMapping[$routeName])) {
            return $pageMapping[$routeName];
        }

        // Fallback ke path URL
        $path = trim($request->path(), '/');
        return $path ?: 'Home';
    }
}
