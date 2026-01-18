
import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link, usePage } from '@inertiajs/react'; // Added usePage
import { ArrowLeftIcon, PlusIcon, TrashIcon, ClockIcon, CalendarIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function Schedule({ room, weeklySchedules, dateSchedules = [], filters = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 } }) {
    const { errors } = usePage().props;

    // Weekly State
    const [addingWeeklyToDay, setAddingWeeklyToDay] = useState(null);
    const [addingProcessing, setAddingProcessing] = useState(false);
    const [newWeekly, setNewWeekly] = useState({ start_time: '09:00', end_time: '17:00' });

    // Unified Schedule State
    const [selectedYear, setSelectedYear] = useState(filters.year);
    const [selectedMonth, setSelectedMonth] = useState(filters.month);
    const [selectedWeek, setSelectedWeek] = useState(1); // Default to Week 1
    const [newDate, setNewDate] = useState({ date: '', start_time: '09:00', end_time: '17:00' });
    const [addingToDate, setAddingToDate] = useState(null); // Track inline adding
    const [processingDate, setProcessingDate] = useState(false);

    const handleAddWeekly = (dayIndex) => {
        router.post(`/admin/rooms/${room.id}/schedule`, {
            type: 'weekly',
            day_of_week: dayIndex,
            start_time: newWeekly.start_time,
            end_time: newWeekly.end_time,
            is_active: true
        }, {
            preserveScroll: true,
            onStart: () => setAddingProcessing(true),
            onFinish: () => setAddingProcessing(false),
            onSuccess: () => {
                setAddingWeeklyToDay(null);
                setNewWeekly({ start_time: '09:00', end_time: '17:00' });
            },
            onError: (err) => {
                if (!err.start_time && !err.end_time) alert("Gagal menyimpan jadwal.");
            }
        });
    };

    const handleAddSlot = (dateStr) => {
        console.log('🔵 SAVING TO DATE:', dateStr);
        console.log('🔵 Time:', newDate.start_time, '-', newDate.end_time);

        router.post(`/admin/rooms/${room.id}/schedule`, {
            type: 'date',
            date: dateStr,
            start_time: newDate.start_time,
            end_time: newDate.end_time,
            is_active: true
        }, {
            preserveScroll: true,
            preserveState: true, // Keep selectedWeek and other local state
            onStart: () => setProcessingDate(true),
            onFinish: () => setProcessingDate(false),
            onSuccess: () => {
                setAddingToDate(null);
                setNewDate({ ...newDate, date: '' });
            },
            onError: (err) => {
                const msg = Object.values(err)[0] || "Gagal menyimpan jadwal.";
                alert(msg);
            }
        });
    };

    const handleDelete = (scheduleId) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            router.delete(`/admin/rooms/${room.id}/schedule/${scheduleId}`, {
                preserveScroll: true,
                preserveState: true // Keep selectedWeek
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={`Jadwal - ${room.label}`} />

            <div className="pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/admin/rooms"
                        className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1 leading-none">
                            Jadwal: {room.label}
                        </h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-black uppercase tracking-widest leading-none">
                            Kelola ketersediaan dan jam operasional rutin.
                        </p>
                    </div>
                </div>

                {/* Unified Weekly Scheduler */}
                <div className="space-y-8">
                    {/* Header & Main Filters */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-white/5 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                                    Weekly Schedule Planner
                                </h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    Pilih mingguan untuk mengatur jam operasional harian.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                {/* Year Filter */}
                                <div className="space-y-1.5 min-w-[120px]">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Tahun</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => {
                                                setSelectedYear(e.target.value);
                                                router.get(window.location.pathname, { year: e.target.value, month: selectedMonth }, { preserveState: true });
                                            }}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl text-[11px] font-black py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold appearance-none text-brand-black dark:text-brand-white transition-all cursor-pointer hover:bg-black/8 dark:hover:bg-white/8"
                                        >
                                            {(() => {
                                                const currentYear = new Date().getFullYear();
                                                return <option value={currentYear} className="bg-white dark:bg-brand-black text-brand-black dark:text-brand-white">{currentYear}</option>;
                                            })()}
                                        </select>
                                        <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                    </div>
                                </div>

                                {/* Month Filter */}
                                <div className="space-y-1.5 min-w-[140px]">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bulan</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => {
                                                setSelectedMonth(e.target.value);
                                                router.get(window.location.pathname, { year: selectedYear, month: e.target.value }, { preserveState: true });
                                            }}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl text-[11px] font-black py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold appearance-none text-brand-black dark:text-brand-white transition-all cursor-pointer hover:bg-black/8 dark:hover:bg-white/8"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                <option key={m} value={m} className="bg-white dark:bg-brand-black text-brand-black dark:text-brand-white">
                                                    {new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' })}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                    </div>
                                </div>

                                {/* Week Filter */}
                                <div className="space-y-1.5 min-w-[180px]">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Filter Minggu</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedWeek}
                                            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                                            className="w-full bg-brand-gold/10 border border-brand-gold/20 rounded-xl text-[11px] font-black py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold appearance-none text-brand-gold transition-all cursor-pointer hover:bg-brand-gold/20"
                                        >
                                            <option value={1} className="bg-white dark:bg-brand-black">Minggu 1 (Tgl 01-07)</option>
                                            <option value={2} className="bg-white dark:bg-brand-black">Minggu 2 (Tgl 08-14)</option>
                                            <option value={3} className="bg-white dark:bg-brand-black">Minggu 3 (Tgl 15-21)</option>
                                            <option value={4} className="bg-white dark:bg-brand-black">Minggu 4 (Tgl 22-28)</option>
                                            <option value={5} className="bg-white dark:bg-brand-black">Minggu 5 (Tgl 29-Habis)</option>
                                        </select>
                                        <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-brand-gold pointer-events-none group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={window.location.pathname}
                            data={{ year: selectedYear, month: selectedMonth }}
                            className="px-6 py-3 bg-black/5 dark:bg-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:bg-black/10 transition-all"
                        >
                            Refresh Data
                        </Link>
                    </div>

                    {/* Weekly Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5">
                        {(() => {
                            const yearNum = parseInt(selectedYear);
                            const monthNum = parseInt(selectedMonth);
                            const todayStr = new Date().toISOString().split('T')[0];

                            // Calculate days in month without timezone issues
                            const daysInMonth = new Date(Date.UTC(yearNum, monthNum, 0)).getUTCDate();

                            const startDay = (selectedWeek - 1) * 7 + 1;
                            const endDay = Math.min(selectedWeek * 7, daysInMonth);

                            if (startDay > daysInMonth) return (
                                <div className="col-span-full py-20 text-center opacity-20">
                                    <p className="text-xs font-black uppercase tracking-widest">Minggu ini tidak tersedia pada bulan berjalan</p>
                                </div>
                            );

                            const items = [];

                            // Helper function to get day name without timezone issues
                            const getDayName = (year, month, day) => {
                                // Zeller's congruence algorithm for day of week
                                // Adjusted for Gregorian calendar
                                let m = month;
                                let y = year;
                                if (m < 3) {
                                    m += 12;
                                    y -= 1;
                                }
                                const q = day;
                                const K = y % 100;
                                const J = Math.floor(y / 100);
                                const h = (q + Math.floor((13 * (m + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) - 2 * J) % 7;

                                // Convert to our day names (0=Saturday in Zeller's, we want 0=Sunday)
                                const dayIndex = (h + 6) % 7; // Adjust so 0=Sunday
                                const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                                return dayNames[dayIndex];
                            };

                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

                            for (let d = startDay; d <= endDay; d++) {
                                // Create date string in YYYY-MM-DD format
                                const dateStr = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

                                // Get day name using our algorithm (no timezone issues!)
                                const dayName = getDayName(yearNum, monthNum, d);
                                const monthName = monthNames[monthNum - 1];

                                const slots = dateSchedules.filter(s => {
                                    if (!s.date) return false;
                                    // Since we removed the model cast, s.date is now a raw YYYY-MM-DD string
                                    const sDate = s.date.split(/[ T]/)[0];
                                    const matches = sDate === dateStr;
                                    return matches;
                                });

                                const todayFormatted = new Date().toISOString().split('T')[0];
                                const isToday = todayFormatted === dateStr;
                                const isAdding = addingToDate === dateStr;

                                // Use IIFE to capture all current values for this iteration
                                items.push(
                                    ((currentDateStr, currentDayName, currentMonthName, currentDay, currentSlots, currentlyAdding, currentlyToday) => (
                                        <div key={currentDay} className={`bg-white dark:bg-white/5 border rounded-2xl p-4 flex flex-col h-full transition-all hover:shadow-xl ${currentlyToday ? 'border-brand-gold shadow-lg shadow-brand-gold/10' : 'border-black/5 dark:border-white/5'}`}>
                                            {/* Date Label */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] font-black uppercase leading-none ${currentlyToday ? 'text-brand-gold' : 'text-gray-400'}`}>
                                                        {currentDayName}
                                                    </span>
                                                    <span className="text-lg font-black text-brand-black dark:text-brand-white leading-tight">
                                                        {currentDay} {currentMonthName}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setAddingToDate(currentlyAdding ? null : currentDateStr);
                                                        if (Object.keys(errors).length > 0) router.reload({ only: ['errors'] });
                                                    }}
                                                    className={`p-1.5 rounded-lg transition-all ${currentlyAdding ? 'bg-red-500 text-white' : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-black'}`}
                                                >
                                                    {currentlyAdding ? <XMarkIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4 stroke-[2.5]" />}
                                                </button>
                                            </div>

                                            {/* Slot List */}
                                            <div className="flex-1 space-y-2">
                                                {currentlyAdding && (
                                                    <div className="bg-brand-gold/5 p-2 rounded-xl border border-brand-gold/20 space-y-2 animate-in slide-in-from-top-2 mb-4">
                                                        <div className="grid grid-cols-2 gap-1">
                                                            <div className="space-y-1">
                                                                <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-1">Mulai</label>
                                                                <input
                                                                    type="time"
                                                                    value={newDate.start_time}
                                                                    onChange={e => setNewDate({ ...newDate, start_time: e.target.value })}
                                                                    className={`w-full bg-white dark:bg-black border-0 rounded-lg py-1 px-1.5 text-[10px] font-bold ${errors.start_time ? 'ring-1 ring-red-500' : ''}`}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-1">Selesai</label>
                                                                <input
                                                                    type="time"
                                                                    value={newDate.end_time}
                                                                    onChange={e => setNewDate({ ...newDate, end_time: e.target.value })}
                                                                    className={`w-full bg-white dark:bg-black border-0 rounded-lg py-1 px-1.5 text-[10px] font-bold ${errors.end_time ? 'ring-1 ring-red-500' : ''}`}
                                                                />
                                                            </div>
                                                        </div>

                                                        {Object.keys(errors).length > 0 && addingToDate === currentDateStr && (
                                                            <div className="text-[8px] font-bold text-red-500 uppercase leading-tight px-1 text-center">
                                                                {Object.values(errors)[0]}
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => handleAddSlot(currentDateStr)}
                                                            disabled={processingDate}
                                                            className="w-full bg-brand-gold text-brand-black py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                                                        >
                                                            {processingDate ? '...' : 'SIMPAN'}
                                                        </button>
                                                    </div>
                                                )}

                                                {currentSlots.length === 0 && !currentlyAdding ? (
                                                    <div className="h-full flex flex-col items-center justify-center py-8 opacity-20">
                                                        <ClockIcon className="w-6 h-6 mb-1" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">Tidak Ada Jadwal</span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        {currentSlots.map(slot => (
                                                            <div key={slot.id} className="group flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-xl px-2.5 py-2 border border-black/5 dark:border-white/5 hover:border-brand-gold/20 transition-all">
                                                                <div className="flex items-center gap-2 text-[10px] font-black text-brand-black dark:text-brand-white/80">
                                                                    <ClockIcon className="w-3.5 h-3.5 text-brand-gold" />
                                                                    {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDelete(slot.id)}
                                                                    className="text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                                    title="Hapus"
                                                                >
                                                                    <TrashIcon className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))(dateStr, dayName, monthName, d, slots, isAdding, isToday)
                                );
                            }
                            return items;
                        })()}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
