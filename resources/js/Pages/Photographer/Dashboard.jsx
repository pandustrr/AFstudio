import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Dashboard({ stats, recentBookings }) {
    const { auth } = usePage().props;

    const handleLogout = () => {
        router.post('/photographer/logout', {}, {
            onSuccess: () => window.location.href = '/photographer/login',
            onError: () => window.location.reload()
        });
    };

    return (
        <AdminLayout>
            <Head title="Photographer Dashboard" />

            <div className="pt-12 lg:pt-20 pb-20 px-6 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-2 italic">Dashboard</h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest capitalize">Selamat datang kembali, {auth.user.name}.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-brand-red hover:bg-black text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-red/10 active:scale-95"
                        >
                            Keluar Sesi
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Sesi', value: stats.total_sessions, color: 'brand-black' },
                            { label: 'Sesi Open', value: stats.open_sessions, color: 'brand-gold' },
                            { label: 'Sesi Booked', value: stats.booked_sessions, color: 'brand-red' },
                            { label: 'Upcoming', value: stats.upcoming_sessions, color: 'brand-red' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-4">{stat.label}</p>
                                <h3 className={`text-3xl font-black text-${stat.color} dark:text-brand-white tracking-tighter`}>{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-10 shadow-2xl text-center flex flex-col items-center">
                            <div className="w-14 h-14 bg-brand-red/10 rounded-full flex items-center justify-center mb-6 text-2xl">
                                📅
                            </div>
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase mb-4 tracking-tighter">Kelola Jadwal & Sesi</h2>
                            <p className="max-w-xs mx-auto text-brand-black/40 dark:text-brand-white/40 text-[11px] font-bold leading-relaxed uppercase tracking-tight mb-8 grow">
                                Atur ketersediaan waktu Anda, lihat jadwal mendatang, dan pantau booking sesi Anda.
                            </p>
                            <Link
                                href="/photographer/sessions"
                                className="w-full bg-brand-black dark:bg-brand-white text-white dark:text-brand-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:scale-[1.02] shadow-xl"
                            >
                                Buka Manajemen Sesi
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-sm font-black text-brand-black dark:text-brand-white uppercase mb-6 tracking-widest">Booking Terbaru</h2>
                            <div className="space-y-4">
                                {recentBookings.map((booking) => (
                                    <div key={booking.id} className="flex justify-between items-center p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                                        <div>
                                            <p className="font-black text-xs uppercase text-brand-black dark:text-brand-white">{booking.name}</p>
                                            <p className="text-[10px] text-brand-black/40 dark:text-brand-white/40 uppercase font-bold">{booking.items[0]?.package?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-brand-gold uppercase">{booking.status}</p>
                                        </div>
                                    </div>
                                ))}
                                {recentBookings.length === 0 && (
                                    <p className="text-center py-10 text-[10px] font-bold uppercase opacity-20 italic">Belum ada booking.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
