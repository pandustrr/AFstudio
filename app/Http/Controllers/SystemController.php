<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SystemController extends Controller
{
    /**
     * Clear all server-side application cache
     */
    public function clearServerCache()
    {
        try {
            Artisan::call('optimize:clear');
            
            return response()->json([
                'status' => 'success',
                'message' => 'Server cache (Routes, Views, Config, Data) has been cleared successfully.',
                'output' => Artisan::output()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear client-side browser cache for this site specifically
     */
    public function clearDeviceCache()
    {
        // This header instructs the browser to wipe all local data for this origin
        return response('Browser cache and local data for AFstudio have been cleared. You will be logged out.')
            ->header('Clear-Site-Data', '"cache", "cookies", "storage"')
            ->header('Refresh', '3; url=/'); // Redirect to home after 3 seconds
    }
}
