import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    CursorArrowRaysIcon,
    TrashIcon,
    ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import CalendarWidget from '../../Components/CalendarWidget';
import Modal from '@/Components/Modal';

export default function Sessions({ grid, selectedDate, filters, options, monthlyStats, dateMarks, followUpTemplates = [] }) {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [isBulkLoading, setIsBulkLoading] = useState(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [selectedItemForFollowUp, setSelectedItemForFollowUp] = useState(null);

    const getFollowUpLink = (session, templateContent) => {
        if (!session || !templateContent) return '#';

        const bookingInfo = session.booking_info || {};
        let text = templateContent
            .replace(/\[client_name\]/g, bookingInfo.customer_name || '')
            .replace(/\[booking_code\]/g, bookingInfo.cart_uid || '')
            .replace(/\[package_name\]/g, bookingInfo.package_name || '')
            .replace(/\[scheduled_date\]/g, selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

        const phone = bookingInfo.customer_phone?.startsWith('0') ? '62' + bookingInfo.customer_phone.substring(1) : bookingInfo.customer_phone;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    const markColors = [
        { name: 'Default', value: null, class: 'bg-black/5 dark:bg-white/10' },
        { name: 'Red', value: '#ef4444', class: 'bg-red-500' },
        { name: 'Blue', value: '#3b82f6', class: 'bg-blue-500' },
        { name: 'Green', value: '#22c55e', class: 'bg-green-500' },
        { name: 'Purple', value: '#a855f7', class: 'bg-purple-500' },
        { name: 'Gold', value: '#FFD700', class: 'bg-brand-gold' },
    ];

    const currentMark = dateMarks[selectedDate] || null;

    const { auth } = usePage().props;
    const photographerName = auth?.user?.name || '---';
    const photographerPhone = auth?.user?.phone ? `+${auth.user.phone}` : '-';

    const handleMarkColor = (color) => {
        router.post('/photographer/sessions/mark', {
            date: selectedDate,
            color: color
        }, {
            preserveScroll: true
        });
    };

    const handleToggle = (time_full, status) => {
        if (status === 'booked') return;

        const params = {
            date: selectedDate,
            start_time: time_full
        };

        if (filters.year) params.year = filters.year;
        if (filters.month) params.month = filters.month;
        if (filters.day) params.day = filters.day;

        router.post('/photographer/sessions/toggle', params, {
            preserveScroll: true
        });
    };

    const handleBulkToggle = (status) => {
        if (selectedTimes.length === 0) return;
        setIsBulkLoading(true);

        router.post('/photographer/sessions/bulk-toggle', {
            date: selectedDate,
            start_times: selectedTimes,
            status: status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedTimes([]);
                setIsBulkLoading(false);
            },
            onFinish: () => setIsBulkLoading(false)
        });
    };

    const toggleAll = () => {
        const checkableSessions = grid.filter(s => s.status !== 'booked');
        if (selectedTimes.length === checkableSessions.length) {
            setSelectedTimes([]);
        } else {
            setSelectedTimes(checkableSessions.map(s => s.time_full));
        }
    };

    const handleSelectSession = (time) => {
        setSelectedTimes(prev =>
            prev.includes(time)
                ? prev.filter(t => t !== time)
                : [...prev, time]
        );
    };

    const closeAllToday = () => {
        if (!confirm('Tutup semua sesi yang tersedia untuk hari ini?')) return;
        const openSessions = grid.filter(s => s.status === 'open').map(s => s.time_full);
        if (openSessions.length === 0) {
            alert('Tidak ada sesi terbuka yang bisa ditutup.');
            return;
        }

        setIsBulkLoading(true);
        router.post('/photographer/sessions/bulk-toggle', {
            date: selectedDate,
            start_times: openSessions,
            status: 'off'
        }, {
            preserveScroll: true,
            onSuccess: () => setIsBulkLoading(false),
            onFinish: () => setIsBulkLoading(false)
        });
    };

    const handleDateSelect = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        router.get('/photographer/sessions', {
            year, month, day
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Jadwal Sesi" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Calendar Section */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-1">Manajemen Sesi</h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">
                                Pilih tanggal untuk melihat & atur jadwal
                            </p>

                            <CalendarWidget
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                monthlyStats={monthlyStats}
                                dateMarks={dateMarks}
                                availableYears={options.years}
                            />

                            {/* Mark Color Section */}
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
                                    * Klik warna untuk menandai tanggal terpilih di kalender
                                </p>
                            </div>


                            {/* Schedule Preview Section */}
                            <div className="mt-6 bg-white dark:bg-white/5 p-5 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-widest">
                                        Preview Jadwal
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const dateStr = new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
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
                                                    const start = (item.is_customized && item.override_start_time) ? item.override_start_time.replace(':', '.') : addMinutes(item.time, cumulative);
                                                    const end = (item.is_customized && item.override_end_time) ? item.override_end_time.replace(':', '.') : addMinutes(item.time, 30 + cumulative);
                                                    const name = item.booking_info?.customer_name || 'Booked';
                     const pkg = item.booking_info?.package_name ? ` (${item.booking_info.package_name})` : '';
                                                    const customLabel = item.is_customized ? ' [CUSTOMED]' : '';
                                                    return `${start}-${end} ; ${name}${pkg}${customLabel}`;
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
                                            <span>Photographer: {photographerName}</span>
                                            <span>WA: {photographerPhone}</span>
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
                                                const start = (item.is_customized && item.override_start_time) ? item.override_start_time.replace(':', '.') : addMinutes(item.time, cumulative);
                                                const end = (item.is_customized && item.override_end_time) ? item.override_end_time.replace(':', '.') : addMinutes(item.time, 30 + cumulative);
                                                const name = item.booking_info?.customer_name || 'Booked';
                                                const pkg = item.booking_info?.package_name ? ` (${item.booking_info.package_name})` : '';
                                                return (
                                                    <div key={i} className="mb-1 flex flex-wrap items-center gap-x-1 gap-y-0.5">
                                                        <span className="text-brand-gold">{start}-{end}</span>
                                                        <span className="dark:text-white/80">; {name}</span>
                                                        <span className="opacity-50 text-[10px]">{pkg}</span>
                                                        {item.is_customized && (
                                                            <span className="text-[7px] bg-brand-gold/10 text-brand-gold px-1 rounded font-black italic">
                                                                CUSTOMED
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
                        </div>
                    </div>

                    {/* Session Grid Section */}
                    <div className="lg:col-span-2">
                        {/* Date Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm relative overflow-hidden group">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold shrink-0">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-widest text-brand-black/30 dark:text-brand-white/30 uppercase mb-0.5">Jadwal Sesi</span>
                                    <span className="block text-base sm:text-lg font-black uppercase tracking-tight text-brand-black dark:text-brand-white leading-tight">
                                        {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 relative z-10">
                                <button
                                    onClick={closeAllToday}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white border border-brand-red/20 rounded-xl transition-all group/btn"
                                >
                                    <XCircleIcon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Tutup Semua</span>
                                </button>
                                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-brand-black/40 dark:text-brand-white/40 uppercase bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5 whitespace-nowrap">
                                    {grid.filter(i => i.status === 'booked').length} Terisi / {grid.length} Total
                                </span>
                            </div>
                        </div>

                        {/* Bulk Actions Header */}
                        <div className="flex items-center justify-between px-2 mb-4">
                            <button
                                onClick={toggleAll}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 hover:text-brand-gold transition-colors"
                            >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selectedTimes.length > 0 && selectedTimes.length === grid.filter(s => s.status !== 'booked').length ? 'bg-brand-gold border-brand-gold' : 'border-black/10 dark:border-white/10'}`}>
                                    {selectedTimes.length > 0 && selectedTimes.length === grid.filter(s => s.status !== 'booked').length && <div className="w-1.5 h-1.5 bg-brand-black rounded-sm" />}
                                </div>
                                {selectedTimes.length === grid.filter(s => s.status !== 'booked').length ? 'Batal Pilih' : 'Pilih Semua'}
                            </button>

                            {selectedTimes.length > 0 && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold mr-2">{selectedTimes.length} Sesi Terpilih</span>
                                    <button
                                        onClick={() => handleBulkToggle('open')}
                                        disabled={isBulkLoading}
                                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        Buka
                                    </button>
                                    <button
                                        onClick={() => handleBulkToggle('off')}
                                        disabled={isBulkLoading}
                                        className="px-4 py-2 bg-brand-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            )}
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

                                const startTime = (item.is_customized && item.override_start_time) ? item.override_start_time.replace(':', '.') : getTimeWithOffset(item.time, item.cumulative_offset);
                                const endTime = (item.is_customized && item.override_end_time) ? item.override_end_time.replace(':', '.') : getTimeWithOffset(item.time, (item.cumulative_offset || 0) + 30);
                                const isBooked = item.status === 'booked';
                                const isOff = item.status === 'off';
                                const isOpen = item.status === 'open';

                                return (
                                    <div
                                        key={index}
                                        className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4 text-left relative
                                            ${isOpen
                                                ? (selectedTimes.includes(item.time_full) ? 'bg-brand-gold/20 border-brand-gold' : 'bg-brand-gold/5 border-brand-gold/30 hover:bg-brand-gold/10')
                                                : isBooked
                                                    ? 'bg-green-500/5 border-green-500/20 cursor-not-allowed'
                                                    : (selectedTimes.includes(item.time_full) ? 'bg-brand-black/20 border-brand-black opacity-100' : 'bg-white dark:bg-white/3 border-black/5 dark:border-white/5 opacity-50 hover:opacity-100 hover:border-brand-gold/50')
                                            }`}
                                    >
                                        {/* Selection Checkbox */}
                                        {!isBooked && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectSession(item.time_full);
                                                }}
                                                className="absolute top-4 right-4 sm:static shrink-0 cursor-pointer group/check"
                                            >
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedTimes.includes(item.time_full) ? 'bg-brand-gold border-brand-gold scale-110' : 'border-black/10 dark:border-white/10 group-hover/check:border-brand-gold/50'}`}>
                                                    {selectedTimes.includes(item.time_full) && <CheckCircleIcon className="w-4 h-4 text-brand-black" />}
                                                </div>
                                            </div>
                                        )}

                                        {/* Main Content (Clickable to Toggle single) */}
                                        <div
                                            onClick={() => handleToggle(item.time_full, item.status)}
                                            className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
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
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Informasi Status / Customer */}
                                            <div className="flex-1">
                                                {isBooked ? (
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full w-fit">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                                TERISI
                                                                {item.is_customized && (
                                                                    <span className="bg-green-500 text-white px-1 rounded-[4px] text-[7px] italic">CUSTOMED</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                        {item.booking_info && (
                                                            <div className="flex items-center justify-between gap-4 w-full">
                                                                <div className="flex flex-col">
                                                                    <p className="text-xs font-black text-brand-black dark:text-brand-white uppercase leading-none">
                                                                        {item.booking_info.customer_name}
                                                                    </p>
                                                                    <p className="text-[9px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase mt-0.5">
                                                                        {item.booking_info.package_name}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setSelectedItemForFollowUp(item);
                                                                        setIsSelectionModalOpen(true);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/10 shrink-0"
                                                                >
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M17.472 14.382c-.301-.15-1.78-.876-2.056-.976-.277-.1-.478-.15-.678.15s-.777.977-.952 1.177-.35.225-.651.075c-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.13-.611.136-.134.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525s-.678-1.635-.929-2.239c-.244-.589-.493-.51-.678-.52h-.579c-.201 0-.527.076-.802.376s-1.053 1.028-1.053 2.508 1.103 2.909 1.254 3.109c.151.2 2.169 3.312 5.255 4.643.735.316 1.307.505 1.754.647.739.234 1.412.201 1.944.121.594-.09 1.78-.727 2.03-1.431.25-.705.25-1.309.175-1.432-.075-.123-.276-.198-.577-.348zM12 2C6.477 2 2 6.477 2 12c0 2.159.685 4.155 1.854 5.8L2.05 22l4.31-.968C7.942 21.683 9.897 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                                                    </svg>
                                                                    <span>Follow Up</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : isOff ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/5 dark:bg-white/5 text-brand-black/30 dark:text-brand-white/30 rounded-full w-fit">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                            KOSONG / OFF
                                                            {item.is_customized && (
                                                                <span className="bg-black/20 text-brand-black dark:text-brand-white px-1 rounded-[4px] text-[7px] italic">CUSTOMED</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full w-fit border border-brand-gold/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                            TERSEDIA / OPEN
                                                            {item.is_customized && (
                                                                <span className="bg-brand-gold text-brand-black px-1 rounded-[4px] text-[7px] italic">CUSTOMED</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hint Aksi */}
                                            {!isBooked && (
                                                <div className="text-[9px] font-black uppercase tracking-widest text-brand-black/20 dark:text-brand-white/20 italic">
                                                    Klik untuk {isOpen ? 'Tutup (Off)' : 'Buka (Open)'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                        {/* Footer Info */}
                        <div className="mt-8 flex flex-wrap gap-8 p-6 bg-black/2 dark:bg-white/2 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
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
                    </div>
                </div>
            </div>

            {/* Template Selection Modal */}
            <Modal show={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-brand-gold text-brand-black rounded-2xl shadow-xl">
                            <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter italic text-brand-black dark:text-brand-white leading-none">Pilih Template</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mt-1">Pilih pesan untuk dikirim ke {selectedItemForFollowUp?.booking_info?.customer_name}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {followUpTemplates.length > 0 ? (
                            followUpTemplates.map((tpl) => (
                                <a
                                    key={tpl.id}
                                    href={getFollowUpLink(selectedItemForFollowUp, tpl.content)}
                                    target="_blank"
                                    onClick={() => setIsSelectionModalOpen(false)}
                                    className="block p-4 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl hover:border-brand-gold transition-all group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-black uppercase tracking-widest text-xs text-brand-black dark:text-brand-white group-hover:text-brand-gold">{tpl.name}</span>
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.301-.15-1.78-.876-2.056-.976-.277-.1-.478-.15-.678.15s-.777.977-.952 1.177-.35.225-.651.075c-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.13-.611.136-.134.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525s-.678-1.635-.929-2.239c-.244-.589-.493-.51-.678-.52h-.579c-.201 0-.527.076-.802.376s-1.053 1.028-1.053 2.508 1.103 2.909 1.254 3.109c.151.2 2.169 3.312 5.255 4.643.735.316 1.307.505 1.754.647.739.234 1.412.201 1.944.121.594-.09 1.78-.727 2.03-1.431.25-.705.25-1.309.175-1.432-.075-.123-.276-.198-.577-.348zM12 2C6.477 2 2 6.477 2 12c0 2.159.685 4.155 1.854 5.8L2.05 22l4.31-.968C7.942 21.683 9.897 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-[10px] text-brand-black/40 dark:text-brand-white/40 mt-2 line-clamp-2 italic">
                                        {tpl.content}
                                    </p>
                                </a>
                            ))
                        ) : (
                            <div className="text-center py-6 text-[10px] font-black uppercase text-brand-black/20">Belum ada template follow up yang tersedia.</div>
                        )}
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
