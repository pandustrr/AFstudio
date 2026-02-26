<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Cart;
use App\Models\PaymentProof;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function create(Request $request)
    {
        // Jika ada parameter code, tampilkan halaman Show (QRIS/Upload)
        $code = $request->query('code');
        if ($code) {
            return $this->show($code);
        }

        $uid = $request->header('X-Cart-UID') ?? $request->query('uid');

        $query = Cart::with(['package.subCategory.category']);

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } elseif ($uid) {
            $query->where('cart_uid', $uid);
        } else {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        // Check if we are redirected back from a successful store (with booking in flash)
        if (session('booking')) {
            return Inertia::render('Checkout/Create', [
                'carts' => [], // Empty is fine for success state
                'rooms' => \App\Models\Room::all(),
                'photographers' => \App\Models\User::where('role', 'photographer')->get(['id', 'name']),
            ]);
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

            // Calculate Down Payment based on User Rule
            // > 500k = 25%, <= 500k = 100k
            if ($finalPrice > 500000) {
                // 25% of Total, rounded up to nearest 1.000
                $calculatedDP = ceil(($finalPrice * 0.25) / 1000) * 1000;
            } else {
                // Under or equal 500k, min DP is 100k
                $calculatedDP = 100000;
            }

            // Cap DP at final price just in case package is small
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

            // Handle optional proof of payment file from initial checkout
            if ($request->hasFile('proof_file')) {
                $file = $request->file('proof_file');
                $filePath = $file->store('proofs', 'public');

                \App\Models\PaymentProof::create([
                    'booking_id' => $booking->id,
                    'file_path' => $filePath,
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                    'status' => 'pending',
                ]);
            }

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
                        ->whereHas('sessions', function ($query) use ($date, $slots) {
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

            // Instead of redirecting to a new page, redirect back with the booking data in flash
            // This allows the Create.jsx component to show the success state without changing the URL
            return redirect()->back()->with([
                'success' => 'Booking created successfully!',
                'booking' => $booking->load(['items.package.subCategory', 'paymentProof']),
                'rooms' => \App\Models\Room::all(),
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            // Log the error for debugging
            \Illuminate\Support\Facades\Log::error('Booking Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    public function show($code)
    {
        $booking = Booking::with(['items.package.subCategory', 'paymentProof'])->where('booking_code', $code)->firstOrFail();

        // Jika dipanggil via route lama /booking/{code}, redirect ke /checkout?code=...
        if (request()->routeIs('booking.show')) {
            return redirect()->route('booking.create', ['code' => $code, 'uid' => request()->query('uid')]);
        }

        return Inertia::render('Checkout/Show', [
            'booking' => $booking,
            'rooms' => \App\Models\Room::all(),
        ]);
    }

    public function uploadProof(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|integer|exists:bookings,id',
            'proof_file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120', // max 5MB
        ]);

        try {
            $booking = Booking::findOrFail($request->booking_id);

            // Check if booking belongs to authenticated user or guest
            if ($booking->user_id && $booking->user_id !== Auth::id()) {
                abort(403, 'Unauthorized access to this booking');
            }

            // Delete previous proof if exists
            $existingProof = PaymentProof::where('booking_id', $booking->id)->first();
            if ($existingProof && Storage::disk('public')->exists($existingProof->file_path)) {
                Storage::disk('public')->delete($existingProof->file_path);
            }
            if ($existingProof) {
                $existingProof->delete();
            }

            // Store the uploaded file
            $file = $request->file('proof_file');
            $filename = 'proof-' . $booking->booking_code . '-' . time() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('payment-proofs', $filename, 'public');

            // Create payment proof record
            $paymentProof = PaymentProof::create([
                'booking_id' => $booking->id,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'status' => 'pending',
            ]);

            return back()->with('success', 'Payment proof uploaded successfully. Admin will verify it shortly.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Upload Proof Error: ' . $e->getMessage());
            return back()->with('error', 'Error uploading payment proof: ' . $e->getMessage());
        }
    }

    public function getProofStatus($bookingId)
    {
        try {
            $booking = Booking::findOrFail($bookingId);

            // Longgarkan pengecekan agar tidak error 500, cukup bandingkan ID secara fleksibel
            if ($booking->user_id && Auth::check() && $booking->user_id != Auth::id()) {
                // Jangan abort di dalam try-catch jika ingin return JSON manual
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $paymentProof = PaymentProof::where('booking_id', $bookingId)->first();

            return response()->json([
                'exists' => !!$paymentProof,
                'status' => $paymentProof?->status ?? null,
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Get Proof Status Error: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching proof status'], 500);
        }
    }
}
