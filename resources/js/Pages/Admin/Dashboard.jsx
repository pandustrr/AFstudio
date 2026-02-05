import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    CreditCardIcon,
    CalendarIcon,
    StarIcon,
    ArrowRightIcon,
    ChatBubbleLeftRightIcon,
    CameraIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, recentBookings, recentReviews }) {
    const { auth } = usePage().props;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

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
            <Head title="Admin Dashboard" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic leading-none">
                                SYSTEM <span className="text-brand-gold">OVERVIEW.</span>
                            </h1>
                            <p className="mt-4 text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                Selamat datang kembali, <span className="text-brand-black dark:text-brand-white">{auth.user.name}</span>. Pantau aktivitas AFstudio hari ini.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        {
                            label: 'Verifikasi Pembayaran',
                            value: stats.pending_payments,
                            desc: 'Perlu dicek segera',
                            icon: CreditCardIcon,
                            color: 'text-amber-500',
                            bg: 'bg-amber-500/10',
                            href: '/admin/bookings?status=pending'
                        },
                        {
                            label: 'Sesi Hari Ini',
                            value: stats.today_sessions,
                            desc: 'Jadwal yang sedang berjalan',
                            icon: CameraIcon,
                            color: 'text-brand-red',
                            bg: 'bg-brand-red/10',
                            href: '/admin/photographer-sessions'
                        },
                        {
                            label: 'Booking Besok',
                            value: stats.tomorrow_sessions,
                            desc: 'Jadwal mendatang',
                            icon: CalendarIcon,
                            color: 'text-brand-gold',
                            bg: 'bg-brand-gold/10',
                            href: '/admin/photographer-sessions'
                        },
                        {
                            label: 'Total Pending',
                            value: stats.pending_bookings,
                            desc: 'Booking belum dikonfirmasi',
                            icon: UserGroupIcon,
                            color: 'text-brand-black dark:text-brand-white',
                            bg: 'bg-black/5 dark:bg-white/5',
                            href: '/admin/bookings?status=pending'
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
                                    <p className="text-[8px] font-bold text-brand-black/30 dark:text-brand-white/30 uppercase mb-2">Items</p>
                                </div>
                                <p className="mt-4 text-[8px] font-black uppercase tracking-widest text-brand-black/30 dark:text-brand-white/30">{stat.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Bookings List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-black/60 dark:text-brand-white/60 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-brand-red rounded-full"></div>
                                Booking Terkini
                            </h2>
                            <Link href="/admin/bookings" className="text-[9px] font-black uppercase tracking-widest text-brand-red hover:underline flex items-center gap-2">
                                Semua Booking <ArrowRightIcon className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 text-center w-16">#</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Customer</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Paket / FG</th>
                                            <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Status</th>
                                            <th className="px-6 py-5"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                        {recentBookings.map((booking, idx) => (
                                            <tr key={booking.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-[10px] font-black text-brand-black/20 dark:text-brand-white/20 uppercase">#{idx + 1}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs font-black text-brand-black dark:text-brand-white uppercase truncate max-w-[150px]">{booking.name}</p>
                                                    <p className="text-[8px] font-bold text-brand-black/40 dark:text-brand-white/40 mt-1 uppercase">{booking.booking_code}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-black text-brand-gold uppercase tracking-tight truncate max-w-[150px]">
                                                            {booking.items[0]?.package?.name || '---'}
                                                        </span>
                                                        <span className="text-[8px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase">
                                                            FG: {booking.items[0]?.photographer?.name || '---'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        href={`/admin/bookings/${booking.id}`}
                                                        className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-red hover:text-white"
                                                    >
                                                        <ArrowRightIcon className="w-3 h-3" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {recentBookings.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-brand-black/20">Belum ada booking terbaru.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Action Cards Below Table */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Link href="/admin/photographer-sessions" className="bg-brand-red p-8 rounded-2xl group relative overflow-hidden shadow-2xl shadow-brand-red/20 transform hover:-translate-y-1 transition-all">
                                <div className="relative z-10">
                                    <CalendarIcon className="w-8 h-8 text-white/40 mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Kontrol Jadwal Sesi</h3>
                                    <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-2">Update ketersediaan fotografer & room.</p>
                                </div>
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                            </Link>

                            <Link href="/admin/photo-editing" className="bg-brand-gold p-8 rounded-2xl group relative overflow-hidden shadow-2xl shadow-brand-gold/20 transform hover:-translate-y-1 transition-all">
                                <div className="relative z-10 text-brand-black">
                                    <CameraIcon className="w-8 h-8 text-brand-black/30 mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic text-brand-black">Pusat Editor Photo</h3>
                                    <p className="text-brand-black/50 text-[9px] font-bold uppercase tracking-widest mt-2">Pantau request edit & hasil final.</p>
                                </div>
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-black/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Reviews Sidebar */}
                    <div className="space-y-6">
                        <div className="px-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-black/60 dark:text-brand-white/60 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full"></div>
                                Review Terkini
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
                            {recentReviews.map((review) => (
                                <div key={review.id} className="relative group">
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/10">
                                            <span className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 truncate px-1">{(review.name || 'NN').substring(0, 2)}</span>
                                        </div>
                                        <div>
                                            <div className="flex gap-0.5 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        className={`w-2.5 h-2.5 ${i < review.rating ? 'text-brand-gold fill-brand-gold' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase text-brand-black dark:text-brand-white tracking-tight">{review.name}</h4>
                                        </div>
                                    </div>
                                    <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl relative line-clamp-3">
                                        <div className="absolute top-0 left-4 -mt-2">
                                            <ChatBubbleLeftRightIcon className="w-4 h-4 text-brand-gold/30" />
                                        </div>
                                        <p className="text-[10px] leading-relaxed text-brand-black/50 dark:text-brand-white/50 italic italic">
                                            "{review.review_text}"
                                        </p>
                                    </div>
                                    <p className="mt-3 text-[7px] font-black uppercase tracking-[0.2em] text-center opacity-20 group-hover:opacity-100 transition-opacity">
                                        {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <div className="h-px bg-black/3 dark:bg-white/3 mt-6 group-last:hidden"></div>
                                </div>
                            ))}

                            {recentReviews.length === 0 && (
                                <div className="py-12 text-center">
                                    <StarIcon className="w-8 h-8 text-black/5 dark:text-white/5 mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/20">Belum ada review.</p>
                                </div>
                            )}

                            <Link
                                href="/admin/reviews"
                                className="block w-full text-center py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all"
                            >
                                Kelola Semua Review
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
