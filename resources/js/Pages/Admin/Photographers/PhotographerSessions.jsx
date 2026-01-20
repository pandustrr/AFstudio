import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
    CalendarIcon,
    UserIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    AdjustmentsHorizontalIcon,
    ArrowsRightLeftIcon,
    InformationCircleIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';

export default function PhotographerSessions({ photographers, grid, selectedDate, selectedPhotographerId }) {
    const [selectedSession, setSelectedSession] = useState(null);
    const [isOffsetModalOpen, setIsOffsetModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    const [offsetData, setOffsetData] = useState({ minutes: 0, description: '' });
    const [rescheduleData, setRescheduleData] = useState({ newTime: '' });

    const changeDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        const formattedDate = date.toISOString().split('T')[0];
        fetchData({ date: formattedDate });
    };

    const handlePhotographerChange = (id) => {
        fetchData({ photographer_id: id });
    };

    const fetchData = (params) => {
        router.get('/admin/photographer-sessions', {
            date: selectedDate,
            photographer_id: selectedPhotographerId,
            ...params
        }, { preserveScroll: true });
    };

    const openOffsetModal = (session) => {
        setSelectedSession(session);
        setOffsetData({
            minutes: session.offset_minutes || 0,
            description: session.offset_description || ''
        });
        setIsOffsetModalOpen(true);
    };

    const submitOffset = () => {
        router.post('/admin/photographer-sessions/offset', {
            session_id: selectedSession.session_id,
            offset_minutes: offsetData.minutes,
            offset_description: offsetData.description
        }, {
            onSuccess: () => setIsOffsetModalOpen(false)
        });
    };

    const openRescheduleModal = (session) => {
        setSelectedSession(session);
        setRescheduleData({ newTime: session.time_full });
        setIsRescheduleModalOpen(true);
    };

    const submitReschedule = () => {
        router.post('/admin/photographer-sessions/reschedule', {
            session_id: selectedSession.session_id,
            new_start_time: rescheduleData.newTime
        }, {
            onSuccess: () => setIsRescheduleModalOpen(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Jadwal FG" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                {/* Filters */}
                <div className="bg-white dark:bg-white/3 p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-1">Kontrol Sesi Fotografer</h1>
                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">Atur ketersediaan dan penyesuaian waktu fotografer</p>
                            </div>
                            <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-2 rounded-xl w-fit">
                                <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white dark:hover:bg-brand-black rounded-lg transition-all"><ChevronLeftIcon className="w-5 h-5" /></button>
                                <div className="flex items-center gap-3 px-4">
                                    <CalendarIcon className="w-5 h-5 text-brand-gold" />
                                    <span className="text-sm font-black uppercase tracking-tight">{new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <button onClick={() => changeDate(1)} className="p-2 hover:bg-white dark:hover:bg-brand-black rounded-lg transition-all"><ChevronRightIcon className="w-5 h-5" /></button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-brand-black/40 dark:text-brand-white/40 ml-1">Pilih Fotografer</label>
                            <select
                                value={selectedPhotographerId || ''}
                                onChange={(e) => handlePhotographerChange(e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-tight"
                            >
                                <option value="">Pilih FG...</option>
                                {photographers.map(fg => <option key={fg.id} value={fg.id}>{fg.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Session Grid */}
                {!selectedPhotographerId ? (
                    <div className="py-20 text-center bg-white dark:bg-white/3 rounded-3xl border border-dashed border-black/10 dark:border-white/10">
                        <UserIcon className="w-12 h-12 mx-auto text-brand-black/10 mb-4" />
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">Silakan pilih fotografer terlebih dahulu</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {grid.map((item, index) => (
                            <div
                                key={index}
                                className={`p-5 rounded-2xl border transition-all ${item.status === 'open' ? 'bg-brand-gold/5 border-brand-gold/30' :
                                    item.status === 'booked' ? 'bg-green-500/5 border-green-500/30' :
                                        'bg-white dark:bg-white/3 border-black/5 dark:border-white/5 opacity-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-brand-black/40 mb-1">Sesi {index + 1}</p>
                                        <h3 className="text-xl font-black text-brand-black dark:text-brand-white tracking-tighter">{item.time}</h3>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${item.status === 'open' ? 'bg-brand-gold/20 text-brand-gold' :
                                        item.status === 'booked' ? 'bg-green-500/20 text-green-500' :
                                            'bg-black/10 text-brand-black/40'
                                        }`}>
                                        {item.status}
                                    </div>
                                </div>

                                {item.status === 'booked' && item.booking_info && (
                                    <div className="mb-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                                        <p className="text-[9px] font-black uppercase text-green-600 truncate">{item.booking_info.customer_name}</p>
                                        <p className="text-[7px] font-bold uppercase text-brand-black/40 truncate">{item.booking_info.package_name}</p>
                                    </div>
                                )}

                                {item.status !== 'off' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openOffsetModal(item)}
                                            className="flex-1 bg-black dark:bg-white text-white dark:text-brand-black p-2 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-all"
                                        >
                                            <AdjustmentsHorizontalIcon className="w-4 h-4" />
                                            <span className="text-[8px] font-black uppercase">Offset</span>
                                        </button>
                                        <button
                                            onClick={() => openRescheduleModal(item)}
                                            className="flex-1 bg-brand-gold text-brand-black p-2 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-all"
                                        >
                                            <ArrowsRightLeftIcon className="w-4 h-4" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Move</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Offset Modal */}
            <Modal show={isOffsetModalOpen} onClose={() => setIsOffsetModalOpen(false)} maxWidth="md" closeable={false}>
                <div className="p-8">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic mb-4">Set Offset Waktu</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-black tracking-widest text-brand-black/40 block mb-2">Menit Offset (+ / -)</label>
                            <input
                                type="number"
                                value={offsetData.minutes}
                                onChange={(e) => setOffsetData({ ...offsetData, minutes: e.target.value })}
                                className="w-full bg-black/5 rounded-xl px-4 py-3"
                            />
                            <p className="text-[8px] font-medium text-brand-black/40 mt-1 italic">* Contoh: 10 untuk telat 10 menit, -10 untuk lebih cepat 10 menit.</p>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-black tracking-widest text-brand-black/40 block mb-2">Keterangan</label>
                            <textarea
                                value={offsetData.description}
                                onChange={(e) => setOffsetData({ ...offsetData, description: e.target.value })}
                                className="w-full bg-black/5 rounded-xl px-4 py-3 h-20"
                                placeholder="Alasan offset..."
                            />
                        </div>
                        <button onClick={submitOffset} className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest">Simpan Offset</button>
                    </div>
                </div>
            </Modal>

            {/* Reschedule Modal */}
            <Modal show={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)} maxWidth="md" closeable={false}>
                <div className="p-8">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic mb-4">Pindah Sesi</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-black tracking-widest text-brand-black/40 block mb-2">Pilih Sesi Baru</label>
                            <input
                                type="time"
                                step="1800"
                                value={rescheduleData.newTime}
                                onChange={(e) => setRescheduleData({ ...rescheduleData, newTime: e.target.value })}
                                className="w-full bg-black/5 rounded-xl px-4 py-3"
                            />
                        </div>
                        <div className="bg-brand-gold/10 p-4 rounded-xl flex items-start gap-3">
                            <InformationCircleIcon className="w-5 h-5 text-brand-gold shrink-0" />
                            <p className="text-[9px] font-bold text-brand-gold uppercase leading-relaxed">Pastikan slot tujuan tersedia (Status: Off) atau pindahkan antar slot ketersediaan FG.</p>
                        </div>
                        <button onClick={submitReschedule} className="w-full bg-brand-gold text-brand-black py-4 rounded-xl font-black uppercase tracking-widest">Update Jadwal</button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
