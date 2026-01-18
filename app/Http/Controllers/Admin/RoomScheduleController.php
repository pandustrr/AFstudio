<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomScheduleController extends Controller
{
    public function show(Request $request, Room $room)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        $room->load(['schedules' => function ($q) {
            $q->orderBy('date')->orderBy('day_of_week')->orderBy('start_time');
        }]);

        // Separate weekly and dates
        $weeklySchedules = $room->schedules->whereNull('date')->values();

        $dateSchedules = $room->schedules()
            ->whereNotNull('date')
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Admin/Bookings/Rooms/Schedule', [
            'room' => $room,
            'weeklySchedules' => $weeklySchedules,
            'dateSchedules' => $dateSchedules,
            'filters' => [
                'year' => (int)$year,
                'month' => (int)$month
            ]
        ]);
    }

    public function store(Request $request, Room $room)
    {
        $request->validate([
            'type' => 'required|in:weekly,date',
            'day_of_week' => 'required_if:type,weekly|integer|min:0|max:6',
            'date' => 'required_if:type,date|date',
            'start_time' => 'required|regex:/^\d{2}:\d{2}(:\d{2})?$/',
            'end_time' => 'required|regex:/^\d{2}:\d{2}(:\d{2})?$/|after:start_time',
            'is_active' => 'boolean'
        ]);

        if ($request->type === 'weekly') {
            RoomSchedule::create([
                'room_id' => $room->id,
                'day_of_week' => $request->day_of_week,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'is_active' => $request->is_active ?? true,
                'date' => null
            ]);
        } else {
            \Illuminate\Support\Facades\Log::info('RoomSchedule Store', [
                'incoming_date' => $request->date,
                'room_id' => $room->id
            ]);

            RoomSchedule::create([
                'room_id' => $room->id,
                'date' => \Carbon\Carbon::parse($request->date)->format('Y-m-d'),
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'is_active' => $request->is_active ?? true,
                'day_of_week' => null
            ]);
        }

        return redirect()->back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Room $room, RoomSchedule $schedule)
    {
        $schedule->delete();
        return redirect()->back()->with('success', 'Jadwal berhasil dihapus.');
    }
}
