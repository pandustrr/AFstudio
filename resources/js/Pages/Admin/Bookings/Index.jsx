import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    CalendarIcon,
    ClockIcon,
    CalendarDaysIcon,
    XMarkIcon,
    ChevronDownIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

export default function BookingIndex({ bookingItems, filters, options, photographers = [] }) {
    const [search, setSearch] = useState(filters?.search || '');



    const monthNames = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/bookings', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (type, value) => {
        const newFilters = { ...filters, [type]: value };

        if (type === 'year') {
            newFilters.month = '';
            newFilters.day = '';
            newFilters.status = 'all';
        } else if (type === 'month') {
            newFilters.day = '';
            newFilters.status = 'all';
        } else if (type === 'day') {
            newFilters.status = 'all';
        }

        router.get('/admin/bookings', newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };



    const setToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        router.get('/admin/bookings', {
            ...filters,
            year: year.toString(),
            month: month.toString(),
            day: day.toString(),
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const resetFilters = () => {
        setSearch('');
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

    const sortedDates = Object.keys(groupedItems).sort((a, b) => new Date(a) - new Date(b));

    const statusOptions = [
        { id: 'all', label: 'Semua' },
        { id: 'pending', label: 'Pending' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'completed', label: 'Done' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <AdminLayout>
            <Head title="Daily Schedule Overview" />

            <div className="pt-16 pb-12 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter">Reservations Dashboard</h1>
                            <p className="text-[9px] text-brand-black/50 dark:text-brand-white/50 font-bold uppercase tracking-widest mt-0.5">
                                Daily schedule monitoring.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
                            >
                                <XMarkIcon className="w-3.5 h-3.5" /> Reset
                            </button>
                        </div>
                    </div>



                    {/* Advanced Filters */}
                    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
                        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto grow">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="relative grow md:max-w-xs">
                                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/20" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search Customer/Code..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border-0 rounded-xl focus:ring-1 focus:ring-brand-gold text-[10px] font-bold transition-all shadow-inner"
                                />
                            </form>

                            {/* Compact Date Filters */}
                            <div className="flex items-center gap-0.5 p-1 bg-gray-50 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 w-fit shadow-inner">
                                <div className="relative group">
                                    <select
                                        value={filters.year || ''}
                                        onChange={(e) => handleFilter('year', e.target.value)}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Tahun</option>
                                        {options.years.map((year) => (
                                            <option key={year} value={year} className="bg-white dark:bg-brand-black">{year}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>
                                <div className="w-px h-3 bg-black/10 dark:bg-white/10 mx-1"></div>
                                <div className="relative group">
                                    <select
                                        value={filters.month || ''}
                                        onChange={(e) => handleFilter('month', e.target.value)}
                                        disabled={!filters.year}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Bulan</option>
                                        {options.months.map((month) => (
                                            <option key={month} value={month} className="bg-white dark:bg-brand-black">{monthNames[month]}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>
                                <div className="w-px h-3 bg-black/10 dark:bg-white/10 mx-1"></div>
                                <div className="relative group">
                                    <select
                                        value={filters.day || ''}
                                        onChange={(e) => handleFilter('day', e.target.value)}
                                        disabled={!filters.month}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Tgl</option>
                                        {options.days.map((day) => (
                                            <option key={day} value={day} className="bg-white dark:bg-brand-black">{day}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>
                                <div className="w-px h-3 bg-black/10 dark:bg-white/10 mx-1"></div>
                                <div className="relative group">
                                    <select
                                        value={filters.photographer_id || ''}
                                        onChange={(e) => handleFilter('photographer_id', e.target.value)}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">FG / All</option>
                                        {photographers.map((fg) => (
                                            <option key={fg.id} value={fg.id} className="bg-white dark:bg-brand-black">{fg.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                onClick={setToday}
                                className="px-4 py-2 bg-brand-gold text-brand-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-brand-gold/90 transition-all shrink-0"
                            >
                                Hari Ini
                            </button>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-1 overflow-x-auto pb-1.5 lg:pb-0 w-full lg:w-auto shrink-0">
                            {statusOptions.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleFilter('status', s.id)}
                                    className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${filters.status === s.id
                                        ? 'bg-brand-red text-white shadow-md'
                                        : 'bg-gray-100 text-brand-black/40 dark:bg-white/5 dark:text-brand-white/40 hover:bg-gray-200'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grouped Timeline View */}
                    <div className="space-y-8">
                        {sortedDates.length > 0 ? (
                            sortedDates.map((dateKey) => (
                                <section key={dateKey}>
                                    {/* Date Partition */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-px grow bg-black/5 dark:bg-white/5"></div>
                                        <div className="flex items-center gap-2 bg-brand-black dark:bg-brand-white px-4 py-1.5 rounded-full shadow-md">
                                            <CalendarIcon className="w-3.5 h-3.5 text-brand-gold" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white dark:text-brand-black">
                                                {new Date(dateKey).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="h-px grow bg-black/5 dark:bg-white/5"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {groupedItems[dateKey].map((item) => (
                                            <div key={item.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                                                {/* Photographer Badge */}
                                                <div className="absolute top-0 right-0 p-3">
                                                    <span className={`px-2 py-0.5 ${item.photographer ? 'bg-brand-gold/10 text-brand-gold' : 'bg-gray-100 text-gray-400'} rounded-full font-black text-[8px] uppercase tracking-tighter`}>
                                                        {item.photographer?.name || 'No FG'}
                                                    </span>
                                                </div>

                                                <div className="mb-4">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-red truncate max-w-[120px]">
                                                            {item.package?.sub_category?.name || 'Package'}
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${getStatusColor(item.booking?.status)}`}>
                                                            {item.booking?.status || '??'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter leading-tight mb-2 group-hover:text-brand-red transition-all truncate">
                                                        {item.package?.name || 'Untitled'}
                                                    </h3>

                                                    <div className="flex items-center gap-2 text-[10px] font-black text-brand-gold italic uppercase tracking-tighter bg-brand-black rounded-lg px-3 py-1.5 w-fit">
                                                        <ClockIcon className="w-3.5 h-3.5" />
                                                        {item.start_time?.substring(0, 5) || '--:--'} - {item.end_time?.substring(0, 5) || '--:--'}
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                                    <div className="grow overflow-hidden pr-2">
                                                        <p className="text-[8px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 truncate mb-0.5">Customer / Code</p>
                                                        <p className="font-bold text-[11px] text-brand-black dark:text-brand-white truncate uppercase tracking-tighter mb-1">
                                                            <span className="font-mono text-brand-red">{item.booking?.booking_code || '---'}</span> • {item.booking?.name || 'Unknown'}
                                                        </p>
                                                        {item.booking?.payment_proof && item.booking.payment_proof.length > 0 ? (
                                                            <span className={`inline-block px-2 py-0.5 rounded text-[7px] font-black uppercase ${
                                                                item.booking.payment_proof[0].status === 'verified'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : item.booking.payment_proof[0].status === 'rejected'
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                Proof: {item.booking.payment_proof[0].status}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block px-2 py-0.5 rounded text-[7px] font-black uppercase bg-gray-100 text-gray-700">
                                                                No Proof
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.booking?.id && (
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <a
                                                                href={`/admin/bookings/${item.booking.id}/invoice`}
                                                                target="_blank"
                                                                title="Generate Invoice"
                                                                className="bg-brand-gold/10 text-brand-gold p-2 rounded-xl hover:bg-brand-gold hover:text-brand-black transition-all shadow-sm"
                                                            >
                                                                <DocumentArrowDownIcon className="w-4 h-4" />
                                                            </a>
                                                            <Link
                                                                href={`/admin/bookings/${item.booking.id}`}
                                                                className="bg-brand-black dark:bg-brand-white text-white dark:text-brand-black p-2 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="py-12 text-center bg-gray-50 dark:bg-white/2 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                                <p className="text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-widest italic text-[10px] flex flex-col items-center gap-3">
                                    <CalendarDaysIcon className="w-10 h-10 opacity-10" />
                                    No records.
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
        </AdminLayout >
    );
}
