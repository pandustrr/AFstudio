import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    CalendarIcon,
    ClockIcon,
    HomeIcon,
    CalendarDaysIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function BookingIndex({ bookingItems, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [roomId, setRoomId] = useState(filters?.room_id || '');
    const [date, setDate] = useState(filters?.date || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/bookings', { search, status, room_id: roomId, date }, { preserveState: true });
    };

    const handleFilterChange = (newStatus) => {
        setStatus(newStatus);
        router.get('/admin/bookings', { search, status: newStatus, room_id: roomId, date }, { preserveState: true });
    };

    const handleRoomChange = (newRoomId) => {
        setRoomId(newRoomId);
        router.get('/admin/bookings', { search, status, room_id: newRoomId, date }, { preserveState: true });
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        router.get('/admin/bookings', { search, status, room_id: roomId, date: newDate }, { preserveState: true });
    };

    const setToday = () => {
        const today = new Date().toISOString().split('T')[0];
        handleDateChange(today);
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        setRoomId('');
        setDate('');
        router.get('/admin/bookings', {}, { preserveState: false });
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Grouping Logic
    const groupedItems = useMemo(() => {
        if (!bookingItems?.data) return {};
        return bookingItems.data.reduce((acc, item) => {
            const dateKey = item.scheduled_date || 'No Date';
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(item);
            return acc;
        }, {});
    }, [bookingItems?.data]);

    const rooms = [
        { id: '', label: 'All Rooms' },
        { id: '1', label: 'Room 1' },
        { id: '2', label: 'Room 2' },
        { id: '3', label: 'Room 3' },
    ];

    const sortedDates = Object.keys(groupedItems).sort((a, b) => new Date(a) - new Date(b));

    return (
        <AdminLayout>
            <Head title="Daily Schedule Overview" />

            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter">Reservations Dashboard</h1>
                            <p className="text-sm text-brand-black/50 dark:text-brand-white/50 font-bold uppercase tracking-widest mt-1">
                                Daily schedule & room monitoring system.
                            </p>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
                        >
                            <XMarkIcon className="w-4 h-4" /> Reset Filters
                        </button>
                    </div>

                    {/* Room & Quick Date Tabs */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {rooms.map((room) => (
                                <button
                                    key={room.id}
                                    onClick={() => handleRoomChange(room.id)}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border shadow-sm shrink-0 ${String(roomId) === String(room.id)
                                            ? 'bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black border-transparent scale-105 shadow-xl'
                                            : 'bg-white dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40 border-black/5 dark:border-white/5 hover:bg-gray-50'
                                        }`}
                                >
                                    <HomeIcon className="w-4 h-4" />
                                    {room.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-6 mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between shadow-lg">
                        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto grow">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="relative grow md:max-w-xs">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search Customer/Code..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold text-xs font-bold transition-all shadow-inner"
                                />
                            </form>

                            {/* Date Picker */}
                            <div className="flex items-center gap-2 grow md:max-w-xs">
                                <div className="relative grow">
                                    <CalendarDaysIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20 font-black" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-red text-xs font-black transition-all shadow-inner cursor-pointer"
                                    />
                                </div>
                                <button
                                    onClick={setToday}
                                    className="px-4 py-3.5 bg-brand-gold text-brand-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
                                >
                                    Today
                                </button>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto shrink-0">
                            {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleFilterChange(s)}
                                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${status === s
                                        ? 'bg-brand-red text-white shadow-lg'
                                        : 'bg-gray-100 text-brand-black/40 dark:bg-white/5 dark:text-brand-white/40 hover:bg-gray-200'
                                        }`}
                                >
                                    {s === '' ? 'All Status' : s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grouped Timeline View */}
                    <div className="space-y-16">
                        {sortedDates.length > 0 ? (
                            sortedDates.map((dateKey) => (
                                <section key={dateKey}>
                                    {/* Date Partition */}
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="h-[2px] grow bg-black/5 dark:bg-white/5"></div>
                                        <div className="flex items-center gap-3 bg-brand-black dark:bg-brand-white px-6 py-2 rounded-full shadow-2xl">
                                            <CalendarIcon className="w-4 h-4 text-brand-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white dark:text-brand-black">
                                                {new Date(dateKey).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="h-[2px] grow bg-black/5 dark:bg-white/5"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {groupedItems[dateKey].map((item) => (
                                            <div key={item.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                                                {/* Room Badge */}
                                                <div className="absolute top-0 right-0 p-4">
                                                    <span className={`px-3 py-1 bg-brand-gold text-brand-black rounded-full font-black text-[9px] uppercase tracking-tighter ${item.room_id == 1 ? 'opacity-100' : item.room_id == 2 ? 'opacity-80' : 'opacity-60'}`}>
                                                        Room {item.room_id}
                                                    </span>
                                                </div>

                                                <div className="mb-6">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">
                                                            {item.package?.sub_category?.name || item.package?.name || 'Package'}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${getStatusColor(item.booking?.status)}`}>
                                                            {item.booking?.status || 'unknown'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter leading-none mb-4 group-hover:text-brand-red transition-all">
                                                        {item.package?.name || 'Untitled Package'}
                                                    </h3>

                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3 text-xs font-black text-brand-gold italic uppercase tracking-tighter bg-brand-black rounded-lg px-4 py-2 w-fit">
                                                            <ClockIcon className="w-4 h-4" />
                                                            {item.start_time?.substring(0, 5) || '--:--'} - {item.end_time?.substring(0, 5) || '--:--'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                                    <div className="grow overflow-hidden pr-4">
                                                        <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 truncate mb-0.5">Booking Code / Name</p>
                                                        <p className="font-bold text-sm text-brand-black dark:text-brand-white truncate uppercase tracking-tighter">
                                                            <span className="font-mono text-brand-red">{item.booking?.booking_code || '---'}</span> • {item.booking?.name || 'Unknown'}
                                                        </p>
                                                    </div>
                                                    {item.booking?.id && (
                                                        <Link
                                                            href={`/admin/bookings/${item.booking.id}`}
                                                            className="shrink-0 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black p-3 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg"
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-gray-50 dark:bg-white/2 rounded-3xl border border-dashed border-black/10 dark:border-white/10">
                                <p className="text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-widest italic flex flex-col items-center gap-4">
                                    <CalendarDaysIcon className="w-12 h-12 opacity-10" />
                                    No reservations found for current filters.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {bookingItems?.links?.length > 3 && (
                        <div className="mt-20 flex justify-center">
                            <div className="inline-flex gap-1 p-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl shadow-xl">
                                {bookingItems.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${link.active
                                            ? 'bg-brand-red text-white shadow-lg'
                                            : 'text-brand-black/40 dark:text-brand-white/40 hover:bg-gray-100 dark:hover:bg-white/10'
                                            } ${!link.url && 'opacity-30 cursor-not-allowed hidden'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
