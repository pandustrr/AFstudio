<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $uid = $request->header('X-Cart-UID') ?? $request->input('uid') ?? $request->query('uid') ?? $request->input('cart_uid') ?? $request->query('cart_uid');

        $query = Cart::with(['package.subCategory.category'])->latest();

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } elseif ($uid) {
            $query->where('cart_uid', $uid);
        } else {
            return Inertia::render('Cart/Index', ['carts' => []]);
        }

        return Inertia::render('Cart/Index', [
            'carts' => $query->get(),
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
            'room_id' => 'nullable|integer',
            'photographer_id' => 'nullable|exists:users,id',
            'session_ids' => 'nullable|array',
            'cart_uid' => 'required|string',
        ]);

        $package = \App\Models\PricelistPackage::with('subCategory.category')->findOrFail($request->pricelist_package_id);
        $type = $package->subCategory->category->type ?? 'room';

        $data = [
            'user_id' => Auth::id(),
            'cart_uid' => $request->cart_uid,
            'pricelist_package_id' => $request->pricelist_package_id,
            'quantity' => 1,
            'scheduled_date' => $request->scheduled_date,
        ];

        if ($type === 'photographer') {
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

            $first = $sessions->first();
            $last = $sessions->last();

            // Logic: start time of first session, end time is start of last + 30 min
            $startTime = \Carbon\Carbon::parse($first->start_time);
            $endTime = \Carbon\Carbon::parse($last->start_time)->addMinutes(30);

            $data['photographer_id'] = $request->photographer_id;
            $data['session_ids'] = $request->session_ids;
            $data['start_time'] = $startTime->format('H:i');
            $data['end_time'] = $endTime->format('H:i');
        } else {
            // Room Flow
            if (!$request->start_time) {
                return redirect()->back()->with('error', 'Silakan pilih jam.');
            }

            $duration = $package->duration ?? 60;
            $startTime = \Carbon\Carbon::parse($request->scheduled_date . ' ' . $request->start_time);
            $endTime = $startTime->copy()->addMinutes($duration);

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

            $data['room_id'] = $assignedRoom;
            $data['start_time'] = $request->start_time;
            $data['end_time'] = $endTime->format('H:i');
        }

        Cart::create($data);

        return redirect()->back()->with('success', 'Berhasil ditambahkan ke keranjang!');
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
}
