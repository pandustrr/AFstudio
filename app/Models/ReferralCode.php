<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class ReferralCode extends Model
{
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'valid_from',
        'valid_until',
        'is_active',
        'max_usage',
        'usage_count',
        'created_by',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
        'is_active' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'referral_code_id');
    }

    /**
     * Check if referral code is valid for use
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $today = Carbon::today();
        if ($today->lt($this->valid_from) || $today->gt($this->valid_until)) {
            return false;
        }

        if ($this->max_usage && $this->usage_count >= $this->max_usage) {
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount
     */
    public function calculateDiscount(float $totalPrice): float
    {
        if ($this->discount_type === 'percentage') {
            return ($totalPrice * $this->discount_value) / 100;
        } else {
            return min($this->discount_value, $totalPrice);
        }
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}

