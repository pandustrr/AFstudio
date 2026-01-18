import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function PageDetails({ pageName, pageViews, stats, filters }) {
    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <AdminLayout>
            <Head title={`${pageName} - Insights`} />

            <div className="pt-12 lg:pt-20 pb-20 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <Link
                            href="/admin/insights"
                            className="inline-flex items-center gap-2 text-brand-black/60 dark:text-brand-white/60 hover:text-brand-red transition-colors mb-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-black text-xs uppercase tracking-widest">Kembali ke Insights</span>
                        </Link>

                        <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-2 italic">
                            {pageName}
                        </h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest">
                            Detail statistik halaman ({filters.days} hari terakhir)
                        </p>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Total Views
                                </p>
                                <span className="text-2xl">👁️</span>
                            </div>
                            <h3 className="text-4xl font-black text-brand-red dark:text-brand-white tracking-tighter">
                                {formatNumber(stats.totalViews)}
                            </h3>
                        </div>

                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Unique Visitors
                                </p>
                                <span className="text-2xl">👥</span>
                            </div>
                            <h3 className="text-4xl font-black text-brand-gold dark:text-brand-white tracking-tighter">
                                {formatNumber(stats.uniqueVisitors)}
                            </h3>
                        </div>
                    </div>

                    {/* Detailed Page Views Table */}
                    <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <span className="text-2xl">📋</span>
                            Detail Kunjungan
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-black/10 dark:border-white/10">
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            Waktu
                                        </th>
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            URL
                                        </th>
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            User
                                        </th>
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            IP Address
                                        </th>
                                        <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            User Agent
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageViews.data && pageViews.data.length > 0 ? (
                                        pageViews.data.map((view, index) => (
                                            <tr key={index} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5">
                                                <td className="py-3 px-4 text-sm text-brand-black dark:text-brand-white whitespace-nowrap">
                                                    {new Date(view.viewed_at).toLocaleString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-brand-black/60 dark:text-brand-white/60 max-w-xs truncate">
                                                    {view.url}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-brand-black dark:text-brand-white">
                                                    {view.user ? view.user.name : 'Guest'}
                                                </td>
                                                <td className="py-3 px-4 text-xs font-mono text-brand-black/40 dark:text-brand-white/40">
                                                    {view.ip_address}
                                                </td>
                                                <td className="py-3 px-4 text-xs text-brand-black/40 dark:text-brand-white/40 max-w-xs truncate">
                                                    {view.user_agent}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-brand-black/40 dark:text-brand-white/40">
                                                Tidak ada data kunjungan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pageViews.data && pageViews.data.length > 0 && (
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm text-brand-black/60 dark:text-brand-white/60">
                                    Menampilkan <span className="font-bold">{pageViews.from}</span> - <span className="font-bold">{pageViews.to}</span> dari <span className="font-bold">{pageViews.total}</span> hasil
                                </p>

                                <div className="flex gap-2">
                                    {pageViews.links && pageViews.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${
                                                link.active
                                                    ? 'bg-brand-red text-white'
                                                    : 'bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 text-brand-black dark:text-brand-white hover:border-brand-red'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
