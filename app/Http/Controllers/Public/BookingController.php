<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function create(Request $request)
    {
        $uid = $request->header('X-Cart-UID') ?? $request->query('uid');

        $query = Cart::with(['package.subCategory.category']);

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } elseif ($uid) {
            $query->where('cart_uid', $uid);
        } else {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $carts = $query->get();

        // Filter out items where package might be missing (e.g. deleted)
        $carts = $carts->filter(function ($cart) {
            return $cart->package !== null;
        });

        if ($carts->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('Checkout/Create', [
            'carts' => $carts,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'location' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $uid = $request->header('X-Cart-UID') ?? $request->input('cart_uid');

            $query = Cart::with('package');
            if (Auth::check()) {
                $query->where('user_id', Auth::id());
            } elseif ($uid) {
                $query->where('cart_uid', $uid);
            } else {
                throw new \Exception('Identity not found (UID or Login required).');
            }

            $carts = $query->get();

            // Filter out invalid items (orphan carts)
            $validCarts = $carts->filter(fn($c) => $c->package !== null);

            if ($validCarts->isEmpty()) {
                throw new \Exception('Cart contains no valid items (products might have been changed). Please re-add items.');
            }

            $totalPrice = $validCarts->sum(function ($cart) {
                return $cart->quantity * ($cart->package->price_numeric ?? 0);
            });

            // Calculate Down Payment
            // 25% of Total, rounded up to nearest 1.000 (thousands) for easier transfer
            // Example: 793.750 -> 794.000
            $calculatedDP = ceil(($totalPrice * 0.25) / 1000) * 1000;

            if ($calculatedDP < 100000) {
                // If total is small (e.g. 50k), DP is full price.
                // Logic: Min(100k, Total) if 25% < 100k? 
                // Requirement: Min 100k. But if Total < 100k?
                // Let's assume Total matches. If Total < 100k, DP = Total.
                $calculatedDP = 100000;
            }

            if ($calculatedDP > $totalPrice) {
                $calculatedDP = $totalPrice;
            }

            $booking = Booking::create([
                'user_id' => Auth::id(),
                'guest_uid' => $uid,
                'name' => $request->name,
                'phone' => $request->phone,
                'booking_date' => now(), // Use current timestamp for the transaction date
                'location' => $request->location,
                'notes' => $request->notes,
                'total_price' => $totalPrice,
                'down_payment' => $calculatedDP,
                'status' => 'pending',
            ]);

            foreach ($validCarts as $cart) {
                BookingItem::create([
                    'booking_id' => $booking->id,
                    'pricelist_package_id' => $cart->pricelist_package_id,
                    'quantity' => $cart->quantity,
                    'price' => $cart->package->price_numeric ?? 0,
                    'subtotal' => $cart->quantity * ($cart->package->price_numeric ?? 0),
                    // Transfer schedule info from Cart to BookingItem
                    'scheduled_date' => $cart->scheduled_date,
                    'start_time' => $cart->start_time,
                    'end_time' => $cart->end_time,
                    'room_id' => $cart->room_id,
                ]);
            }

            // Clear Cart (All, including orphans to clean up)
            $query->delete();

            DB::commit();

            $redirectUrl = route('booking.show', $booking->booking_code);
            if ($uid && !Auth::check()) {
                $redirectUrl .= '?uid=' . $uid;
            }

            return redirect($redirectUrl)->with('success', 'Booking created successfully!');
        } catch (\Exception $e) {
            DB::rollback();
            // Log the error for debugging
            \Illuminate\Support\Facades\Log::error('Booking Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    public function show($code)
    {
        $booking = Booking::with(['items.package.subCategory'])->where('booking_code', $code)->firstOrFail();

        $uid = request()->header('X-Cart-UID') ?? request()->query('uid');

        // Ensure user owns this booking
        if ($booking->user_id) {
            if ($booking->user_id !== Auth::id()) {
                abort(403);
            }
        } elseif ($booking->guest_uid) {
            if ($booking->guest_uid !== $uid) {
                // Allow if code is shareable? Requirement says UID is used to see it.
                // But usually booking_code is enough if it's unique and secret.
                // Let's stick to UID if guest.
                abort(403);
            }
        }

        return Inertia::render('Checkout/Show', [
            'booking' => $booking,
        ]);
    }
}
