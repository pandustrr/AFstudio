import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, UsersIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import FilterSection from './FilterSection';

export default function PageDetails({ pageName, pageViews, filters = {}, filterOptions = {}, monthNames = {} }) {
    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    // Calculate stats from pageViews data
    const totalViews = pageViews?.total || 0;
    const uniqueVisitors = pageViews?.data ?
        new Set(pageViews.data.map(v => v.device_hash)).size : 0;

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value, page: pageName };

        // Reset dependent fields
        if (field === 'year' && !value) {
            newFilters.month = '';
            newFilters.day = '';
        } else if (field === 'month' && !value) {
            newFilters.day = '';
        }

        // Clear period selection when using custom date
        delete newFilters.days;

        router.get('/admin/insights/page', newFilters, { preserveState: true });
    };

    const handleSetToday = () => {
        const today = new Date();
        router.get('/admin/insights/page', {
            page: pageName,
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate(),
        }, { preserveState: true });
    };

    const handlePeriodChange = (days) => {
        router.get('/admin/insights/page', { page: pageName, days }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title={`${pageName} - Insights`} />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/admin/insights"
                            className="inline-flex items-center gap-2 text-brand-black/60 dark:text-brand-white/60 hover:text-brand-red transition-colors mb-4"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            <span className="font-black text-xs uppercase tracking-widest">Kembali ke Insights</span>
                        </Link>

                        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1 italic">
                            {pageName}
                        </h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest mb-4">
                            Detail statistik halaman
                        </p>

                        {/* Filter Section */}
                        <FilterSection
                            filters={filters}
                            options={filterOptions}
                            monthNames={monthNames}
                            onFilterChange={handleFilterChange}
                            onSetToday={handleSetToday}
                            onSetPeriod={handlePeriodChange}
                            selectedPeriod={filters?.days || null}
                        />
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-5 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Total Kunjungan
                                </p>
                                <div className="w-8 h-8 bg-brand-red/10 rounded-lg flex items-center justify-center">
                                    <EyeIcon className="w-4 h-4 text-brand-red" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-brand-red tracking-tighter">
                                {formatNumber(totalViews)}
                            </h3>
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                Periode yang dipilih
                            </p>
                        </div>

                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-5 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Pengunjung Unik
                                </p>
                                <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center">
                                    <UsersIcon className="w-4 h-4 text-brand-gold" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-brand-gold tracking-tighter">
                                {formatNumber(uniqueVisitors)}
                            </h3>
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                Berdasarkan device
                            </p>
                        </div>
                    </div>


                    {/* Detailed Page Views Table */}
                    <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                            Detail Kunjungan
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-black/10 dark:border-white/10">
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            Waktu
                                        </th>
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            URL
                                        </th>
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            User
                                        </th>
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            IP Address
                                        </th>
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            User Agent
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageViews.data && pageViews.data.length > 0 ? (
                                        pageViews.data.map((view, index) => (
                                            <tr key={index} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5">
                                                <td className="py-2 px-3 text-xs text-brand-black dark:text-brand-white whitespace-nowrap">
                                                    {new Date(view.viewed_at).toLocaleString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="py-2 px-3 text-xs text-brand-black/60 dark:text-brand-white/60 max-w-xs truncate">
                                                    {view.url}
                                                </td>
                                                <td className="py-2 px-3 text-xs text-brand-black dark:text-brand-white">
                                                    {view.user ? view.user.name : 'Guest'}
                                                </td>
                                                <td className="py-2 px-3 text-xs font-mono text-brand-black/40 dark:text-brand-white/40">
                                                    {view.ip_address}
                                                </td>
                                                <td className="py-2 px-3 text-xs text-brand-black/40 dark:text-brand-white/40 max-w-xs truncate">
                                                    {view.user_agent}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-6 text-center text-brand-black/40 dark:text-brand-white/40 text-sm">
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
                                            className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${link.active
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
