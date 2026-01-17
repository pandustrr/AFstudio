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
    public function index()
    {
        $carts = Auth::user()->carts()->with(['package.subCategory.category'])->latest()->get();

        return Inertia::render('Cart/Index', [
            'carts' => $carts,
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
            'start_time' => 'required|date_format:H:i',
            'room_id' => 'nullable|integer|in:1,2,3',
        ]);

        $package = \App\Models\PricelistPackage::findOrFail($request->pricelist_package_id);
        $duration = $package->duration ?? 60;
        
        $startTime = \Carbon\Carbon::parse($request->scheduled_date . ' ' . $request->start_time);
        $endTime = $startTime->copy()->addMinutes($duration);
        
        $assignedRoom = $request->room_id;
        
        // If room_id provided, validate only that room
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
                return redirect()->back()->with('error', 'Sorry, Room ' . $assignedRoom . ' is already booked for this time slot.');
            }
        } else {
            // Smart Slotting Fallback
            for ($roomId = 1; $roomId <= 3; $roomId++) {
                $isRoomTaken = \App\Models\BookingItem::whereHas('booking', function ($q) {
                        $q->whereIn('status', ['pending', 'confirmed', 'completed']);
                    })
                    ->where('scheduled_date', $request->scheduled_date)
                    ->where('room_id', $roomId)
                    ->where(function ($query) use ($request, $endTime) {
                         $query->where('start_time', '<', $endTime->format('H:i:s'))
                               ->where('end_time', '>', $request->start_time);
                    })
                    ->exists();

                if (!$isRoomTaken) {
                    $assignedRoom = $roomId;
                    break;
                }
            }
        }
        
        if (!$assignedRoom) {
             return redirect()->back()->with('error', 'Sorry, no rooms are available at this time. Please select another slot.');
        }

        Cart::create([
            'user_id' => Auth::id(),
            'pricelist_package_id' => $request->pricelist_package_id,
            'quantity' => 1,
            'scheduled_date' => $request->scheduled_date,
            'start_time' => $request->start_time,
            'end_time' => $endTime->format('H:i'),
            'room_id' => $assignedRoom,
        ]);

        return redirect()->back()->with('success', 'Item and Schedule added to cart successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', Auth::id())->where('id', $id)->firstOrFail();
        
        $cart->update([
            'quantity' => $request->quantity
        ]);

        return redirect()->back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cart = Cart::where('user_id', Auth::id())->where('id', $id)->firstOrFail();
        $cart->delete();

        return redirect()->back()->with('success', 'Item removed from cart.');
    }
}
