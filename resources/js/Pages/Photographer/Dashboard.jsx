import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ChevronRightIcon,
    UserCircleIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function PhotographerDashboard({ stats, recentBookings }) {
    const { auth } = usePage().props;

    const handleLogout = () => {
        router.post('/photographer/logout', {}, {
            onSuccess: () => window.location.href = '/photographer/login'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'confirmed': return 'bg-brand-gold/10 text-brand-gold';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-black/5 text-brand-black/40';
        }
    };

    return (
        <AdminLayout>
            <Head title="Photographer Dashboard" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-white/3 p-5 sm:p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold shrink-0">
                            <BriefcaseIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-0.5 italic">Photographer Panel</h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-black uppercase tracking-widest leading-none">
                                Sesion: <span className="text-brand-gold">{auth.user.name}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full sm:w-auto bg-brand-red hover:bg-black text-white px-6 py-3 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        Keluar Sesi
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                    {[
                        { label: 'Total Booking', value: stats.total_bookings, icon: CalendarDaysIcon, color: 'text-brand-black dark:text-brand-white', status: 'all' },
                        { label: 'Pending', value: stats.pending_bookings, icon: ClockIcon, color: 'text-yellow-600', status: 'pending' },
                        { label: 'Dikonfirmasi', value: stats.confirmed_bookings, icon: ExclamationCircleIcon, color: 'text-brand-gold', status: 'confirmed' },
                        { label: 'Selesai', value: stats.completed_bookings, icon: CheckCircleIcon, color: 'text-green-500', status: 'completed' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-6 shadow-lg hover:border-brand-gold/30 hover:scale-[1.02] transition-all group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 group-hover:text-brand-gold transition-colors">{stat.label}</p>
                                <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color} opacity-20 group-hover:opacity-100 transition-all`} />
                            </div>
                            <h3 className={`text-xl sm:text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                    {/* Recent Bookings */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic">Booking Terbaru</h2>
                        </div>

                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                            {recentBookings.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-black/2 dark:bg-white/2">
                                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Customer</th>
                                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Status</th>
                                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Tanggal</th>
                                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                            {recentBookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-black/1 dark:hover:bg-white/1 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black text-[10px]">
                                                                {booking.customer_name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-brand-black dark:text-brand-white uppercase tracking-tight">{booking.customer_name}</p>
                                                                <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 font-bold uppercase">{booking.booking_code}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-[10px] font-bold text-brand-black/60 dark:text-brand-white/60 uppercase">
                                                            {new Date(booking.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={`#`}
                                                            className="inline-flex items-center gap-1.5 text-brand-gold hover:text-brand-black dark:hover:text-brand-white transition-colors"
                                                        >
                                                            <span className="text-[9px] font-black uppercase tracking-widest">Detail</span>
                                                            <ChevronRightIcon className="w-3 h-3" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-black uppercase tracking-widest">Belum ada booking.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
