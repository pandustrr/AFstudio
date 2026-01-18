import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ stats = {}, filters = {} }) {
    const [selectedPeriod, setSelectedPeriod] = useState(filters?.days || 30);

    const handlePeriodChange = (days) => {
        setSelectedPeriod(days);
        router.get('/admin/insights', { days }, { preserveState: true });
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num || 0);
    };

    // Debug logging
    console.log('Insights Props:', { stats, filters });

    return (
        <AdminLayout>
            <Head title="Insights - Admin Dashboard" />

            <div className="pt-12 lg:pt-20 pb-20 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-2 italic">
                                Insights
                            </h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest">
                                Statistik & analitik pengunjung website
                            </p>
                        </div>

                        {/* Period Filter */}
                        <div className="flex gap-2">
                            {[7, 30, 90].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => handlePeriodChange(days)}
                                    className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${
                                        selectedPeriod == days
                                            ? 'bg-brand-red text-white shadow-xl shadow-brand-red/20'
                                            : 'bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 text-brand-black dark:text-brand-white hover:border-brand-red'
                                    }`}
                                >
                                    {days} Hari
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Total Kunjungan
                                </p>
                                <span className="text-2xl">👁️</span>
                            </div>
                            <h3 className="text-4xl font-black text-brand-red dark:text-brand-white tracking-tighter">
                                {formatNumber(stats?.totalViews || 0)}
                            </h3>
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-2">
                                {selectedPeriod} hari terakhir
                            </p>
                        </div>

                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Pengunjung Unik
                                </p>
                                <span className="text-2xl">👥</span>
                            </div>
                            <h3 className="text-4xl font-black text-brand-gold dark:text-brand-white tracking-tighter">
                                {formatNumber(stats?.uniqueVisitors || 0)}
                            </h3>
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-2">
                                Berdasarkan IP address
                            </p>
                        </div>

                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Rata-rata/Hari
                                </p>
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tighter">
                                {formatNumber(Math.round((stats?.totalViews || 0) / selectedPeriod))}
                            </h3>
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-2">
                                Kunjungan per hari
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Views by Page */}
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                            <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <span className="text-2xl">📄</span>
                                Kunjungan per Halaman
                            </h2>
                            <div className="space-y-4">
                                {stats?.viewsByPage && stats.viewsByPage.length > 0 ? (
                                    stats.viewsByPage.map((page, index) => (
                                        <Link
                                            key={index}
                                            href={`/admin/insights/page/${encodeURIComponent(page.page_name)}?days=${selectedPeriod}`}
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                                        >
                                            <div className="flex-1">
                                                <p className="font-black text-brand-black dark:text-brand-white group-hover:text-brand-red transition-colors">
                                                    {page.page_name}
                                                </p>
                                                <p className="text-xs text-brand-black/40 dark:text-brand-white/40">
                                                    {formatNumber(page.views)} viewers
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-brand-red/10 text-brand-red px-4 py-2 rounded-lg font-black text-sm">
                                                    {formatNumber(page.views)}
                                                </div>
                                                <svg className="w-5 h-5 text-brand-black/20 dark:text-brand-white/20 group-hover:text-brand-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-center text-brand-black/40 dark:text-brand-white/40 py-8">
                                        Belum ada data kunjungan
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Top URLs */}
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                            <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <span className="text-2xl">🔗</span>
                                URL Terpopuler
                            </h2>
                            <div className="space-y-4">
                                {stats?.topUrls && stats.topUrls.length > 0 ? (
                                    stats.topUrls.map((url, index) => (
                                        <div key={index} className="p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <p className="font-black text-brand-black dark:text-brand-white text-sm">
                                                    {url.page_name}
                                                </p>
                                                <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-lg font-black text-xs">
                                                    {formatNumber(url.views)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 truncate">
                                                {url.url}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-brand-black/40 dark:text-brand-white/40 py-8">
                                        Belum ada data URL
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-6 bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <span className="text-2xl">⏱️</span>
                            Aktivitas Terbaru
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-black/10 dark:border-white/10">
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            Waktu
                                        </th>
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            Halaman
                                        </th>
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            User
                                        </th>
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            IP Address
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentViews && stats.recentViews.length > 0 ? (
                                        stats.recentViews.map((view, index) => (
                                            <tr key={index} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5">
                                                <td className="py-3 px-4 text-sm text-brand-black dark:text-brand-white">
                                                    {new Date(view.viewed_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-brand-black dark:text-brand-white">
                                                    {view.page_name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-brand-black/60 dark:text-brand-white/60">
                                                    {view.user ? view.user.name : 'Guest'}
                                                </td>
                                                <td className="py-3 px-4 text-xs font-mono text-brand-black/40 dark:text-brand-white/40">
                                                    {view.ip_address}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-brand-black/40 dark:text-brand-white/40">
                                                Belum ada aktivitas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
