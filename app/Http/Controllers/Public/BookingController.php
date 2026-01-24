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
            'rooms' => \App\Models\Room::all(),
            'photographers' => \App\Models\User::where('role', 'photographer')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'university' => 'nullable|string|max:255',
            'domicile' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'referral_code' => 'nullable|string',
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

            // Handle referral code and discount
            $referralCode = null;
            $discountAmount = 0;

            if ($request->filled('referral_code')) {
                $referralCode = \App\Models\ReferralCode::where('code', strtoupper($request->referral_code))->first();

                if ($referralCode && $referralCode->isValid()) {
                    $discountAmount = $referralCode->calculateDiscount($totalPrice);
                    $referralCode->incrementUsage();
                }
            }

            $finalPrice = $totalPrice - $discountAmount;

            // Calculate Down Payment
            // 25% of Total, rounded up to nearest 1.000 (thousands) for easier transfer
            // Example: 793.750 -> 794.000
            $calculatedDP = ceil(($finalPrice * 0.25) / 1000) * 1000;

            if ($calculatedDP < 100000) {
                // If total is small (e.g. 50k), DP is full price.
                // Logic: Min(100k, Total) if 25% < 100k? 
                // Requirement: Min 100k. But if Total < 100k?
                // Let's assume Total matches. If Total < 100k, DP = Total.
                $calculatedDP = 100000;
            }

            if ($calculatedDP > $finalPrice) {
                $calculatedDP = $finalPrice;
            }

            // Generate unique booking code
            $bookingCode = 'AF-' . strtoupper(uniqid());

            $booking = Booking::create([
                'user_id' => Auth::id(),
                'guest_uid' => $uid,
                'booking_code' => $bookingCode,
                'referral_code_id' => $referralCode?->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'university' => $request->university,
                'domicile' => $request->domicile,
                'booking_date' => now(), // Use current timestamp for the transaction date
                'location' => $request->location,
                'notes' => $request->notes,
                'total_price' => $totalPrice,
                'discount_amount' => $discountAmount,
                'down_payment' => $calculatedDP,
                'status' => 'pending',
            ]);

            foreach ($validCarts as $cart) {
                $item = BookingItem::create([
                    'booking_id' => $booking->id,
                    'pricelist_package_id' => $cart->pricelist_package_id,
                    'quantity' => $cart->quantity,
                    'price' => $cart->package->price_numeric ?? 0,
                    'subtotal' => $cart->quantity * ($cart->package->price_numeric ?? 0),
                    'scheduled_date' => $cart->scheduled_date,
                    'start_time' => $cart->start_time,
                    'end_time' => $cart->end_time,
                    'room_id' => $cart->room_id,
                    'photographer_id' => $cart->photographer_id,
                ]);

                // Handle photographer booking
                if ($cart->photographer_id && $cart->session_ids) {
                    // Old flow: pre-selected photographer and sessions
                    \App\Models\PhotographerSession::whereIn('id', $cart->session_ids)
                        ->update([
                            'status' => 'booked',
                            'booking_item_id' => $item->id,
                            'cart_uid' => $uid,
                        ]);
                } elseif ($cart->photographer_id && $cart->sessions_needed) {
                    // New flow: photographer already checked/assigned, just book the sessions
                    $sessionsNeeded = $cart->sessions_needed;
                    $startTime = $cart->start_time;
                    $date = $cart->scheduled_date;
                    $photographerId = $cart->photographer_id;

                    // Generate consecutive time slots
                    $slots = [];
                    $time = \Carbon\Carbon::createFromTimeString($startTime);
                    for ($i = 0; $i < $sessionsNeeded; $i++) {
                        $slots[] = $time->format('H:i:s');
                        $time->addMinutes(30);
                    }

                    // Book the sessions for the assigned photographer
                    $sessionIds = \App\Models\PhotographerSession::where('photographer_id', $photographerId)
                        ->where('date', $date)
                        ->whereIn('start_time', $slots)
                        ->where('status', 'open')
                        ->pluck('id');

                    \App\Models\PhotographerSession::whereIn('id', $sessionIds)
                        ->update([
                            'status' => 'booked',
                            'booking_item_id' => $item->id,
                            'cart_uid' => $uid,
                        ]);
                } elseif ($cart->sessions_needed && !$cart->photographer_id) {
                    // Auto-assign photographer (fallback for old flow)
                    $sessionsNeeded = $cart->sessions_needed;
                    $startTime = $cart->start_time;
                    $date = $cart->scheduled_date;

                    // Generate consecutive time slots
                    $slots = [];
                    $time = \Carbon\Carbon::createFromTimeString($startTime);
                    for ($i = 0; $i < $sessionsNeeded; $i++) {
                        $slots[] = $time->format('H:i:s');
                        $time->addMinutes(30);
                    }

                    // Find photographer who has ALL slots open
                    $photographer = \App\Models\User::where('role', 'photographer')
                        ->whereHas('sessions', function($query) use ($date, $slots) {
                            $query->where('date', $date)
                                ->whereIn('start_time', $slots)
                                ->where('status', 'open');
                        }, '=', count($slots))
                        ->lockForUpdate()
                        ->first();

                    if (!$photographer) {
                        throw new \Exception('Slot waktu tidak tersedia lagi. Silakan pilih waktu lain.');
                    }

                    // Update booking item with assigned photographer
                    $item->update(['photographer_id' => $photographer->id]);

                    // Book the sessions
                    $sessionIds = \App\Models\PhotographerSession::where('photographer_id', $photographer->id)
                        ->where('date', $date)
                        ->whereIn('start_time', $slots)
                        ->where('status', 'open')
                        ->pluck('id');

                    \App\Models\PhotographerSession::whereIn('id', $sessionIds)
                        ->update([
                            'status' => 'booked',
                            'booking_item_id' => $item->id,
                            'cart_uid' => $uid,
                        ]);
                }
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
                // If it's a registered user's booking, protect it.
                // Ideally if Auth::check() is false, we might want to redirect to login.
                if (!Auth::check()) {
                    // For now abort 403, or maybe allow viewing if they have the exact code?
                    // Let's keep it strict for registered users.
                    abort(403);
                }
                abort(403);
            }
        }
        // For guests (no user_id), we trust the unique booking_code as the 'key'.
        // STRICT UID check removed to allow cross-device access via link.

        return Inertia::render('Checkout/Show', [
            'booking' => $booking,
            'rooms' => \App\Models\Room::all(),
        ]);
    }
}
