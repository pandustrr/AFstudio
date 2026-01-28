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
} from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import CalendarWidget from '@/Components/CalendarWidget';

export default function PhotographerSessions({ photographers, grid, selectedDate, selectedPhotographerId, filters, options, monthlyStats, dateMarks }) {
    const [selectedSession, setSelectedSession] = useState(null);
    const [isOffsetModalOpen, setIsOffsetModalOpen] = useState(false);

    const [offsetData, setOffsetData] = useState({ minutes: 0, description: '' });

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
                                                Catatan Penyesuaian
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

                                {/* Sessions Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {grid.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-2xl border transition-all text-left relative overflow-hidden group flex flex-col justify-between aspect-5/4
                                                ${item.status === 'open'
                                                    ? 'bg-brand-gold/10 border-brand-gold shadow-lg shadow-brand-gold/5'
                                                    : item.status === 'booked'
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : 'bg-white dark:bg-white/3 border-black/5 dark:border-white/5 opacity-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'open' ? 'text-brand-gold' :
                                                    item.status === 'booked' ? 'text-green-500' : 'text-brand-black/20 dark:text-brand-white/20'
                                                    }`}>
                                                    Sesi {index + 1}
                                                </span>
                                                <ClockIcon className={`w-3.5 h-3.5 ${item.status === 'open' ? 'text-brand-gold' :
                                                    item.status === 'booked' ? 'text-green-500' : 'text-brand-black/20 dark:text-brand-white/20'
                                                    }`} />
                                            </div>

                                            <div className="flex items-baseline gap-1.5 mb-0.5">
                                                <h3 className="text-lg font-black text-brand-black dark:text-brand-white tracking-tighter">
                                                    {(() => {
                                                        if (!item.cumulative_offset) return item.time;
                                                        const [h, m] = item.time.split(':').map(Number);
                                                        const d = new Date();
                                                        d.setHours(h, m + item.cumulative_offset);
                                                        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                                                    })()}
                                                </h3>
                                                {item.cumulative_offset !== 0 && (
                                                    <span className="text-[10px] font-bold text-brand-black/20 dark:text-brand-white/20 line-through">
                                                        {item.time}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {item.status === 'open' ? (
                                                    <div className="flex flex-col gap-1.5 w-full overflow-hidden">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                                                            <span className="text-[8px] font-black uppercase text-brand-gold">Tersedia</span>
                                                        </div>
                                                    </div>
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
                                                        <span className="text-[8px] font-black uppercase text-brand-black/20 dark:text-brand-white/20">Kosong (Off)</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Admin Actions - Compact Overlay */}
                                            {item.status !== 'off' && (
                                                <button
                                                    onClick={() => openOffsetModal(item)}
                                                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black dark:bg-white/10 text-white transition-all shadow-lg flex items-center gap-1 z-30"
                                                    title="Set Offset"
                                                >
                                                    <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
                                                    <span className="text-[7px] font-black uppercase">Offset</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
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
                                </div>
                            </>
                        )}
                    </div>
                </div>
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
                            <button onClick={submitOffset} className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Simpan Offset</button>
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
                                    Hapus Offset & Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
