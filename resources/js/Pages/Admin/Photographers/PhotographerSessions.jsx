import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
    CalendarIcon,
    UserIcon,
    ChevronDownIcon,
    ClockIcon,
    AdjustmentsHorizontalIcon,
    ArrowsRightLeftIcon,
    InformationCircleIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';

export default function PhotographerSessions({ photographers, grid, selectedDate, selectedPhotographerId, filters, options }) {
    const [selectedSession, setSelectedSession] = useState(null);
    const [isOffsetModalOpen, setIsOffsetModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    const [offsetData, setOffsetData] = useState({ minutes: 0, description: '' });
    const [rescheduleData, setRescheduleData] = useState({ newTime: '' });

    const monthNames = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const handlePhotographerChange = (id) => {
        fetchData({ photographer_id: id });
    };

    const handleFilter = (type, value) => {
        const newFilters = {
            ...filters,
            [type]: value,
            photographer_id: selectedPhotographerId
        };

        if (type === 'year') {
            newFilters.month = '';
            newFilters.day = '';
        } else if (type === 'month') {
            newFilters.day = '';
        }

        router.get('/admin/photographer-sessions', newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const setToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        router.get('/admin/photographer-sessions', {
            photographer_id: selectedPhotographerId,
            year: year.toString(),
            month: month.toString(),
            day: day.toString(),
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const fetchData = (params) => {
        router.get('/admin/photographer-sessions', {
            photographer_id: selectedPhotographerId,
            year: filters.year,
            month: filters.month,
            day: filters.day,
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
                    {/* Title Section - Now on Top */}
                    <div className="mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                        <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-1">Kontrol Sesi Fotografer</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">Atur ketersediaan dan penyesuaian waktu fotografer</p>
                    </div>

                    {/* Filters Section - Below Title */}
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="space-y-1.5 flex-none">
                            <label className="text-[9px] uppercase font-black tracking-widest text-brand-black/30 dark:text-brand-white/30 ml-1">Pilih Fotografer</label>
                            <select
                                value={selectedPhotographerId || ''}
                                onChange={(e) => handlePhotographerChange(e.target.value)}
                                className="w-full lg:w-48 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest focus:ring-brand-gold focus:border-brand-gold transition-all cursor-pointer"
                            >
                                <option value="" className="bg-white dark:bg-brand-black">Pilih FG...</option>
                                {photographers.map(fg => <option key={fg.id} value={fg.id} className="bg-white dark:bg-brand-black">{fg.name}</option>)}
                            </select>
                        </div>

                        <div className="w-px h-10 bg-black/5 dark:bg-white/5 hidden lg:block self-end mb-1"></div>

                        <div className="space-y-1.5 flex-1 lg:flex-none">
                            <label className="text-[9px] uppercase font-black tracking-widest text-brand-black/30 dark:text-brand-white/30 ml-1">Pilih Tanggal</label>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Compact Date Filters */}
                                <div className="flex items-center gap-0.5 p-1 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 w-fit shadow-sm">
                                    <div className="relative group">
                                        <select
                                            value={filters.year || ''}
                                            onChange={(e) => handleFilter('year', e.target.value)}
                                            className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <option value="" className="bg-white dark:bg-brand-black">Year</option>
                                            {options.years.map((year) => (
                                                <option key={year} value={year} className="bg-white dark:bg-brand-black">{year}</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                    </div>

                                    <div className="w-px h-3 bg-black/10 dark:bg-white/10"></div>

                                    <div className="relative group">
                                        <select
                                            value={filters.month || ''}
                                            onChange={(e) => handleFilter('month', e.target.value)}
                                            disabled={!filters.year}
                                            className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                        >
                                            <option value="" className="bg-white dark:bg-brand-black">Month</option>
                                            {options.months.map((month) => (
                                                <option key={month} value={month} className="bg-white dark:bg-brand-black">{monthNames[month]}</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                    </div>

                                    <div className="w-px h-3 bg-black/10 dark:bg-white/10"></div>

                                    <div className="relative group">
                                        <select
                                            value={filters.day || ''}
                                            onChange={(e) => handleFilter('day', e.target.value)}
                                            disabled={!filters.month}
                                            className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                        >
                                            <option value="" className="bg-white dark:bg-brand-black">Day</option>
                                            {options.days.map((day) => (
                                                <option key={day} value={day} className="bg-white dark:bg-brand-black">{day}</option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                    </div>
                                </div>

                                <button
                                    onClick={setToday}
                                    className="px-3 py-1.5 bg-brand-gold text-brand-black rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-brand-gold/90 transition-all shrink-0 h-[38px] flex items-center"
                                >
                                    Hari Ini
                                </button>

                                <div className="flex items-center gap-2 px-4 bg-black/5 dark:bg-white/5 py-1.5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm h-[38px]">
                                    <CalendarIcon className="w-3.5 h-3.5 text-brand-gold" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white">
                                        {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
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
                                className={`p-5 rounded-2xl border transition-all relative overflow-hidden group ${item.status === 'open'
                                    ? 'bg-brand-gold/10 border-brand-gold shadow-lg shadow-brand-gold/5'
                                    : item.status === 'booked'
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : 'bg-white dark:bg-white/3 border-black/5 dark:border-white/5 opacity-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'open' ? 'text-brand-gold' :
                                        item.status === 'booked' ? 'text-green-500' : 'text-brand-black/20 dark:text-brand-white/20'
                                        }`}>
                                        Sesi {index + 1}
                                    </span>
                                    <ClockIcon className={`w-4 h-4 ${item.status === 'open' ? 'text-brand-gold' :
                                        item.status === 'booked' ? 'text-green-500' : 'text-brand-black/20 dark:text-brand-white/20'
                                        }`} />
                                </div>

                                <h3 className="text-xl font-black text-brand-black dark:text-brand-white tracking-tighter mb-1">
                                    {item.time}
                                </h3>

                                <div className="flex items-center gap-1 mb-4">
                                    {item.status === 'open' ? (
                                        <>
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                                            <span className="text-[8px] font-black uppercase text-brand-gold">Tersedia</span>
                                        </>
                                    ) : item.status === 'booked' ? (
                                        <div className="flex flex-col gap-1.5 w-full overflow-hidden">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[8px] font-black uppercase text-green-500">Terisi</span>
                                            </div>
                                            {item.booking_info && (
                                                <div className="mt-1 flex flex-col gap-0.5 border-t border-green-500/10 pt-1">
                                                    <p className="text-[9px] font-black text-brand-black dark:text-brand-white uppercase truncate">
                                                        {item.booking_info.customer_name}
                                                    </p>
                                                    <p className="text-[7px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase truncate">
                                                        {item.booking_info.package_name}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-black/20 dark:bg-brand-white/20" />
                                            <span className="text-[8px] font-black uppercase text-brand-black/20 dark:text-brand-white/20">Kosong</span>
                                        </>
                                    )}
                                </div>

                                {item.status !== 'off' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openOffsetModal(item)}
                                            className="flex-1 bg-black dark:bg-white text-white dark:text-brand-black p-2 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-sm"
                                        >
                                            <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
                                            <span className="text-[8px] font-black uppercase">Offset</span>
                                        </button>
                                        <button
                                            onClick={() => openRescheduleModal(item)}
                                            className="flex-1 bg-brand-gold text-brand-black p-2 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-sm"
                                        >
                                            <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
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
