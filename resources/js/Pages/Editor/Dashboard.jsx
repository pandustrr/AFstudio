import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CameraIcon,
    ClockIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    ChevronRightIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

export default function EditorDashboard({ stats, latestSessions, recentActivity }) {
    const { auth } = usePage().props;

    const handleLogout = () => {
        router.post('/editor/logout', {}, {
            onSuccess: () => window.location.href = '/editor/login'
        });
    };

    return (
        <AdminLayout>
            <Head title="Editor Dashboard" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                {/* Header Section - More Compact */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-white/3 p-5 sm:p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold shrink-0">
                            <UserCircleIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-0.5 italic">Editor Space</h1>
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

                {/* Stats Grid - Smaller & Responsive */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                    {[
                        { label: 'Total Sesi', value: stats.total_sessions, icon: CameraIcon, color: 'text-brand-black dark:text-brand-white', status: 'all' },
                        { label: 'Pending', value: stats.pending_sessions, icon: ClockIcon, color: 'text-brand-red', status: 'pending' },
                        { label: 'Processing', value: stats.processing_sessions, icon: ArrowPathIcon, color: 'text-brand-gold', status: 'processing' },
                        { label: 'Selesai', value: stats.done_sessions, icon: CheckCircleIcon, color: 'text-green-500', status: 'done' },
                    ].map((stat, i) => (
                        <Link
                            key={i}
                            href={`/editor/photo-editing?status=${stat.status}`}
                            className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-6 shadow-lg hover:border-brand-gold/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 group-hover:text-brand-gold transition-colors">{stat.label}</p>
                                <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color} opacity-20 group-hover:opacity-100 transition-all`} />
                            </div>
                            <h3 className={`text-xl sm:text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Activity Feed - Refined spacing */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic">Aktifitas Terbaru</h2>
                        </div>

                        <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                            {recentActivity.length > 0 ? (
                                <div className="divide-y divide-black/5 dark:divide-white/5">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="p-4 sm:p-5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors flex items-center justify-between group">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black text-[10px] sm:text-xs">
                                                    {activity.customer_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] sm:text-xs font-black text-brand-black dark:text-brand-white uppercase tracking-tight">
                                                        {activity.customer_name} <span className="text-brand-black/40 dark:text-brand-white/40 font-medium lowercase">submitting selections</span>
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-0.5">
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-red">{activity.uid}</span>
                                                        <span className="text-[8px] font-bold text-brand-black/20 dark:text-brand-white/20 uppercase tracking-widest">
                                                            {new Date(activity.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/editor/photo-editing?uid=${activity.uid}`}
                                                className="p-1.5 sm:p-2 rounded-full hover:bg-brand-gold/20 text-brand-black/10 dark:text-brand-white/10 hover:text-brand-gold transition-all"
                                            >
                                                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-black uppercase tracking-widest">Belum ada aktifitas.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sesi Terbaru - More compact */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic">Sesi Terbaru</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            {latestSessions.map((session) => (
                                <Link
                                    key={session.id}
                                    href={`/editor/photo-editing?uid=${session.uid}`}
                                    className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 p-4 sm:p-5 rounded-2xl shadow-sm hover:border-brand-gold/50 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${session.status === 'done' ? 'bg-green-100 text-green-700' :
                                            session.status === 'processing' ? 'bg-brand-gold/10 text-brand-gold' :
                                                'bg-black/5 text-brand-black/40'
                                            }`}>
                                            {session.status}
                                        </div>
                                        <span className="text-[8px] font-black text-brand-red tracking-widest">{session.uid}</span>
                                    </div>
                                    <h4 className="font-black text-brand-black dark:text-brand-white uppercase tracking-tight group-hover:text-brand-gold transition-all text-xs mb-1 truncate">{session.customer_name}</h4>
                                    <div className="flex items-center gap-1.5 opacity-30">
                                        <CameraIcon className="w-2.5 h-2.5" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">{session.edit_requests_count} Req</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            href="/editor/photo-editing"
                            className="block w-full bg-black dark:bg-brand-white text-white dark:text-brand-black py-4 rounded-xl font-black uppercase text-[9px] tracking-widest text-center shadow-md hover:scale-[1.01] transition-all"
                        >
                            Lihat Semua Sesi
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
