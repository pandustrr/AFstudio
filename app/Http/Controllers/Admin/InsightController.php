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
        // Filter berdasarkan tanggal
        $days = $request->input('days');
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');

        // Build date filter
        $query = PageView::query();

        if ($year && $month && $day) {
            // Specific date
            $startDate = "$year-$month-$day";
            $endDate = "$year-$month-$day";
            $query->whereDate('viewed_date', '=', $startDate);
        } elseif ($year && $month) {
            // Specific month
            $startDate = "$year-$month-01";
            $endDate = date('Y-m-t', strtotime($startDate));
            $query->whereBetween('viewed_date', [$startDate, $endDate]);
        } elseif ($year) {
            // Specific year
            $startDate = "$year-01-01";
            $endDate = "$year-12-31";
            $query->whereBetween('viewed_date', [$startDate, $endDate]);
        } elseif ($days) {
            // Last N days
            $startDate = now()->subDays($days)->toDateString();
            $query->where('viewed_date', '>=', $startDate);
        } else {
            // Default: 30 hari terakhir
            $days = 30;
            $startDate = now()->subDays(30)->toDateString();
            $query->where('viewed_date', '>=', $startDate);
        }

        // Total unique daily visitors
        $totalViews = (clone $query)->distinct('device_hash')->count('device_hash');

        // Total unique visitors
        $uniqueVisitors = (clone $query)->distinct('device_hash')->count('device_hash');

        // Views per page
        $viewsByPage = (clone $query)
            ->select('page_name', DB::raw('count(distinct device_hash) as views'))
            ->groupBy('page_name')
            ->orderBy('views', 'desc')
            ->get();

        // Views per day (untuk chart)
        $viewsByDay = (clone $query)
            ->select(
                'viewed_date as date',
                DB::raw('count(distinct device_hash) as views')
            )
            ->groupBy('viewed_date')
            ->orderBy('viewed_date', 'asc')
            ->get();

        // Top 10 URLs
        $topUrls = (clone $query)
            ->select('url', 'page_name', DB::raw('count(distinct device_hash) as views'))
            ->groupBy('url', 'page_name')
            ->orderBy('views', 'desc')
            ->limit(10)
            ->get();

        // Recent interactions (non-pageview events)
        $recentInteractions = \App\Models\Interaction::with('user')
            ->where('event_type', '!=', 'page_view')
            ->latest()
            ->limit(15)
            ->get();

        // Event distribution
        $eventStatsQuery = \App\Models\Interaction::select('event_type', DB::raw('count(*) as count'))
            ->groupBy('event_type');

        if (isset($startDate)) {
            $eventStatsQuery->where('created_at', '>=', $startDate);
        }

        $eventStats = $eventStatsQuery->get();

        // Recent page views
        $recentViews = PageView::with('user')
            ->latest('viewed_at')
            ->limit(20)
            ->get();

        // Filter options
        $filterOptions = [
            'years' => range(date('Y'), date('Y') - 5),
            'months' => range(1, 12),
            'days' => range(1, 31),
        ];

        $monthNames = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        $data = [
            'stats' => [
                'totalViews' => $totalViews,
                'uniqueVisitors' => $uniqueVisitors,
                'viewsByPage' => $viewsByPage,
                'viewsByDay' => $viewsByDay,
                'topUrls' => $topUrls,
                'recentViews' => $recentViews,
                'recentInteractions' => $recentInteractions,
                'eventStats' => $eventStats,
            ],
            'filters' => [
                'days' => $days,
                'year' => $year,
                'month' => $month,
                'day' => $day,
            ],
            'filterOptions' => $filterOptions,
            'monthNames' => $monthNames,
        ];

        // Log untuk debugging
        \Illuminate\Support\Facades\Log::info('Insights Data:', $data);

        return Inertia::render('Admin/Insights/Index', $data);
    }

    public function pageDetails(Request $request)
    {
        $pageName = $request->input('page');
        $days = $request->input('days');
        $year = $request->input('year');
        $month = $request->input('month');
        $day = $request->input('day');

        if (!$pageName) {
            return redirect()->route('admin.insights.index');
        }

        // Build date filter
        $query = PageView::where('page_name', $pageName);

        if ($year && $month && $day) {
            $startDate = "$year-$month-$day";
            $query->whereDate('viewed_date', '=', $startDate);
        } elseif ($year && $month) {
            $startDate = "$year-$month-01";
            $endDate = date('Y-m-t', strtotime($startDate));
            $query->whereBetween('viewed_date', [$startDate, $endDate]);
        } elseif ($year) {
            $startDate = "$year-01-01";
            $endDate = "$year-12-31";
            $query->whereBetween('viewed_date', [$startDate, $endDate]);
        } elseif ($days) {
            $startDate = now()->subDays($days)->toDateString();
            $query->where('viewed_date', '>=', $startDate);
        } else {
            $days = 30;
            $startDate = now()->subDays(30)->toDateString();
            $query->where('viewed_date', '>=', $startDate);
        }

        $pageViews = $query->with('user')
            ->orderBy('viewed_at', 'desc')
            ->paginate(50);

        // Filter options (same as index)
        $filterOptions = [
            'years' => range(date('Y'), date('Y') - 5),
            'months' => range(1, 12),
            'days' => range(1, 31),
        ];

        $monthNames = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        return Inertia::render('Admin/Insights/PageDetails', [
            'pageName' => $pageName,
            'pageViews' => $pageViews,
            'filters' => [
                'days' => $days,
                'year' => $year,
                'month' => $month,
                'day' => $day,
            ],
            'filterOptions' => $filterOptions,
            'monthNames' => $monthNames,
        ]);
    }

    public function track(Request $request)
    {
        $validated = $request->validate([
            'event_type' => 'required|string',
            'page_name' => 'nullable|string',
            'url' => 'nullable|string',
            'item_id' => 'nullable|string',
            'item_name' => 'nullable|string',
            'payload' => 'nullable|array',
        ]);

        $ip = $request->ip();
        $ua = $request->header('User-Agent');
        $deviceHash = md5($ip . $ua);

        \App\Models\Interaction::create([
            'event_type' => $validated['event_type'],
            'page_name' => $validated['page_name'],
            'url' => $validated['url'] ?? $request->header('Referer'),
            'item_id' => $validated['item_id'],
            'item_name' => $validated['item_name'],
            'payload' => $validated['payload'],
            'ip_address' => $ip,
            'user_agent' => $ua,
            'device_hash' => $deviceHash,
            'user_id' => \Illuminate\Support\Facades\Auth::id(),
            'session_id' => $request->session()->getId(),
        ]);

        return response()->json(['status' => 'success']);
    }
}
