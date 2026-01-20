import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function Sessions({ grid, selectedDate, filters, options }) {
    const monthNames = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const handleToggle = (time_full, status) => {
        if (status === 'booked') return;

        const params = {
            date: selectedDate,
            start_time: time_full
        };

        if (filters.year) params.year = filters.year;
        if (filters.month) params.month = filters.month;
        if (filters.day) params.day = filters.day;

        router.post('/photographer/sessions/toggle', params, {
            preserveScroll: true
        });
    };

    const handleFilter = (type, value) => {
        const newFilters = { ...filters, [type]: value };

        if (type === 'year') {
            newFilters.month = '';
            newFilters.day = '';
        } else if (type === 'month') {
            newFilters.day = '';
        }

        router.get('/photographer/sessions', newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const setToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        router.get('/photographer/sessions', {
            year: year.toString(),
            month: month.toString(),
            day: day.toString(),
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Jadwal Sesi" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white dark:bg-white/3 p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-1">Manajemen Sesi</h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">
                                Tentukan sesi waktu yang ingin Anda ambil untuk bekerja
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Compact Date Filters */}
                            <div className="flex items-center gap-1 p-1.5 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 w-fit shadow-sm">
                                <div className="relative group">
                                    <select
                                        value={filters.year || ''}
                                        onChange={(e) => handleFilter('year', e.target.value)}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Tahun</option>
                                        {options.years.map((year) => (
                                            <option key={year} value={year} className="bg-white dark:bg-brand-black">{year}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                </div>

                                <div className="w-px h-4 bg-black/10 dark:bg-white/10"></div>

                                <div className="relative group">
                                    <select
                                        value={filters.month || ''}
                                        onChange={(e) => handleFilter('month', e.target.value)}
                                        disabled={!filters.year}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Bulan</option>
                                        {options.months.map((month) => (
                                            <option key={month} value={month} className="bg-white dark:bg-brand-black">{monthNames[month]}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                </div>

                                <div className="w-px h-4 bg-black/10 dark:bg-white/10"></div>

                                <div className="relative group">
                                    <select
                                        value={filters.day || ''}
                                        onChange={(e) => handleFilter('day', e.target.value)}
                                        disabled={!filters.month}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Tgl</option>
                                        {options.days.map((day) => (
                                            <option key={day} value={day} className="bg-white dark:bg-brand-black">{day}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                </div>
                            </div>

                            <button
                                onClick={setToday}
                                className="px-4 py-2 bg-brand-gold text-brand-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-brand-gold/90 transition-all shrink-0"
                            >
                                Hari Ini
                            </button>

                            <div className="flex items-center gap-3 px-4 bg-black/5 dark:bg-white/5 p-2 rounded-xl">
                                <CalendarIcon className="w-5 h-5 text-brand-gold" />
                                <span className="text-sm font-black uppercase tracking-tight text-brand-black dark:text-brand-white">
                                    {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {grid.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleToggle(item.time_full, item.status)}
                            disabled={item.status === 'booked'}
                            className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${item.status === 'open'
                                ? 'bg-brand-gold/10 border-brand-gold shadow-lg shadow-brand-gold/5'
                                : item.status === 'booked'
                                    ? 'bg-green-500/10 border-green-500/30 cursor-not-allowed'
                                    : 'bg-white dark:bg-white/3 border-black/5 dark:border-white/5 hover:border-brand-gold/50'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'open' ? 'text-brand-gold' :
                                    item.status === 'booked' ? 'text-green-500' : 'text-brand-black/20 dark:text-brand-white/20'
                                    }`}>
                                    Sesi {index + 1}
                                </span>
                                <ClockIcon className={`w-4 h-4 ${item.status === 'open' ? 'text-brand-gold' :
                                    item.status === 'booked' ? 'text-green-500' : 'text-brand-black/20 dark:text-brand-white/20'
                                    }`} />
                            </div>

                            <h3 className="text-xl font-black text-brand-black dark:text-brand-white tracking-tighter mb-1">
                                {item.time}
                            </h3>

                            <div className="flex items-center gap-1">
                                {item.status === 'open' ? (
                                    <>
                                        <CheckCircleIcon className="w-3 h-3 text-brand-gold" />
                                        <span className="text-[8px] font-black uppercase text-brand-gold">Tersedia</span>
                                    </>
                                ) : item.status === 'booked' ? (
                                    <>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[8px] font-black uppercase text-green-500">Terisi</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircleIcon className="w-3 h-3 text-brand-black/20 dark:text-brand-white/20" />
                                        <span className="text-[8px] font-black uppercase text-brand-black/20 dark:text-brand-white/20">Kosong</span>
                                    </>
                                )}
                            </div>

                            {/* Hover effect indicator */}
                            {item.status !== 'booked' && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-12 flex flex-wrap gap-8 p-6 bg-black/2 dark:bg-white/2 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-md bg-brand-gold/20 border border-brand-gold" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sesi Diambil</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-md bg-green-500/20 border border-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sesi Ter-booking</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-md bg-white dark:bg-white/3 border border-black/5 dark:border-white/5" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sesi Kosong (Off)</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
