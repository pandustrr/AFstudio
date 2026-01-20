<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InsightController extends Controller
{
    public function index(Request $request)
    {
        // Filter berdasarkan tanggal (default: 30 hari terakhir)
        $days = $request->input('days', 30);
        $startDate = now()->subDays($days)->toDateString();

        // Total unique daily visitors (distinct devices per day)
        $totalViews = PageView::where('viewed_date', '>=', $startDate)
            ->distinct('device_hash')
            ->count('device_hash');

        // Total unique visitors (berdasarkan distinct device_hash dalam periode)
        $uniqueVisitors = PageView::where('viewed_date', '>=', $startDate)
            ->distinct('device_hash')
            ->count('device_hash');

        // Views per page (dikelompokkan berdasarkan page_name, dengan unique daily device count)
        $viewsByPage = PageView::select('page_name', DB::raw('count(distinct device_hash) as views'))
            ->where('viewed_date', '>=', $startDate)
            ->groupBy('page_name')
            ->orderBy('views', 'desc')
            ->get();

        // Views per day (untuk chart - unique devices per day)
        $viewsByDay = PageView::select(
                'viewed_date as date',
                DB::raw('count(distinct device_hash) as views')
            )
            ->where('viewed_date', '>=', $startDate)
            ->groupBy('viewed_date')
            ->orderBy('viewed_date', 'asc')
            ->get();

        // Top 10 URLs (dengan unique daily device count)
        $topUrls = PageView::select('url', 'page_name', DB::raw('count(distinct device_hash) as views'))
            ->where('viewed_date', '>=', $startDate)
            ->groupBy('url', 'page_name')
            ->orderBy('views', 'desc')
            ->limit(10)
            ->get();

        // Recent page views
        $recentViews = PageView::with('user')
            ->latest('viewed_at')
            ->limit(20)
            ->get();

        $data = [
            'stats' => [
                'totalViews' => $totalViews,
                'uniqueVisitors' => $uniqueVisitors,
                'viewsByPage' => $viewsByPage,
                'viewsByDay' => $viewsByDay,
                'topUrls' => $topUrls,
                'recentViews' => $recentViews,
            ],
            'filters' => [
                'days' => $days,
            ],
        ];

        // Log untuk debugging
        \Log::info('Insights Data:', $data);

        return Inertia::render('Admin/Insights/Index', $data);
    }

    public function pageDetails(Request $request, string $pageName)
    {
        $days = $request->input('days', 30);
        $startDate = now()->subDays($days);

        $pageViews = PageView::where('page_name', $pageName)
            ->where('viewed_at', '>=', $startDate)
            ->with('user')
            ->latest('viewed_at')
            ->paginate(50);

        $totalViews = PageView::where('page_name', $pageName)
            ->where('viewed_at', '>=', $startDate)
            ->count();

        $uniqueVisitors = PageView::where('page_name', $pageName)
            ->where('viewed_at', '>=', $startDate)
            ->distinct('ip_address')
            ->count('ip_address');

        return Inertia::render('Admin/Insights/PageDetails', [
            'pageName' => $pageName,
            'pageViews' => $pageViews,
            'stats' => [
                'totalViews' => $totalViews,
                'uniqueVisitors' => $uniqueVisitors,
            ],
            'filters' => [
                'days' => $days,
            ],
        ]);
    }
}
