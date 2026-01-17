import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard() {
    const handleLogout = () => {
        router.post('/admin/logout', {}, {
            onSuccess: () => window.location.href = '/admin/login',
            onError: () => window.location.reload()
        });
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="pt-12 lg:pt-20 pb-20 px-6 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-2 italic">Dashboard</h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest">Selamat datang kembali, Admin.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-brand-red hover:bg-black text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-red/10 active:scale-95"
                        >
                            Keluar Sesi
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stats */}
                        {[
                            { label: 'Sesi Foto', value: '1,234', color: 'brand-red' },
                            { label: 'Booking Baru', value: '8', color: 'brand-gold' },
                            { label: 'Reservasi', value: '45', color: 'brand-black' },
                            { label: 'Ulasan', value: '12', color: 'brand-red' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-4">{stat.label}</p>
                                <h3 className={`text-3xl font-black text-${stat.color} dark:text-brand-white tracking-tighter`}>{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 mt-12">
                        <div className="flex-1 bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-10 shadow-2xl text-center flex flex-col items-center">
                            <div className="w-14 h-14 bg-brand-red/10 rounded-full flex items-center justify-center mb-6 text-2xl">
                                📸
                            </div>
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase mb-4 tracking-tighter">Kelola Sesi Foto</h2>
                            <p className="max-w-xs mx-auto text-brand-black/40 dark:text-brand-white/40 text-[11px] font-bold leading-relaxed uppercase tracking-tight mb-8 grow">
                                Akses gallery, pantau request edit dari user, dan kelola workflow pasca produksi.
                            </p>
                            <Link
                                href="/admin/photo-editing"
                                className="w-full bg-brand-black dark:bg-brand-white text-white dark:text-brand-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:scale-[1.02] shadow-xl"
                            >
                                Buka Sesi Foto
                            </Link>
                        </div>

                        <div className="flex-1 bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-10 shadow-2xl text-center flex flex-col items-center">
                            <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 text-2xl">
                                🗓️
                            </div>
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase mb-4 tracking-tighter">Manajemen Reservasi</h2>
                            <p className="max-w-xs mx-auto text-brand-black/40 dark:text-brand-white/40 text-[11px] font-bold leading-relaxed uppercase tracking-tight mb-8 grow">
                                Lihat jadwal masuk, konfirmasi pembayaran DP, dan pantau status setiap room studio.
                            </p>
                            <Link
                                href="/admin/bookings"
                                className="w-full bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:scale-[1.02] shadow-xl"
                            >
                                Buka Reservasi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
