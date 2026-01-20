import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Sessions({ grid, selectedDate }) {
    const handleToggle = (time_full, status) => {
        if (status === 'booked') return;

        router.post('/photographer/sessions/toggle', {
            date: selectedDate,
            start_time: time_full
        }, {
            preserveScroll: true
        });
    };

    const changeDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        const formattedDate = date.toISOString().split('T')[0];
        router.get('/photographer/sessions', { date: formattedDate });
    };

    return (
        <AdminLayout>
            <Head title="Jadwal Sesi" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white dark:bg-white/3 p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-1">Manajemen Sesi</h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">
                                Tentukan sesi waktu yang ingin Anda ambil untuk bekerja
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-2 rounded-xl">
                            <button
                                onClick={() => changeDate(-1)}
                                className="p-2 hover:bg-white dark:hover:bg-brand-black rounded-lg transition-all"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 px-4">
                                <CalendarIcon className="w-5 h-5 text-brand-gold" />
                                <span className="text-sm font-black uppercase tracking-tight">
                                    {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>

                            <button
                                onClick={() => changeDate(1)}
                                className="p-2 hover:bg-white dark:hover:bg-brand-black rounded-lg transition-all"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
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
