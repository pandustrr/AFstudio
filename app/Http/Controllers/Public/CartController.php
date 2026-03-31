<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $uid = $request->header('X-Cart-UID') ?? $request->input('uid') ?? $request->query('uid') ?? $request->input('cart_uid') ?? $request->query('cart_uid');

        // Get current cart items
        $query = Cart::with(['package.subCategory.category'])->latest();

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } elseif ($uid) {
            $query->where('cart_uid', $uid);
        }

        $carts = $query->get();

        // Get transaction history (completed bookings) - always fetch regardless of cart status
        $transactionHistoryQuery = Booking::query();

        if ($uid) {
            $transactionHistoryQuery->where('guest_uid', $uid);
        } elseif (Auth::check()) {
            $transactionHistoryQuery->where('user_id', Auth::id());
        } else {
            $transactionHistoryQuery = Booking::whereRaw('1 = 0'); // Return empty if no identifier
        }

        $transactionHistory = $transactionHistoryQuery
            ->with(['items.package.subCategory.category', 'paymentProof'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Cart/Index', [
            'carts' => $carts,
            'transactionHistory' => $transactionHistory,
            'uid' => $uid,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pricelist_package_id' => 'required|exists:pricelist_packages,id',
            'quantity' => 'nullable|integer|min:1',
            'scheduled_date' => 'required|date|after_or_equal:today',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'room_id' => 'nullable|integer',
            'photographer_id' => 'nullable|exists:users,id',
            'session_ids' => 'nullable|array',
            'sessions_needed' => 'nullable|integer|min:1',
            'room_name' => 'nullable|string',
            'cart_uid' => 'required|string',
            'selected_times' => 'nullable|array',
        ]);

        $package = \App\Models\PricelistPackage::with('subCategory.category')->findOrFail($request->pricelist_package_id);
        $type = $package->subCategory->category->type ?? 'room';

        Log::info('Cart Store Debug', [
            'package_id' => $request->pricelist_package_id,
            'package_name' => $package->name,
            'category_type' => $type,
            'has_start_time' => $request->has('start_time'),
            'has_end_time' => $request->has('end_time'),
            'has_photographer_id' => $request->has('photographer_id'),
            'request_data' => $request->all()
        ]);

        // SMART TYPE DETECTION: If start_time + end_time provided, it's a ROOM booking
        if ($request->has('start_time') && $request->has('end_time') && !$request->has('photographer_id')) {
            $type = 'room';
            Log::info('Auto-detected ROOM booking based on payload');
        }

        $data = [
            'user_id' => Auth::id(),
            'cart_uid' => $request->cart_uid,
            'pricelist_package_id' => $request->pricelist_package_id,
            'quantity' => 1,
            'scheduled_date' => $request->scheduled_date,
        ];

        if ($type === 'photographer') {
            // New flow: split session or auto-assign or manual
            if ($request->has('selected_times') && !empty($request->selected_times)) {
                // Split session flow
                $sessionIds = \App\Models\PhotographerSession::where('photographer_id', $request->photographer_id)
                    ->where('date', $request->scheduled_date)
                    ->whereIn('start_time', collect($request->selected_times)->map(fn($t) => $t . ':00'))
                    ->pluck('id')
                    ->toArray();

                if (count($sessionIds) !== count($request->selected_times)) {
                    return redirect()->back()->with('error', 'Beberapa sesi tidak valid atau sudah tidak tersedia.');
                }

                $data['photographer_id'] = $request->photographer_id;
                $data['session_ids'] = $sessionIds;
                $data['room_name'] = $request->room_name;
                $data['selected_times'] = $request->selected_times;
 
                // For customized sessions, we need to respect the override times
                $sessions = \App\Models\PhotographerSession::whereIn('id', $sessionIds)
                    ->orderBy('start_time')
                    ->get();
                
                $first = $sessions->first();
                $last = $sessions->last();
                $times = collect($request->selected_times)->sort();
 
                $data['start_time'] = ($first && $first->is_customized && $first->override_start_time) 
                    ? substr($first->override_start_time, 0, 5) 
                    : $times->first();
                
                $data['end_time'] = ($last && $last->is_customized && $last->override_end_time) 
                    ? substr($last->override_end_time, 0, 5) 
                    : \Carbon\Carbon::parse($times->last())->addMinutes(30)->format('H:i');
                
                $data['sessions_needed'] = count($sessionIds);
            } elseif ($request->has('sessions_needed')) {
                // Auto-assign flow
                if (!$request->start_time || !$request->sessions_needed) {
                    return redirect()->back()->with('error', 'Silakan pilih waktu mulai.');
                }
 
                $sessionsNeeded = $request->sessions_needed;
                
                // Get the actual session records to check for overrides
                $slots = [];
                $t = \Carbon\Carbon::createFromTimeString($request->start_time);
                for ($i = 0; $i < $sessionsNeeded; $i++) {
                    $slots[] = $t->format('H:i:s');
                    $t->addMinutes(30);
                }
 
                $sessions = \App\Models\PhotographerSession::where('photographer_id', $request->photographer_id)
                    ->where('date', $request->scheduled_date)
                    ->whereIn('start_time', $slots)
                    ->orderBy('start_time')
                    ->get();
                
                $first = $sessions->first();
                $last = $sessions->last();
 
                $startTimeStr = ($first && $first->is_customized && $first->override_start_time)
                    ? substr($first->override_start_time, 0, 5)
                    : $request->start_time;
                
                $endTimeStr = ($last && $last->is_customized && $last->override_end_time)
                    ? substr($last->override_end_time, 0, 5)
                    : \Carbon\Carbon::parse($request->start_time)->addMinutes($sessionsNeeded * 30)->format('H:i');
 
                $data['start_time'] = $startTimeStr;
                $data['end_time'] = $endTimeStr;
                $data['sessions_needed'] = $sessionsNeeded;
                $data['photographer_id'] = $request->photographer_id;
                $data['room_name'] = $request->room_name;
                $data['selected_times'] = $request->selected_times;
            } else {
                // Old flow: photographer_id + session_ids (legacy support)
                if (!$request->photographer_id || empty($request->session_ids)) {
                    return redirect()->back()->with('error', 'Silakan pilih fotografer dan sesi.');
                }

                // Fetch sessions to determine start and end time for display
                $sessions = \App\Models\PhotographerSession::whereIn('id', $request->session_ids)
                    ->orderBy('start_time')
                    ->get();

                if ($sessions->isEmpty()) {
                    return redirect()->back()->with('error', 'Sesi tidak valid.');
                }

                // Validate all sessions are still available (open status)
                if ($sessions->where('status', '!=', 'open')->count() > 0) {
                    return redirect()->back()->with('error', 'Beberapa sesi sudah di-booking customer lain. Silakan pilih sesi yang lain.');
                }

                // Check if any of these sessions are already in cart with same cart_uid
                $existingCartWithSessions = \App\Models\Cart::where('cart_uid', $request->cart_uid)
                    ->whereNotNull('session_ids')
                    ->get();

                foreach ($existingCartWithSessions as $existingCart) {
                    $existingSessions = $existingCart->session_ids ?? [];
                    $newSessions = $request->session_ids ?? [];
                    $overlap = array_intersect($existingSessions, $newSessions);
                    if (!empty($overlap)) {
                        return redirect()->back()->with('error', 'Sesi ini sudah ada di keranjang Anda.');
                    }
                }

                $first = $sessions->first();
                $last = $sessions->last();

                // Logic: start time of first session, end time is start of last + 30 min
                $startTime = \Carbon\Carbon::parse($first->start_time);
                $endTime = \Carbon\Carbon::parse($last->start_time)->addMinutes(30);

                $data['photographer_id'] = $request->photographer_id;
                $data['session_ids'] = $request->session_ids;
                $data['room_name'] = $request->room_name;
                $data['start_time'] = $startTime->format('H:i');
                $data['end_time'] = $endTime->format('H:i');
            }
        } else {
            // ROOM FLOW - Default for non-photographer packages
            Log::info('Processing ROOM booking', [
                'type' => $type,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time
            ]);
            // Room Flow
            if (!$request->start_time) {
                return redirect()->back()->with('error', 'Silakan pilih jam mulai.');
            }

            // Use customer-provided end_time or calculate from duration
            if ($request->end_time) {
                $startTime = \Carbon\Carbon::parse($request->scheduled_date . ' ' . $request->start_time);
                $endTime = \Carbon\Carbon::parse($request->scheduled_date . ' ' . $request->end_time);
            } else {
                $duration = $package->duration ?? 60;
                $startTime = \Carbon\Carbon::parse($request->scheduled_date . ' ' . $request->start_time);
                $endTime = $startTime->copy()->addMinutes($duration);
            }

            $assignedRoom = $request->room_id;

            // Room validation (already exists in original code, but cleaned up)
            if ($assignedRoom) {
                $isRoomTaken = \App\Models\BookingItem::whereHas('booking', function ($q) {
                    $q->whereIn('status', ['pending', 'confirmed', 'completed']);
                })
                    ->where('scheduled_date', $request->scheduled_date)
                    ->where('room_id', $assignedRoom)
                    ->where(function ($query) use ($request, $endTime) {
                        $query->where('start_time', '<', $endTime->format('H:i:s'))
                            ->where('end_time', '>', $request->start_time);
                    })
                    ->exists();

                if ($isRoomTaken) {
                    return redirect()->back()->with('error', 'Maaf, Ruangan ' . $assignedRoom . ' sudah ter-booking pada jam tersebut.');
                }
            } else {
                // Smart Slotting
                $rooms = \App\Models\Room::all();
                foreach ($rooms as $room) {
                    $isRoomTaken = \App\Models\BookingItem::whereHas('booking', function ($q) {
                        $q->whereIn('status', ['pending', 'confirmed', 'completed']);
                    })
                        ->where('scheduled_date', $request->scheduled_date)
                        ->where('room_id', $room->id)
                        ->where(function ($query) use ($request, $endTime) {
                            $query->where('start_time', '<', $endTime->format('H:i:s'))
                                ->where('end_time', '>', $request->start_time);
                        })
                        ->exists();

                    if (!$isRoomTaken) {
                        $assignedRoom = $room->id;
                        break;
                    }
                }
            }

            if (!$assignedRoom) {
                return redirect()->back()->with('error', 'Maaf, tidak ada ruangan tersedia pada jam ini.');
            }

            // Auto-assign photographer who is available in this time window
            $assignedPhotographer = null;
            $sessionIds = [];
            $photographers = \App\Models\User::where('role', 'photographer')->get();

            foreach ($photographers as $photographer) {
                // Calculate sessions needed (30 minutes per session)
                $durationInMinutes = abs($endTime->diffInMinutes($startTime));
                $sessionsNeeded = ceil($durationInMinutes / 30);

                // Generate required time slots (H:i:s format)
                $slots = [];
                $time = $startTime->copy();
                for ($i = 0; $i < $sessionsNeeded; $i++) {
                    $slots[] = $time->format('H:i:s');
                    $time->addMinutes(30);
                }

                // Check if photographer has all required sessions available
                $availableSessions = $photographer->sessions()
                    ->where('date', $request->scheduled_date)
                    ->whereIn('start_time', $slots)
                    ->where('status', 'open')
                    ->get();

                if ($availableSessions->count() === count($slots)) {
                    $assignedPhotographer = $photographer->id;
                    $sessionIds = $availableSessions->pluck('id')->toArray();
                    break;
                }
            }

            if (!$assignedPhotographer) {
                return redirect()->back()->with('error', 'Maaf, tidak ada fotografer tersedia pada jam ini.');
            }

            $data['room_id'] = $assignedRoom;
            $data['room_name'] = \App\Models\Room::find($assignedRoom)?->label; // Using label for display
            $data['photographer_id'] = $assignedPhotographer;
            $data['session_ids'] = $sessionIds;
            $data['start_time'] = $request->start_time;
            $data['end_time'] = $endTime->format('H:i');
            $data['selected_times'] = $request->selected_times;
        }

        $cart = Cart::create($data);

        // Flash ID barang yang baru dibuat agar frontend bisa mengisolasinya
        return redirect()->back()->with([
            'success' => 'Berhasil ditambahkan ke keranjang!',
            'last_added_id' => $cart->id
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $uid = $request->header('X-Cart-UID') ?? $request->input('cart_uid') ?? $request->input('uid');

        $query = Cart::query();
        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('cart_uid', $uid);
        }

        $cart = $query->where('id', $id)->firstOrFail();

        $cart->update([
            'quantity' => $request->quantity
        ]);

        return redirect()->back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $uid = $request->header('X-Cart-UID') ?? $request->input('cart_uid') ?? $request->query('cart_uid') ?? $request->input('uid') ?? $request->query('uid');

        $query = Cart::query();
        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('cart_uid', $uid);
        }

        $cart = $query->where('id', $id)->firstOrFail();
        $cart->delete();

        return redirect()->back()->with('success', 'Item removed from cart.');
    }

    /**
     * Migrate cart items from one UID to another.
     */
    public function migrate(Request $request)
    {
        $request->validate([
            'old_uid' => 'required|string',
            'new_uid' => 'required|string',
        ]);

        Cart::where('cart_uid', $request->old_uid)
            ->update(['cart_uid' => $request->new_uid]);

        // Also update any photographer sessions that were locked by this UID
        \App\Models\PhotographerSession::where('cart_uid', $request->old_uid)
            ->update(['cart_uid' => $request->new_uid]);

        return redirect()->back()->with('success', 'Cart migrated successfully.');
    }
}
