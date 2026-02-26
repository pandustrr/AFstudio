import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
    CalendarIcon,
    UserIcon,
    ChevronDownIcon,
    ClockIcon,
    AdjustmentsHorizontalIcon,
    InformationCircleIcon,
    ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import CalendarWidget from '@/Components/CalendarWidget';

export default function PhotographerSessions({ photographers, grid, selectedDate, selectedPhotographerId, filters, options, monthlyStats, dateMarks }) {
    const [selectedSession, setSelectedSession] = useState(null);
    const [isOffsetModalOpen, setIsOffsetModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

    const [offsetData, setOffsetData] = useState({ minutes: 0, description: '' });
    const [moveData, setMoveData] = useState({
        photographer_id: '',
        date: '',
        time: ''
    });

    const markColors = [
        { name: 'Default', value: null, class: 'bg-black/5 dark:bg-white/10' },
        { name: 'Red', value: '#ef4444', class: 'bg-red-500' },
        { name: 'Blue', value: '#3b82f6', class: 'bg-blue-500' },
        { name: 'Green', value: '#22c55e', class: 'bg-green-500' },
        { name: 'Purple', value: '#a855f7', class: 'bg-purple-500' },
        { name: 'Gold', value: '#FFD700', class: 'bg-brand-gold' },
    ];

    const currentMark = dateMarks[selectedDate] || null;

    const handleMarkColor = (color) => {
        router.post('/admin/photographer-sessions/mark', {
            date: selectedDate,
            color: color,
            photographer_id: selectedPhotographerId
        }, {
            preserveScroll: true
        });
    };

    const handlePhotographerChange = (id) => {
        router.get('/admin/photographer-sessions', {
            photographer_id: id,
            year: filters.year,
            month: filters.month,
            day: filters.day
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDateSelect = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        router.get('/admin/photographer-sessions', {
            photographer_id: selectedPhotographerId,
            year, month, day
        }, {
            preserveState: true,
            preserveScroll: true
        });
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

    const openMoveModal = (session) => {
        setSelectedSession(session);
        setMoveData({
            photographer_id: selectedPhotographerId,
            date: selectedDate,
            time: session.time_full
        });
        setIsMoveModalOpen(true);
    };

    const submitMove = () => {
        router.post('/admin/photographer-sessions/move-session', {
            session_id: selectedSession.session_id,
            target_photographer_id: moveData.photographer_id,
            target_date: moveData.date,
            target_time: moveData.time
        }, {
            onSuccess: () => setIsMoveModalOpen(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="Monitoring Sesi FG" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column: Photographer Select, Calendar & Preview */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div>
                                <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-1">Monitoring Sesi</h1>
                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">
                                    Pilih fotografer dan tanggal untuk pantau jadwal
                                </p>
                            </div>

                            {/* Photographer Selection */}
                            <div className="bg-white dark:bg-white/5 p-5 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                                <label className="text-[9px] uppercase font-black tracking-widest text-brand-black/30 dark:text-brand-white/30 ml-1 block mb-2">Pilih Fotografer</label>
                                <div className="relative group">
                                    <select
                                        value={selectedPhotographerId || ''}
                                        onChange={(e) => handlePhotographerChange(e.target.value)}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:ring-brand-gold focus:border-brand-gold transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black font-sans capitalize">-- Pilih Fotografer --</option>
                                        {photographers.map(fg => (
                                            <option key={fg.id} value={fg.id} className="bg-white dark:bg-brand-black font-sans capitalize">{fg.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                                </div>
                            </div>

                            <CalendarWidget
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                monthlyStats={monthlyStats}
                                dateMarks={dateMarks}
                                availableYears={options.years}
                            />

                            {/* Mark Color Section */}
                            {selectedPhotographerId && (
                                <div className="mt-6 bg-white dark:bg-white/5 p-5 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                                    <h3 className="text-[10px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest mb-4">
                                        Mark Tanggal
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {markColors.map((c) => (
                                            <button
                                                key={c.name}
                                                onClick={() => handleMarkColor(c.value)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center
                                                    ${c.class}
                                                    ${currentMark?.color === c.value || (c.value === null && !currentMark?.color)
                                                        ? 'border-brand-gold scale-110 shadow-lg'
                                                        : 'border-transparent hover:scale-105'
                                                    }`}
                                                title={c.name}
                                            >
                                                {c.value === null && <div className="w-1 h-1 bg-black/20 dark:bg-white/20 rounded-full" />}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-3 text-[8px] font-bold text-brand-black/30 dark:text-brand-white/30 uppercase italic">
                                        * Admin juga dapat menandai tanggal untuk fotografer
                                    </p>
                                </div>
                            )}

                            {/* Schedule Preview Section - Consistent with Photographer view */}
                            {selectedPhotographerId && (
                                <div className="mt-6 bg-white dark:bg-white/5 p-5 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-widest">
                                            Preview Jadwal
                                        </h3>
                                        <button
                                            onClick={() => {
                                                const dateStr = new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                                                const currentPhotographer = photographers.find(p => p.id == selectedPhotographerId);
                                                const photographerName = currentPhotographer ? currentPhotographer.name : '---';
                                                const photographerPhone = currentPhotographer ? (currentPhotographer.phone ? `+${currentPhotographer.phone}` : '-') : '-';
                                                const header = `AFstudio ${dateStr}\nPhotographer: ${photographerName}\nWA: ${photographerPhone}`;
                                                const addMinutes = (time, mins) => {
                                                    const [h, m] = time.split(':').map(Number);
                                                    const date = new Date();
                                                    date.setHours(h, m + mins);
                                                    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
                                                };

                                                const bookedSessions = grid
                                                    .filter(item => item.status === 'booked')
                                                    .map(item => {
                                                        const cumulative = item.cumulative_offset || 0;
                                                        const individual = item.offset_minutes || 0;
                                                        const start = addMinutes(item.time, cumulative);
                                                        const end = addMinutes(item.time, 30 + cumulative);
                                                        const name = item.booking_info?.customer_name || 'Booked';
                                                        const pkg = item.booking_info?.package_name ? ` (${item.booking_info.package_name})` : '';
                                                        const offsetText = individual !== 0 ? ` [ ${individual > 0 ? '+' : ''}${individual}m]` : '';
                                                        return `${start}-${end} ; ${name}${pkg}${offsetText}`;
                                                    })
                                                    .join('\n');

                                                const notes = grid
                                                    .filter(item => item.offset_description)
                                                    .map(item => `* ${item.time}: ${item.offset_description}`)
                                                    .join('\n');

                                                const text = `${header}\n\n${bookedSessions}${notes ? `\n\nCatatan:\n${notes}` : ''}`;
                                                navigator.clipboard.writeText(text);
                                                alert('Jadwal berhasil disalin!');
                                            }}
                                            className="text-[10px] font-bold uppercase bg-brand-gold text-brand-black px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 transition-transform"
                                        >
                                            Salin Text
                                        </button>
                                    </div>
                                    <div className="bg-brand-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                                        <pre className="text-xs font-mono text-brand-black dark:text-brand-white whitespace-pre-wrap leading-relaxed">
                                            <span className="font-bold">AFstudio {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                            {'\n'}
                                            <div className="flex flex-col text-[10px] opacity-60">
                                                <span>Photographer: {photographers.find(p => p.id == selectedPhotographerId)?.name || '---'}</span>
                                                <span>WA: {photographers.find(p => p.id == selectedPhotographerId)?.phone ? `+${photographers.find(p => p.id == selectedPhotographerId)?.phone}` : '-'}</span>
                                            </div>
                                            {'\n'}
                                            {grid.filter(item => item.status === 'booked').length > 0 ? (
                                                grid.filter(item => item.status === 'booked').map((item, i) => {
                                                    const addMinutes = (time, mins) => {
                                                        const [h, m] = time.split(':').map(Number);
                                                        const date = new Date();
                                                        date.setHours(h, m + mins);
                                                        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
                                                    };
                                                    const cumulative = item.cumulative_offset || 0;
                                                    const individual = item.offset_minutes || 0;
                                                    const start = addMinutes(item.time, cumulative);
                                                    const end = addMinutes(item.time, 30 + cumulative);
                                                    const name = item.booking_info?.customer_name || 'Booked';
                                                    const pkg = item.booking_info?.package_name ? ` (${item.booking_info.package_name})` : '';
                                                    return (
                                                        <div key={i} className="mb-1 flex flex-wrap items-center gap-1">
                                                            <span className="text-brand-gold">{start}-{end}</span>
                                                            <span className="dark:text-white/80">; {name}</span>
                                                            <span className="opacity-50 text-[10px]">{pkg}</span>
                                                            {individual !== 0 && (
                                                                <span className="text-[7px] bg-brand-gold/20 text-brand-gold px-1 rounded font-black italic">
                                                                    {individual > 0 ? '+' : ''}{individual}m
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-brand-black/30 dark:text-brand-white/30 italic">- Belum ada sesi ter-booking -</span>
                                            )}
                                        </pre>
                                    </div>

                                    {/* Offset Reasons Summary */}
                                    {grid.some(item => item.offset_description) && (
                                        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                                            <h4 className="text-[9px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                <InformationCircleIcon className="w-3 h-3" />
                                                Catatan Transisi
                                            </h4>
                                            <div className="space-y-1.5">
                                                {grid.filter(item => item.offset_description).map((item, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <span className="text-[8px] font-black text-brand-gold min-w-[35px]">{item.time}</span>
                                                        <p className="text-[9px] font-bold text-brand-black/60 dark:text-brand-white/60 italic leading-tight">
                                                            {item.offset_description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sessions Grid */}
                    <div className="lg:col-span-2">
                        {!selectedPhotographerId ? (
                            <div className="py-20 text-center bg-white dark:bg-white/3 rounded-3xl border border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-16 h-16 rounded-full bg-brand-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                                    <UserIcon className="w-8 h-8 text-brand-black/20 dark:text-brand-white/20" />
                                </div>
                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">Silakan pilih fotografer terlebih dahulu</p>
                            </div>
                        ) : (
                            <>
                                {/* Date Header */}
                                <div className="flex items-center justify-between gap-3 mb-6 bg-white dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <div className="flex items-center gap-4 relative z-10 w-full">
                                        <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold shrink-0">
                                            <ClockIcon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold tracking-widest text-brand-black/30 dark:text-brand-white/30 uppercase mb-0.5">Jadwal Sesi</span>
                                                <span className="block text-base sm:text-lg font-black uppercase tracking-tight text-brand-black dark:text-brand-white leading-tight">
                                                    {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center sm:flex-col sm:items-end">
                                                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-brand-black/40 dark:text-brand-white/40 uppercase bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5 whitespace-nowrap">
                                                    {grid.filter(i => i.status === 'booked').length} Terisi / {grid.length} Total
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sessions List (List View) */}
                                <div className="space-y-2">
                                    {grid.map((item, index) => {
                                        // Helper untuk kalkulasi waktu dengan offset
                                        const getTimeWithOffset = (baseTime, offset) => {
                                            const [h, m] = baseTime.split(':').map(Number);
                                            const d = new Date();
                                            d.setHours(h, m + (offset || 0));
                                            return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
                                        };

                                        const startTime = getTimeWithOffset(item.time, item.cumulative_offset);
                                        const endTime = getTimeWithOffset(item.time, (item.cumulative_offset || 0) + 30);
                                        const isBooked = item.status === 'booked';
                                        const isOff = item.status === 'off';
                                        const isOpen = item.status === 'open';

                                        return (
                                            <div
                                                key={index}
                                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4
                                                    ${isOpen
                                                        ? 'bg-brand-gold/5 border-brand-gold/20 hover:bg-brand-gold/10'
                                                        : isBooked
                                                            ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                                                            : 'bg-white dark:bg-white/3 border-black/5 dark:border-white/5 opacity-60'
                                                    }`}
                                            >
                                                {/* Sesi & Waktu */}
                                                <div className="flex items-center gap-4 min-w-[200px]">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs
                                                        ${isOpen ? 'bg-brand-gold text-brand-black' :
                                                            isBooked ? 'bg-green-500 text-white' : 'bg-black/10 dark:bg-white/10 text-brand-black/40 dark:text-brand-white/40'}
                                                    `}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 block">Sesi {index + 1}</span>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-sm font-black text-brand-black dark:text-brand-white tracking-widest uppercase">
                                                                Jam {startTime} - {endTime}
                                                            </h3>
                                                            {item.cumulative_offset !== 0 && (
                                                                <span className="text-[10px] font-bold text-brand-red italic">
                                                                    ({item.cumulative_offset > 0 ? '+' : ''}{item.cumulative_offset}m)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Informasi Status / Customer */}
                                                <div className="flex-1">
                                                    {isBooked ? (
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full w-fit">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">TERISI</span>
                                                            </div>
                                                            {item.booking_info && (
                                                                <div className="flex flex-col">
                                                                    <p className="text-xs font-black text-brand-black dark:text-brand-white uppercase leading-none">
                                                                        {item.booking_info.customer_name}
                                                                    </p>
                                                                    <p className="text-[9px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase mt-0.5">
                                                                        {item.booking_info.package_name}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : isOff ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/5 dark:bg-white/5 text-brand-black/30 dark:text-brand-white/30 rounded-full w-fit">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">LIBUR / OFF</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full w-fit">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">TERSEDIA / OPEN</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Aksi */}
                                                <div className="flex items-center gap-2">
                                                    {!isOff && (
                                                        <div className="flex items-center gap-2">
                                                            {isBooked && (
                                                                <button
                                                                    onClick={() => openMoveModal(item)}
                                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-black hover:bg-brand-black hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <ArrowsRightLeftIcon className="w-4 h-4" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Pindah Sesi</span>
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => openOffsetModal(item)}
                                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-black dark:bg-white/10 text-white hover:bg-brand-gold hover:text-brand-black transition-all shadow-sm"
                                                            >
                                                                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Transisi</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>


                                {/* Footer Legend */}
                                <div className="mt-8 flex flex-wrap gap-6 p-5 bg-black/2 dark:bg-white/2 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-md bg-brand-gold/20 border border-brand-gold" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sesi Tersedia</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-md bg-green-500/20 border border-green-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sesi Ter-booking</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-md bg-white dark:bg-white/3 border border-black/5 dark:border-white/5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sesi Kosong (Off)</span>
                                    </div>
                                    <div className="flex items-center gap-3 border-l border-black/10 dark:border-white/10 pl-6">
                                        <ArrowsRightLeftIcon className="w-4 h-4 text-brand-gold" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-40 italic">
                                            * Tombol Pindah Sesi muncul otomatis jika jadwal sudah ter-booking
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Offset Modal */}
            <Modal show={isOffsetModalOpen} onClose={() => setIsOffsetModalOpen(false)} maxWidth="md" closeable={false}>
                <div className="p-8">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic mb-4">Pengaturan Transisi Waktu</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-black tracking-widest text-brand-black/40 block mb-2">Menit Transisi (+ / -)</label>
                            <input
                                type="number"
                                value={offsetData.minutes}
                                onChange={(e) => setOffsetData({ ...offsetData, minutes: e.target.value })}
                                className="w-full bg-black/5 rounded-xl px-4 py-3 text-sm font-bold focus:ring-brand-gold border-0 ring-1 ring-black/5"
                            />
                            <p className="text-[8px] font-medium text-brand-black/40 mt-1 italic">* Contoh: 10 untuk telat 10 menit, -10 untuk lebih cepat 10 menit.</p>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-black tracking-widest text-brand-black/40 block mb-2">Keterangan</label>
                            <textarea
                                value={offsetData.description}
                                onChange={(e) => setOffsetData({ ...offsetData, description: e.target.value })}
                                className="w-full bg-black/5 rounded-xl px-4 py-3 h-24 text-sm font-bold focus:ring-brand-gold border-0 ring-1 ring-black/5"
                                placeholder="Alasan offset..."
                            />
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                            <button onClick={submitOffset} className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Simpan Transisi</button>
                            {(selectedSession?.offset_minutes !== 0 || selectedSession?.offset_description) && (
                                <button
                                    onClick={() => {
                                        router.post('/admin/photographer-sessions/offset', {
                                            session_id: selectedSession.session_id,
                                            offset_minutes: 0,
                                            offset_description: ''
                                        }, {
                                            onSuccess: () => setIsOffsetModalOpen(false)
                                        });
                                    }}
                                    className="w-full bg-brand-red/10 hover:bg-brand-red/20 text-brand-red py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors"
                                >
                                    Hapus & Reset Transisi
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
            {/* Move Session Modal */}
            <Modal show={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} maxWidth="lg" closeable={false}>
                <div className="p-8">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic mb-2">Pindah Jadwal Sesi</h2>
                    <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-6">Pindahkan sesi milik customer ke jam atau photographer lain</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-brand-black/60 border-b border-black/5 pb-2">Informasi Sesi</h3>
                            <div className="bg-black/2 dark:bg-white/5 p-4 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold opacity-40 uppercase">Customer</span>
                                    <span className="font-black uppercase">{selectedSession?.booking_info?.customer_name || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold opacity-40 uppercase">Paket</span>
                                    <span className="font-black uppercase">{selectedSession?.booking_info?.package_name || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold opacity-40 uppercase">Jadwal Sblmnya</span>
                                    <span className="font-black uppercase text-brand-red italic">{selectedSession?.time} - {selectedSession?.date}</span>
                                </div>
                                {!selectedSession?.booking_info && (
                                    <div className="p-3 bg-brand-red/5 rounded-xl border border-brand-red/10 mt-2">
                                        <p className="text-[8px] font-black uppercase text-brand-red text-center">Tidak ada data booking untuk dipindahkan</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-brand-black/60 border-b border-black/5 pb-2">Jadwal Baru</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] uppercase font-black tracking-widest text-brand-black/30 block mb-1.5 ml-1">Pilih Photographer Baru</label>
                                    <select
                                        value={moveData.photographer_id}
                                        onChange={(e) => setMoveData({ ...moveData, photographer_id: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:ring-brand-gold transition-all dark:text-brand-white"
                                    >
                                        {photographers.map(fg => (
                                            <option key={fg.id} value={fg.id} className="bg-white dark:bg-brand-black font-sans capitalize">{fg.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[9px] uppercase font-black tracking-widest text-brand-black/30 block mb-1.5 ml-1">Tanggal Baru</label>
                                    <input
                                        type="date"
                                        value={moveData.date}
                                        onChange={(e) => setMoveData({ ...moveData, date: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-xs font-black focus:ring-brand-gold transition-all dark:text-brand-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[9px] uppercase font-black tracking-widest text-brand-black/30 block mb-1.5 ml-1">Pilih Jam Baru</label>
                                    <select
                                        value={moveData.time}
                                        onChange={(e) => setMoveData({ ...moveData, time: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:ring-brand-gold transition-all dark:text-brand-white"
                                    >
                                        {/* Generate available times 05:00 - 20:00 */}
                                        {Array.from({ length: 31 }).map((_, i) => {
                                            const hour = Math.floor(i / 2) + 5;
                                            const min = i % 2 === 0 ? '00' : '30';
                                            const t = `${hour.toString().padStart(2, '0')}:${min}:00`;
                                            const tDisplay = `${hour.toString().padStart(2, '0')}.${min}`;
                                            return (
                                                <option key={t} value={t} className="bg-white dark:bg-brand-black font-sans">JAM {tDisplay}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-10">
                        <button
                            onClick={() => setIsMoveModalOpen(false)}
                            className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            onClick={submitMove}
                            className="flex-2 bg-brand-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-black/20 hover:bg-brand-gold hover:text-brand-black transition-all"
                        >
                            Konfirmasi Pindah Jadwal
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
