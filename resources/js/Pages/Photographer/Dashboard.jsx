import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ClockIcon,
    CalendarIcon,
    CameraIcon,
    BriefcaseIcon,
    ArrowRightIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, recentBookings, nextSession }) {
    const { auth } = usePage().props;

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500/10 text-green-500';
            case 'pending': return 'bg-amber-500/10 text-amber-500';
            case 'cancelled': return 'bg-red-500/10 text-red-500';
            case 'completed': return 'bg-blue-500/10 text-blue-500';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <AdminLayout>
            <Head title="Photographer Dashboard" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 rounded-full mb-4">
                                <CameraIcon className="w-3 h-3 text-brand-gold" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-brand-gold">Professional Workspace</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic leading-none">
                                SHOOT <span className="text-brand-red">DASHBOARD.</span>
                            </h1>
                            <p className="mt-4 text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                Selamat datang kembali, <span className="text-brand-black dark:text-brand-white">{auth.user.name}</span>. Mari ciptakan karya hebat hari ini.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        {
                            label: 'Booked Hari Ini',
                            value: stats.today_booked,
                            desc: 'Sesi yang menantimu hari ini',
                            icon: CameraIcon,
                            color: 'text-brand-red',
                            bg: 'bg-brand-red/10',
                            href: '/photographer/sessions'
                        },
                        {
                            label: 'Open Hari Ini',
                            value: stats.today_open,
                            desc: 'Slot kosong yang tersedia',
                            icon: SparklesIcon,
                            color: 'text-brand-gold',
                            bg: 'bg-brand-gold/10',
                            href: '/photographer/sessions'
                        },
                        {
                            label: 'Booked Besok',
                            value: stats.tomorrow_booked,
                            desc: 'Persiapan jadwal besok',
                            icon: CalendarIcon,
                            color: 'text-brand-black dark:text-brand-white',
                            bg: 'bg-black/5 dark:bg-white/5',
                            href: '/photographer/sessions'
                        },
                        {
                            label: 'Total Mendatang',
                            value: stats.total_upcoming,
                            desc: 'Semua sesi terkonfirmasi',
                            icon: BriefcaseIcon,
                            color: 'text-brand-black dark:text-brand-white',
                            bg: 'bg-black/5 dark:bg-white/5',
                            href: '/photographer/reservations'
                        },
                    ].map((stat, i) => (
                        <Link
                            key={i}
                            href={stat.href}
                            className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-8 shadow-xl hover:scale-[1.02] transition-all group overflow-hidden relative"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} -mr-8 -mt-8 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

                            <div className="relative">
                                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-1">{stat.label}</p>
                                <div className="flex items-end gap-2">
                                    <h3 className="text-4xl font-black text-brand-black dark:text-brand-white tracking-tighter">{stat.value}</h3>
                                    <p className="text-[8px] font-bold text-brand-black/30 dark:text-brand-white/30 uppercase mb-2">Sesi</p>
                                </div>
                                <p className="mt-4 text-[8px] font-black uppercase tracking-widest text-brand-black/30 dark:text-brand-white/30">{stat.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Next Session & Recent Bookings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Highlights: Next Session */}
                        {nextSession ? (
                            <div className="bg-brand-black dark:bg-white/5 rounded-2xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red opacity-10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Sesi Terdekat Menanti</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2">
                                                {nextSession.booking_item?.booking?.name || 'Customer'}
                                            </h3>
                                            <div className="flex items-center gap-4 text-white/60">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <ClockIcon className="w-3 h-3" />
                                                        <span className="text-[11px] font-bold uppercase">
                                                            {nextSession.booking_item?.start_time?.substring(0, 5) || '--:--'} - {nextSession.booking_item?.end_time?.substring(0, 5) || '--:--'}
                                                        </span>
                                                    </div>
                                                    <span className="px-2 py-0.5 bg-brand-gold/20 text-brand-gold rounded-full text-[9px] font-black uppercase tracking-widest border border-brand-gold/10">
                                                        {nextSession.booking_item?.sessions_count || nextSession.booking_item?.quantity || 0} Sesi
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                                                    <CalendarDaysIcon className="w-3 h-3" />
                                                    <span className="text-[11px] font-bold uppercase">
                                                        {nextSession.date ? new Date(nextSession.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '---'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-brand-gold mb-1">Paket Sesi</p>
                                            <p className="text-xs font-black uppercase tracking-tight">{nextSession.booking_item?.package?.name || 'Standard'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-2xl p-10 text-center">
                                <SparklesIcon className="w-8 h-8 text-black/10 dark:text-white/10 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/30">Tidak ada sesi mendesak saat ini.</p>
                            </div>
                        )}

                        {/* Recent Bookings List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-black/60 dark:text-brand-white/60 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-brand-red rounded-full"></div>
                                    Booking Anda
                                </h2>
                                <Link href="/photographer/reservations" className="text-[9px] font-black uppercase tracking-widest text-brand-red hover:underline flex items-center gap-2">
                                    Lihat Semua <ArrowRightIcon className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Customer</th>
                                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Paket</th>
                                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Sesi</th>
                                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs">
                                            {recentBookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-5 uppercase font-black tracking-tight text-brand-black dark:text-brand-white">{booking.name}</td>
                                                    <td className="px-6 py-5 uppercase font-bold text-brand-gold text-[10px]">{booking.items[0]?.package?.name}</td>
                                                    <td className="px-6 py-5 uppercase font-bold text-brand-black/40 dark:text-brand-white/40 text-[9px]">
                                                        {booking.items[0]?.scheduled_date ? new Date(booking.items[0].scheduled_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '---'}
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {recentBookings.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-brand-black/20 italic">Belum ada booking tertaut.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Quick Links */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-8 shadow-2xl space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-black/60 dark:text-brand-white/60">
                                Pintasan Kerja
                            </h2>
                            <div className="space-y-4">
                                <Link href="/photographer/sessions" className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-transparent hover:border-brand-red transition-all group">
                                    <div className="flex items-center gap-3">
                                        <CalendarDaysIcon className="w-5 h-5 text-brand-red" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Update Jadwal</span>
                                    </div>
                                    <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/photographer/reservations" className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-transparent hover:border-brand-gold transition-all group">
                                    <div className="flex items-center gap-3">
                                        <UserGroupIcon className="w-5 h-5 text-brand-gold" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">List Booking</span>
                                    </div>
                                    <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/photographer/profile" className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-transparent hover:border-brand-black transition-all group">
                                    <div className="flex items-center gap-3">
                                        <SparklesIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Pengaturan Akun</span>
                                    </div>
                                    <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="pt-6 border-t border-black/5 dark:border-white/5 text-center">
                                <p className="text-[8px] font-bold text-brand-black/30 dark:text-brand-white/30 uppercase tracking-widest leading-relaxed">
                                    Gunakan sidebar atau pintasan di atas untuk navigasi cepat antar kontrol sesi.
                                </p>
                            </div>
                        </div>

                        {/* Tip/Info Card */}
                        <div className="bg-linear-to-br from-brand-red to-brand-black p-8 rounded-2xl text-white relative overflow-hidden">
                            <SparklesIcon className="absolute -bottom-4 -left-4 w-24 h-24 text-white/5 rotate-12" />
                            <h4 className="text-xs font-black uppercase tracking-widest mb-2 relative">Tips FG Studio</h4>
                            <p className="text-[10px] font-medium leading-relaxed opacity-60 relative">
                                Pastikan untuk selalu memperbarui ketersediaan slot sesi (Open) agar customer dapat membooking jadwal Anda secara real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
