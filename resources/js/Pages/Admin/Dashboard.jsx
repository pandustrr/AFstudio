import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function Dashboard() {
    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="pt-32 pb-20 px-6 min-h-screen">
                <div className="max-w-6xl mx-auto">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Placeholder Stats */}
                        {[
                            { label: 'Total Pilihan', value: '1,234', color: 'brand-red' },
                            { label: 'Folder Drive', value: '12', color: 'brand-gold' },
                            { label: 'User Aktif', value: '56', color: 'brand-black' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-4">{stat.label}</p>
                                <h3 className={`text-4xl font-black text-${stat.color} dark:text-brand-white tracking-tighter`}>{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-12 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">🛠️</span>
                        </div>
                        <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase mb-4 tracking-tighter">Fitur CRUD Sedang Disiapkan</h2>
                        <p className="max-w-md mx-auto text-brand-black/40 dark:text-brand-white/40 text-sm font-medium leading-relaxed font-sans">
                            Modul manajemen foto, pengaturan folder drive, dan tinjauan pilihan pengguna akan segera hadir di sini.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
