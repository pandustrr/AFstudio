import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, UsersIcon, ChartBarIcon, DocumentTextIcon, LinkIcon, BoltIcon, ClockIcon } from '@heroicons/react/24/outline';
import FilterSection from './FilterSection';
import Chart from 'react-apexcharts';

export default function Index({ stats = {}, filters = {}, filterOptions = {}, monthNames = {} }) {
    const [selectedPeriod, setSelectedPeriod] = useState(filters?.days || null);

    const handlePeriodChange = (days) => {
        setSelectedPeriod(days);
        router.get('/admin/insights', { days }, { preserveState: true });
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };

        // Reset dependent fields
        if (field === 'year' && !value) {
            newFilters.month = '';
            newFilters.day = '';
        } else if (field === 'month' && !value) {
            newFilters.day = '';
        }

        // Clear period selection when using custom date
        delete newFilters.days;
        setSelectedPeriod(null);

        router.get('/admin/insights', newFilters, { preserveState: true });
    };

    const handleSetToday = () => {
        const today = new Date();
        router.get('/admin/insights', {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate(),
        }, { preserveState: true });
        setSelectedPeriod(null);
    };

    // Auto-refresh every 30 seconds for real-time feel
    React.useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['stats'], preserveScroll: true });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num || 0);
    };


    // Prepare chart data - Mixed Bar + Line
    const chartData = {
        series: [
            {
                name: 'Kunjungan',
                type: 'column',
                data: stats?.viewsByDay?.map(item => item.views) || []
            },
            {
                name: 'Tren',
                type: 'line',
                data: stats?.viewsByDay?.map(item => item.views) || []
            }
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                stacked: false,
                toolbar: { show: false },
                background: 'transparent',
                zoom: { enabled: false }
            },
            colors: ['#DC2626', '#D4AF37'],
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    borderRadius: 6,
                }
            },
            stroke: {
                width: [0, 4],
                curve: 'smooth'
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                opacity: [0.85, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100]
                }
            },
            labels: stats?.viewsByDay?.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            }) || [],
            markers: {
                size: 0
            },
            xaxis: {
                labels: {
                    style: {
                        colors: '#9CA3AF',
                        fontSize: '10px',
                        fontWeight: 700,
                    },
                    rotate: -45,
                    rotateAlways: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Jumlah Pengunjung',
                    style: {
                        color: '#9CA3AF',
                        fontSize: '11px',
                        fontWeight: 700,
                    }
                },
                labels: {
                    style: {
                        colors: '#9CA3AF',
                        fontSize: '10px',
                        fontWeight: 700,
                    },
                    formatter: (val) => formatNumber(Math.round(val))
                }
            },
            grid: {
                borderColor: '#E5E7EB',
                strokeDashArray: 4,
                padding: {
                    top: 0,
                    right: 10,
                    bottom: 0,
                    left: 10
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '11px',
                fontWeight: 700,
                labels: {
                    colors: '#6B7280'
                },
                markers: {
                    width: 10,
                    height: 10,
                    radius: 3,
                }
            },
            tooltip: {
                theme: 'dark',
                shared: true,
                intersect: false,
                y: {
                    formatter: (val) => `${formatNumber(val)} pengunjung`
                }
            }
        }
    };

    return (
        <AdminLayout>
            <Head title="Insights - Admin Dashboard" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1 italic">
                                Insights
                            </h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest">
                                Statistik & analitik pengunjung website
                            </p>
                        </div>

                        {/* Filter Section */}
                        <FilterSection
                            filters={filters}
                            options={filterOptions}
                            monthNames={monthNames}
                            onFilterChange={handleFilterChange}
                            onSetToday={handleSetToday}
                            onSetPeriod={handlePeriodChange}
                            selectedPeriod={selectedPeriod}
                        />
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                                {formatNumber(stats?.totalViews || 0)}
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
                                {formatNumber(stats?.uniqueVisitors || 0)}
                            </h3>
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                Berdasarkan device
                            </p>
                        </div>

                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-5 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Rata-rata/Hari
                                </p>
                                <div className="w-8 h-8 bg-brand-black/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
                                    <ChartBarIcon className="w-4 h-4 text-brand-black dark:text-brand-white" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-brand-black dark:text-brand-white tracking-tighter">
                                {formatNumber(Math.round((stats?.totalViews || 0) / (stats?.viewsByDay?.length || 1)))}
                            </h3>
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                Kunjungan per hari
                            </p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg mb-8">
                        <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-brand-red" />
                            Tren Kunjungan
                        </h2>
                        {typeof window !== 'undefined' && stats?.viewsByDay?.length > 0 ? (
                            <Chart
                                options={chartData.options}
                                series={chartData.series}
                                type="line"
                                height={350}
                            />
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-brand-black/40 dark:text-brand-white/40 text-sm">
                                Tidak ada data untuk ditampilkan
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Views by Page */}
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                                <DocumentTextIcon className="w-5 h-5 text-brand-red" />
                                Kunjungan per Halaman
                            </h2>
                            <div className="space-y-2">
                                {stats?.viewsByPage && stats.viewsByPage.length > 0 ? (
                                    stats.viewsByPage.map((page, index) => {
                                        // Build query params based on current filter
                                        const queryParams = new URLSearchParams();
                                        queryParams.set('page', page.page_name);
                                        if (filters.days) queryParams.set('days', filters.days);
                                        if (filters.year) queryParams.set('year', filters.year);
                                        if (filters.month) queryParams.set('month', filters.month);
                                        if (filters.day) queryParams.set('day', filters.day);

                                        return (
                                            <Link
                                                key={index}
                                                href={`/admin/insights/page?${queryParams.toString()}`}
                                                className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-black text-sm text-brand-black dark:text-brand-white group-hover:text-brand-red transition-colors">
                                                        {page.page_name}
                                                    </p>
                                                    <p className="text-xs text-brand-black/40 dark:text-brand-white/40">
                                                        {formatNumber(page.views)} viewers
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-brand-red/10 text-brand-red px-3 py-1 rounded-lg font-black text-xs">
                                                        {formatNumber(page.views)}
                                                    </div>
                                                    <svg className="w-4 h-4 text-brand-black/20 dark:text-brand-white/20 group-hover:text-brand-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-brand-black/40 dark:text-brand-white/40 py-6 text-sm">
                                        Belum ada data kunjungan
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Top URLs */}
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-brand-gold" />
                                URL Terpopuler
                            </h2>
                            <div className="space-y-2">
                                {stats?.topUrls && stats.topUrls.length > 0 ? (
                                    stats.topUrls.map((url, index) => (
                                        <div key={index} className="p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                            <div className="flex items-start justify-between mb-1">
                                                <p className="font-black text-brand-black dark:text-brand-white text-sm">
                                                    {url.page_name}
                                                </p>
                                                <span className="bg-brand-gold/10 text-brand-gold px-2 py-1 rounded-lg font-black text-xs">
                                                    {formatNumber(url.views)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 truncate">
                                                {url.url}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-brand-black/40 dark:text-brand-white/40 py-6 text-sm">
                                        Belum ada data URL
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                        {/* Event Distribution */}
                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                                <BoltIcon className="w-5 h-5 text-brand-red" />
                                Jenis Interaksi
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {stats?.eventStats?.map((event, idx) => (
                                    <div key={idx} className="bg-brand-red/5 border border-brand-red/10 px-4 py-3 rounded-xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-red/60 mb-1">{event.event_type.replace('_', ' ')}</p>
                                        <p className="text-xl font-black text-brand-black dark:text-brand-white tracking-tighter">{formatNumber(event.count)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Interactions (Flashy Real-time List) */}
                        <div className="bg-brand-black dark:bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -mr-16 -mt-16"></div>
                            <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2 relative z-10">
                                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                                Interaksi Live
                            </h2>
                            <div className="space-y-2 relative z-10 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {stats?.recentInteractions?.length > 0 ? (
                                    stats.recentInteractions.map((inter, idx) => (
                                        <div key={idx} className="flex flex-col p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-brand-gold/30 transition-all">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[9px] font-black text-brand-gold uppercase tracking-tighter">{inter.event_type.replace('_', ' ')}</span>
                                                <span className="text-[8px] text-white/30 font-mono tracking-widest">{new Date(inter.created_at).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-xs font-bold text-white uppercase tracking-wide truncate">
                                                {inter.item_name || inter.page_name}
                                            </p>
                                            {inter.payload?.mode && (
                                                <span className="text-[8px] text-white/40 mt-0.5 uppercase font-black italic">Mode: {inter.payload.mode}</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-white/30 py-6 italic uppercase text-[10px] font-black tracking-widest">Belum ada interaksi live</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Page Activity */}
                    <div className="mt-6 bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                            Log Kunjungan Terbaru
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-black/10 dark:border-white/10">
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            Waktu
                                        </th>
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            Halaman
                                        </th>
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            User
                                        </th>
                                        <th className="text-left py-2 px-3 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            IP Address
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentViews && stats.recentViews.length > 0 ? (
                                        stats.recentViews.map((view, index) => (
                                            <tr key={index} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5">
                                                <td className="py-2 px-3 text-xs text-brand-black dark:text-brand-white">
                                                    {new Date(view.viewed_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="py-2 px-3 font-bold text-sm text-brand-black dark:text-brand-white">
                                                    {view.page_name}
                                                </td>
                                                <td className="py-2 px-3 text-xs text-brand-black/60 dark:text-brand-white/60">
                                                    {view.user ? view.user.name : 'Guest'}
                                                </td>
                                                <td className="py-2 px-3 text-xs font-mono text-brand-black/40 dark:text-brand-white/40">
                                                    {view.ip_address}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-6 text-center text-brand-black/40 dark:text-brand-white/40 text-sm">
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

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 0.5);
                }
            `}</style>
        </AdminLayout>
    );
}
