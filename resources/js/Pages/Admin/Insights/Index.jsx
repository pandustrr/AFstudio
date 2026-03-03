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

                    {/* Pricelist Statistics Section */}
                    <div className="mt-8 bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-brand-gold" />
                            Statistik Price List
                        </h2>

                        {stats?.pricelistStats ? (
                            <div className="space-y-4">
                                {/* Overview Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-brand-gold/5 border border-brand-gold/10 rounded-xl p-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-gold/60 mb-2">
                                            Total Kunjungan
                                        </p>
                                        <p className="text-2xl font-black text-brand-gold tracking-tighter">
                                            {formatNumber(stats.pricelistStats.totalViews || 0)}
                                        </p>
                                        <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                            Semua pengunjung price list
                                        </p>
                                    </div>

                                    <div className="bg-brand-red/5 border border-brand-red/10 rounded-xl p-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-red/60 mb-2">
                                            Pengunjung Unik
                                        </p>
                                        <p className="text-2xl font-black text-brand-red tracking-tighter">
                                            {formatNumber(stats.pricelistStats.uniqueVisitors || 0)}
                                        </p>
                                        <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                            Device unik yang mengakses
                                        </p>
                                    </div>

                                    <div className="bg-brand-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 mb-2">
                                            Bounce Rate
                                        </p>
                                        <p className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tighter">
                                            {stats.pricelistStats.uniqueVisitors > 0 
                                                ? Math.round((stats.pricelistStats.uniqueVisitors / stats.pricelistStats.totalViews) * 100) 
                                                : 0}%
                                        </p>
                                        <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                            Rasio pengunjung unik
                                        </p>
                                    </div>
                                </div>

                                {/* Pricelist Chart */}
                                <div className="border-t border-black/5 dark:border-white/5 pt-6 mt-6">
                                    <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4">
                                        Trend Kunjungan Price List
                                    </h3>
                                    {stats?.pricelistByDay && stats.pricelistByDay.length > 0 && typeof window !== 'undefined' ? (
                                        <Chart
                                            options={{
                                                chart: {
                                                    height: 250,
                                                    type: 'area',
                                                    toolbar: { show: false },
                                                    background: 'transparent',
                                                    zoom: { enabled: false }
                                                },
                                                colors: ['#D4AF37'],
                                                stroke: {
                                                    width: 2,
                                                    curve: 'smooth'
                                                },
                                                fill: {
                                                    type: 'gradient',
                                                    gradient: {
                                                        shadeIntensity: 1,
                                                        opacityFrom: 0.6,
                                                        opacityTo: 0.1,
                                                        stops: [0, 100]
                                                    }
                                                },
                                                dataLabels: {
                                                    enabled: false
                                                },
                                                xaxis: {
                                                    categories: stats.pricelistByDay.map(item => {
                                                        const date = new Date(item.date);
                                                        return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
                                                    }),
                                                    labels: {
                                                        style: {
                                                            colors: '#9CA3AF',
                                                            fontSize: '10px',
                                                            fontWeight: 700,
                                                        }
                                                    }
                                                },
                                                yaxis: {
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
                                                tooltip: {
                                                    theme: 'dark',
                                                    y: {
                                                        formatter: (val) => `${formatNumber(val)} visitors`
                                                    }
                                                },
                                                responsive: [{
                                                    breakpoint: 1024,
                                                    options: {
                                                        chart: {
                                                            height: 200
                                                        }
                                                    }
                                                }]
                                            }}
                                            series={[{
                                                name: 'Kunjungan',
                                                data: stats.pricelistByDay.map(item => item.views)
                                            }]}
                                            type="area"
                                            height={250}
                                        />
                                    ) : (
                                        <div className="h-[250px] flex items-center justify-center text-brand-black/40 dark:text-brand-white/40 text-sm">
                                            Belum ada data trend kunjungan
                                        </div>
                                    )}
                                </div>

                                {/* Category Distribution Chart */}
                                <div className="border-t border-black/5 dark:border-white/5 pt-6 mt-6">
                                    <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-4">
                                        Distribusi Kategori
                                    </h3>
                                    {stats?.pricelistStats?.topCategories && stats.pricelistStats.topCategories.length > 0 && typeof window !== 'undefined' ? (
                                        <Chart
                                            options={{
                                                chart: {
                                                    type: 'donut',
                                                    background: 'transparent',
                                                    toolbar: { show: false }
                                                },
                                                colors: ['#DC2626', '#D4AF37', '#3B82F6', '#10B981', '#8B5CF6'],
                                                plotOptions: {
                                                    pie: {
                                                        donut: {
                                                            size: '65%',
                                                            labels: {
                                                                show: true,
                                                                name: {
                                                                    fontSize: '12px',
                                                                    fontWeight: 700,
                                                                    color: '#6B7280'
                                                                },
                                                                value: {
                                                                    fontSize: '16px',
                                                                    fontWeight: 700,
                                                                    color: '#1F2937',
                                                                    formatter: (val) => formatNumber(val)
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                dataLabels: {
                                                    enabled: true,
                                                    formatter: (val) => `${Math.round(val)}%`,
                                                    style: {
                                                        fontSize: '11px',
                                                        fontWeight: 700
                                                    }
                                                },
                                                legend: {
                                                    position: 'bottom',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    labels: {
                                                        colors: '#6B7280'
                                                    }
                                                },
                                                tooltip: {
                                                    theme: 'dark',
                                                    y: {
                                                        formatter: (val) => `${formatNumber(val)} views`
                                                    }
                                                }
                                            }}
                                            series={stats.pricelistStats.topCategories.map(cat => cat.views)}
                                            labels={stats.pricelistStats.topCategories.map(cat => cat.category_name)}
                                            type="donut"
                                            height={300}
                                        />
                                    ) : (
                                        <div className="h-[300px] flex items-center justify-center text-brand-black/40 dark:text-brand-white/40 text-sm">
                                            Belum ada data distribusi kategori
                                        </div>
                                    )}
                                </div>

                                {/* Top Categories */}
                                <div className="border-t border-black/5 dark:border-white/5 pt-4">
                                    <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-3">
                                        Kategori Paling Diminati
                                    </h3>
                                    <div className="space-y-2">
                                        {stats.pricelistStats.topCategories && stats.pricelistStats.topCategories.length > 0 ? (
                                            stats.pricelistStats.topCategories.map((cat, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                                    <div className="flex-1">
                                                        <p className="font-black text-sm text-brand-black dark:text-brand-white">
                                                            {cat.category_name}
                                                        </p>
                                                        <p className="text-xs text-brand-black/40 dark:text-brand-white/40">
                                                            {formatNumber(cat.views)} views
                                                        </p>
                                                    </div>
                                                    <div className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-lg font-black text-xs">
                                                        {Math.round((cat.views / (stats.pricelistStats.totalViews || 1)) * 100)}%
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-brand-black/40 dark:text-brand-white/40 py-4 text-sm">
                                                Belum ada data kategori
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-4">
                                    <Link
                                        href="/admin/insights/page?page=price-list"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-gold text-brand-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        <DocumentTextIcon className="w-4 h-4" />
                                        Lihat Detail Lengkap
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <p className="text-brand-black/40 dark:text-brand-white/40 text-sm mb-2">
                                    Belum ada data price list
                                </p>
                                <p className="text-xs text-brand-black/30 dark:text-brand-white/30">
                                    Tunggu ada pengunjung yang mengakses halaman price list
                                </p>
                            </div>
                        )}
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

            {/* Jenis Interaksi - Detail Lengkap */}
            <div className="mt-8 bg-gradient-to-br from-brand-black to-brand-black/80 dark:from-white/5 dark:to-transparent border border-brand-gold/20 rounded-2xl p-6 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl -mr-16 -mt-16"></div>
                
                <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2 relative z-10">
                    <BoltIcon className="w-5 h-5 text-brand-gold" />
                    Jenis-Jenis Interaksi
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                    {[
                        {
                            type: 'Page View',
                            icon: '👁️',
                            desc: 'User mengakses halaman website',
                            color: 'brand-red'
                        },
                        {
                            type: 'Price List Click',
                            icon: '📋',
                            desc: 'User membuka halaman price list',
                            color: 'brand-gold'
                        },
                        {
                            type: 'Category Click',
                            icon: '🏷️',
                            desc: 'User memilih kategori paket',
                            color: 'brand-blue'
                        },
                        {
                            type: 'Cart Add',
                            icon: '🛒',
                            desc: 'User menambahkan paket ke cart',
                            color: 'brand-green'
                        },
                        {
                            type: 'Booking Start',
                            icon: '📅',
                            desc: 'User memulai proses booking',
                            color: 'brand-purple'
                        },
                        {
                            type: 'Payment Submit',
                            icon: '💳',
                            desc: 'User mengirimkan bukti pembayaran',
                            color: 'brand-orange'
                        },
                    ].map((interaction, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-brand-gold/30 transition-all">
                            <div className="text-3xl mb-2">{interaction.icon}</div>
                            <h3 className="font-black text-white text-sm uppercase tracking-tight mb-1">
                                {interaction.type}
                            </h3>
                            <p className="text-xs text-white/60 leading-relaxed">
                                {interaction.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 mt-6 pt-4 relative z-10">
                    <p className="text-xs text-white/50 italic">
                        💡 Setiap interaksi dicatat secara otomatis untuk analisis mendalam tentang perilaku user.
                    </p>
                </div>
            </div>

            {/* Interaksi Live - Detail Lengkap */}
            <div className="mt-8 bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                        Interaksi Live (Real-Time)
                    </h2>
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
                        Auto-refresh 30 detik
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-brand-red/5 border border-brand-red/10 rounded-xl p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-red/60 mb-2">
                            Total Interaksi
                        </p>
                        <p className="text-2xl font-black text-brand-red">
                            {stats?.eventStats?.reduce((sum, e) => sum + e.count, 0) || 0}
                        </p>
                    </div>

                    <div className="bg-brand-gold/5 border border-brand-gold/10 rounded-xl p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-gold/60 mb-2">
                            Jenis Event
                        </p>
                        <p className="text-2xl font-black text-brand-gold">
                            {stats?.eventStats?.length || 0}
                        </p>
                    </div>

                    <div className="bg-brand-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 mb-2">
                            Event Terbaru
                        </p>
                        <p className="text-2xl font-black text-brand-black dark:text-brand-white">
                            {stats?.recentInteractions?.length || 0}
                        </p>
                    </div>
                </div>

                {/* Event Distribution */}
                <div className="border-t border-black/5 dark:border-white/5 pt-4 mb-6">
                    <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-3">
                        Distribusi Event
                    </h3>
                    <div className="space-y-2">
                        {stats?.eventStats && stats.eventStats.length > 0 ? (
                            stats.eventStats.map((event, idx) => {
                                const totalEvents = stats.eventStats.reduce((sum, e) => sum + e.count, 0);
                                const percentage = Math.round((event.count / totalEvents) * 100);
                                return (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-bold text-brand-black dark:text-brand-white capitalize">
                                                    {event.event_type.replace(/_/g, ' ')}
                                                </p>
                                                <span className="text-xs font-black text-brand-black/40 dark:text-brand-white/40">
                                                    {event.count}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-brand-red to-brand-gold rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                                {percentage}% dari total events
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-brand-black/40 dark:text-brand-white/40 py-4 text-sm">
                                Belum ada data event
                            </p>
                        )}
                    </div>
                </div>

                {/* Live Stream */}
                <div className="border-t border-black/5 dark:border-white/5 pt-4">
                    <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                        Stream Live (15 event terakhir)
                    </h3>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
                        {stats?.recentInteractions && stats.recentInteractions.length > 0 ? (
                            stats.recentInteractions.map((inter, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 hover:border-brand-gold/30 transition-all">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black text-brand-red uppercase tracking-tight bg-brand-red/10 px-2 py-0.5 rounded whitespace-nowrap">
                                                {inter.event_type.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-[8px] text-brand-black/40 dark:text-brand-white/40 font-mono">
                                                {new Date(inter.created_at).toLocaleTimeString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-brand-black dark:text-brand-white truncate">
                                            {inter.item_name || inter.page_name || 'Unknown'}
                                        </p>
                                        {inter.payload && Object.keys(inter.payload).length > 0 && (
                                            <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 mt-1">
                                                📊 Payload: {JSON.stringify(inter.payload).substring(0, 50)}...
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse block"></span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-brand-black/40 dark:text-brand-white/40 py-6 italic text-xs font-black uppercase tracking-widest">
                                Menunggu interaksi live...
                            </p>
                        )}
                    </div>
                </div>

                <div className="border-t border-black/5 dark:border-white/5 mt-4 pt-4">
                    <p className="text-xs text-brand-black/40 dark:text-brand-white/40 italic">
                        🔄 Data ini terupdate otomatis setiap 30 detik. Setiap interaksi user akan muncul di sini dalam real-time untuk monitoring langsung.
                    </p>
                </div>
            </div>

            <style jsx>{`
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
