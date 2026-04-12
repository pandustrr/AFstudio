<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
 
class BookingItem extends Model
{
    protected $fillable = [
        'booking_id',
        'pricelist_package_id',
        'photographer_id',
        'room_id',
        'room_name',
        'quantity',
        'price',
        'subtotal',
        'scheduled_date',
        'start_time',
        'end_time',
        'selected_times',
    ];
 
    protected $casts = [
        'selected_times' => 'array',
        'scheduled_date' => 'date',
    ];
 
    protected $appends = [
        'adjusted_start_time',
        'adjusted_end_time',
        'adjusted_sessions'
    ];
 
    public function getAdjustedSessionsAttribute()
    {
        $sessions = $this->photographerSessions->sortBy('start_time');
        return $sessions->map(function($s) {
            return [
                'id' => $s->id,
                'start_time' => $s->start_time,
                'end_time' => $s->override_end_time ?: \Carbon\Carbon::parse($s->start_time)->addMinutes(30)->format('H:i:s'),
                'adjusted_start_time' => $s->adjusted_start_time,
                'adjusted_end_time' => $s->adjusted_end_time,
                'is_customized' => $s->is_customized
            ];
        })->values()->toArray();
    }
 
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
 
    public function package()
    {
        return $this->belongsTo(PricelistPackage::class, 'pricelist_package_id');
    }
 
    public function photographer()
    {
        return $this->belongsTo(User::class, 'photographer_id');
    }
 
    public function photographerSessions()
    {
        return $this->hasMany(PhotographerSession::class, 'booking_item_id');
    }
 
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
 
    // --- Cascading Offset & Manual Override Logic ---
    protected static $daySessionCache = [];
 
    public function getAdjustedStartTimeAttribute()
    {
        if (!$this->start_time || !$this->photographer_id) return $this->start_time;
 
        try {
            $matrix = $this->getOffsetMatrix();
            $offsetMinutes = $matrix[$this->start_time] ?? 0;
            
            // Check for manual override from admin
            $firstSession = $this->photographerSessions->sortBy('start_time')->first();
            $baseStartTime = ($firstSession && $firstSession->is_customized && $firstSession->override_start_time)
                ? $firstSession->override_start_time
                : $this->start_time;
 
            $time = Carbon::createFromFormat('H:i:s', strlen($baseStartTime) == 5 ? $baseStartTime . ':00' : $baseStartTime);
            return $time->addMinutes($offsetMinutes)->format('H:i:s');
        } catch (\Exception $e) {
            return $this->start_time;
        }
    }
 
    public function getAdjustedEndTimeAttribute()
    {
        if (!$this->end_time || !$this->photographer_id) return $this->end_time;
 
        try {
            $matrix = $this->getOffsetMatrix();
            
            // For end time, we use the offset of the LAST session in the booking
            $lastSession = $this->photographerSessions->sortByDesc('start_time')->first();
            $lastSessionStartTime = $lastSession ? $lastSession->start_time : $this->start_time;
            $offsetMinutes = $matrix[$lastSessionStartTime] ?? 0;
 
            // Check for manual override from admin
            $baseEndTime = ($lastSession && $lastSession->is_customized && $lastSession->override_end_time)
                ? $lastSession->override_end_time
                : $this->end_time;
 
            $time = Carbon::createFromFormat('H:i:s', strlen($baseEndTime) == 5 ? $baseEndTime . ':00' : $baseEndTime);
            return $time->addMinutes($offsetMinutes)->format('H:i:s');
        } catch (\Exception $e) {
            return $this->end_time;
        }
    }
 
    protected function getOffsetMatrix()
    {
        $cacheKey = $this->photographer_id . '_' . $this->scheduled_date->toDateString();
 
        if (!isset(static::$daySessionCache[$cacheKey])) {
            $sessions = PhotographerSession::where('photographer_id', $this->photographer_id)
                ->where('date', $this->scheduled_date->toDateString())
                ->orderBy('start_time', 'asc')
                ->get();
 
            $cumulative = 0;
            $matrix = [];
            
            foreach ($sessions as $s) {
                $cumulative += ($s->offset_minutes ?? 0);
                $matrix[$s->start_time] = $cumulative;
            }
            static::$daySessionCache[$cacheKey] = $matrix;
        }
 
        return static::$daySessionCache[$cacheKey];
    }
}
