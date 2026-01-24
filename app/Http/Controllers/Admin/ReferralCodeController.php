<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReferralCode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReferralCodeController extends Controller
{
    public function index(Request $request)
    {
        $codes = ReferralCode::with('creator')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/ReferralCodes/Index', [
            'codes' => $codes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ReferralCodes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:referral_codes,code|max:50',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0.01',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'is_active' => 'nullable|boolean',
            'max_usage' => 'nullable|integer|min:1',
        ]);

        ReferralCode::create([
            'code' => strtoupper($request->code),
            'discount_type' => $request->discount_type,
            'discount_value' => $request->discount_value,
            'valid_from' => $request->valid_from,
            'valid_until' => $request->valid_until,
            'is_active' => $request->boolean('is_active', true),
            'max_usage' => $request->max_usage,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('admin.referral-codes.index')->with('success', 'Referral code created successfully!');
    }

    public function show(ReferralCode $referralCode)
    {
        return Inertia::render('Admin/ReferralCodes/Show', [
            'code' => $referralCode->load('creator', 'bookings'),
        ]);
    }

    public function edit(ReferralCode $referralCode)
    {
        return Inertia::render('Admin/ReferralCodes/Edit', [
            'code' => $referralCode,
        ]);
    }

    public function update(Request $request, ReferralCode $referralCode)
    {
        $request->validate([
            'code' => 'required|string|unique:referral_codes,code,' . $referralCode->id . '|max:50',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0.01',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'is_active' => 'nullable|boolean',
            'max_usage' => 'nullable|integer|min:1',
        ]);

        $referralCode->update([
            'code' => strtoupper($request->code),
            'discount_type' => $request->discount_type,
            'discount_value' => $request->discount_value,
            'valid_from' => $request->valid_from,
            'valid_until' => $request->valid_until,
            'is_active' => $request->boolean('is_active', true),
            'max_usage' => $request->max_usage,
        ]);

        return redirect()->route('admin.referral-codes.index')->with('success', 'Referral code updated successfully!');
    }

    public function destroy(ReferralCode $referralCode)
    {
        $referralCode->delete();
        return redirect()->route('admin.referral-codes.index')->with('success', 'Referral code deleted successfully!');
    }

    /**
     * API endpoint to validate referral code
     */
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = ReferralCode::where('code', strtoupper($request->code))->first();

        if (!$code) {
            return response()->json([
                'valid' => false,
                'message' => 'Kode referral tidak ditemukan.',
            ], 404);
        }

        if (!$code->isValid()) {
            return response()->json([
                'valid' => false,
                'message' => 'Kode referral tidak valid atau sudah berakhir.',
            ], 400);
        }

        return response()->json([
            'valid' => true,
            'code' => $code,
            'discount_value' => $code->discount_value,
            'discount_type' => $code->discount_type,
        ]);
    }
}
