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

        // Only show items that are NOT direct buy in the main cart list
        $query->where('is_direct', false);

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
            'is_direct' => 'nullable|boolean',
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
            'is_direct' => $request->boolean('is_direct'),
        ];

        // STABILISASI ID: Menggunakan ID yang sudah ada jika ini adalah Direct Buy
        // Ini mencegah "Order Summary Kosong" karena ID yang patah saat pindah halaman
        $existingDirect = null;
        if ($request->boolean('is_direct')) {
            $existingDirect = Cart::where('cart_uid', $request->cart_uid)
                ->where('is_direct', true)
                ->first();
        }

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

            // PERFORMANCE BYPASS: If room_id is already provided from frontend (e.g. from Availability Grid),
            // we trust it and skip the expensive search loop.
            if (!$assignedRoom) {
                // Smart Slotting (Only run if room_id is not provided)
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

            // OPTIMASI: Pastikan sesi fotografer ditemukan secara efisien
            $durationInMinutes = abs($endTime->diffInMinutes($startTime));
            $sessionsNeeded = ceil($durationInMinutes / 30);
            
            $slots = [];
            $time = $startTime->copy();
            for ($i = 0; $i < $sessionsNeeded; $i++) {
                $slots[] = $time->format('H:i:s');
                $time->addMinutes(30);
            }

            $assignedPhotographer = $request->photographer_id;
            $sessionIds = [];

            // Jika photographer_id dikirim (Direct Buy/Grid Selection), langsung cari sesi miliknya
            if ($assignedPhotographer) {
                $sessionIds = \App\Models\PhotographerSession::where('photographer_id', $assignedPhotographer)
                    ->where('date', $request->scheduled_date)
                    ->whereIn('start_time', $slots)
                    ->pluck('id')
                    ->toArray();
                
                // Cari alternatif jika ID yang diberikan tidak memiliki sesi open (seharusnya jarang terjadi)
                if (count($sessionIds) < count($slots)) {
                    $assignedPhotographer = null;
                }
            }

            // Fallback cari otomatis (Smart Slotting) jika ID tidak ada atau tidak valid
            if (!$assignedPhotographer) {
                $availablePhotographer = \App\Models\User::where('role', 'photographer')
                    ->whereHas('sessions', function($q) use ($request, $slots) {
                        $q->where('date', $request->scheduled_date)
                          ->whereIn('start_time', $slots)
                          ->where('status', 'open');
                    }, '=', count($slots))
                    ->first();
                
                if ($availablePhotographer) {
                    $assignedPhotographer = $availablePhotographer->id;
                    $sessionIds = $availablePhotographer->sessions()
                        ->where('date', $request->scheduled_date)
                        ->whereIn('start_time', $slots)
                        ->pluck('id')
                        ->toArray();
                }
            }

            if ($assignedPhotographer) {
                // If we found a photographer (either via bypass or search), use their sessions
                $data['photographer_id'] = $assignedPhotographer;
                $data['session_ids'] = $sessionIds;
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

        // Check for existing identical item in cart to prevent duplicates
        $query = Cart::where('pricelist_package_id', $data['pricelist_package_id'])
            ->where('scheduled_date', $data['scheduled_date'])
            ->where('photographer_id', $data['photographer_id'] ?? null)
            ->where('is_direct', $data['is_direct']);

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('cart_uid', $data['cart_uid']);
        }

        // Check for exact match of selected_times
        $existing = $query->get()->filter(function($c) use ($data) {
            $existingTimes = is_array($c->selected_times) ? $c->selected_times : json_decode($c->selected_times, true);
            $newTimes = is_array($data['selected_times']) ? $data['selected_times'] : json_decode($data['selected_times'], true);
            
            if (empty($existingTimes) && empty($newTimes)) return true;
            if (count($existingTimes ?? []) !== count($newTimes ?? [])) return false;
            
            sort($existingTimes);
            sort($newTimes);
            return $existingTimes === $newTimes;
        })->first();

        // Jika ini adalah Direct Buy, kita SELALU mengupdate item direct yang sudah ada
        // agar ID-nya tetap sama (mencegah broken summary link)
        if ($data['is_direct'] && $existingDirect) {
            $existingDirect->update($data);
            $cart = $existingDirect;
        } elseif ($existing) {
            $existing->update($data);
            $cart = $existing;
        } else {
            $cart = Cart::create($data);
        }

        // OPTIMASI: Jika ini adalah Direct Buy, langsung arahkan ke checkout dari server
        // Ini memangkas 1 round-trip (POST -> Back -> Visit Checkout menjadi hanya POST -> Redirect Checkout)
        if ($request->boolean('is_direct')) {
            return redirect()->to("/checkout?uid={$cart->cart_uid}&cart_item_id={$cart->id}");
        }

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

        $query = Cart::where('id', $id);
        
        if (Auth::check()) {
            $query->where(function($q) use ($uid) {
                $q->where('user_id', Auth::id())
                  ->orWhere('cart_uid', $uid);
            });
        } else {
            $query->where('cart_uid', $uid);
        }

        $cart = $query->firstOrFail();

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

        $query = Cart::where('id', $id);
        
        if (Auth::check()) {
            $query->where(function($q) use ($uid) {
                $q->where('user_id', Auth::id())
                  ->orWhere('cart_uid', $uid);
            });
        } else {
            $query->where('cart_uid', $uid);
        }

        $cart = $query->firstOrFail();
        $cart->delete();

        return redirect()->back()->with('success', 'Item removed from cart.');
    }

    /**
     * Migrate specific cart items from one UID to another.
     */
    public function migrate(Request $request)
    {
        Log::info('--- CART MIGRATION ATTEMPT ---');
        Log::info('Payload:', $request->all());

        try {
            $request->validate([
                'old_uid' => 'required|string',
                'new_uid' => 'required|string',
                'item_ids' => 'required|array',
            ]);

            $items = Cart::where('cart_uid', $request->old_uid)
                ->whereIn('id', $request->item_ids)
                ->get();

            Log::info('Items found for migration: ' . $items->count());

            foreach ($items as $item) {
                $old = $item->cart_uid;
                $item->update(['cart_uid' => $request->new_uid]);
                Log::info("Migrated item {$item->id}: {$old} -> {$request->new_uid}");
                
                if (!empty($item->session_ids)) {
                    $sessionCount = \App\Models\PhotographerSession::where('cart_uid', $request->old_uid)
                        ->whereIn('id', $item->session_ids)
                        ->update(['cart_uid' => $request->new_uid]);
                    Log::info("Migrated {$sessionCount} sessions for item {$item->id}");
                }
            }

            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true, 
                    'message' => 'Migrated ' . $items->count() . ' items',
                    'count' => $items->count()
                ]);
            }

            return redirect()->back()->with('success', 'Migration success.');
        } catch (\Exception $e) {
            Log::error('Migration Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
