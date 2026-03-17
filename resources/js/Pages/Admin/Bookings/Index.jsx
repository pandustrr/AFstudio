import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import EditNotif from '@/Components/EditNotif';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    CalendarIcon,
    ClockIcon,
    CalendarDaysIcon,
    XMarkIcon,
    ChevronDownIcon,
    DocumentArrowDownIcon,
    TrashIcon,
    PhotoIcon,
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';

export default function BookingIndex({ bookingItems, filters, options, photographers = [], followUpTemplates = [] }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'danger'
    });

    // Notification State
    const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

    // Template Management State
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [templateForm, setTemplateForm] = useState({ name: '', content: '' });

    // Selection Modal State
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [selectedItemForFollowUp, setSelectedItemForFollowUp] = useState(null);

    const handleTemplateAction = (e) => {
        e.preventDefault();
        if (editingTemplate) {
            router.patch(`/admin/follow-up-templates/${editingTemplate.id}`, templateForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingTemplate(null);
                    setTemplateForm({ name: '', content: '' });
                    setNotif({ show: true, message: 'Template berhasil diperbarui!', type: 'success' });
                }
            });
        } else {
            router.post('/admin/follow-up-templates', templateForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setTemplateForm({ name: '', content: '' });
                    setNotif({ show: true, message: 'Template berhasil ditambahkan!', type: 'success' });
                }
            });
        }
    };

    const deleteTemplate = (id) => {
        if (confirm('Hapus template ini?')) {
            router.delete(`/admin/follow-up-templates/${id}`, { preserveScroll: true });
        }
    };

    // Handle Flash Messages
    useEffect(() => {
        if (flash?.success) {
            setNotif({ show: true, message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setNotif({ show: true, message: flash.error, type: 'error' });
        }
    }, [flash]);

    const monthNames = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/bookings', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (type, value) => {
        const newFilters = { ...filters, [type]: value };

        if (type === 'year') {
            newFilters.month = '';
            newFilters.day = '';
            newFilters.status = 'all';
        } else if (type === 'month') {
            newFilters.day = '';
            newFilters.status = 'all';
        } else if (type === 'day') {
            newFilters.status = 'all';
        }

        router.get('/admin/bookings', newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const updateStatus = (id, newStatus) => {
        setConfirmModal({
            isOpen: true,
            title: 'Update Status',
            message: `Apakah Anda yakin ingin mengubah status ke ${newStatus}?`,
            variant: 'warning',
            onConfirm: () => {
                router.patch(`/admin/bookings/${id}`, { status: newStatus }, {
                    preserveScroll: true,
                    onSuccess: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    const deleteBooking = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Booking',
            message: 'Apakah Anda yakin ingin menghapus data booking ini secara permanen? Sesi fotografer akan dilepas.',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/bookings/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    const deleteProof = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Bukti',
            message: 'Apakah Anda yakin ingin menghapus gambar bukti pembayaran ini?',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/bookings/${id}/payment-proof`, {
                    preserveScroll: true,
                    onSuccess: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    const bulkDeleteAll = () => {
        const currentStatus = filters.status || 'all';
        setConfirmModal({
            isOpen: true,
            title: 'Bulk Delete Booking',
            message: `PERINGATAN! Anda akan menghapus SEMUA booking dengan status [${currentStatus}] sesuai filter. Lanjutkan?`,
            variant: 'danger',
            onConfirm: () => {
                router.post('/admin/bookings-bulk-delete', {
                    status: currentStatus, search: filters.search
                }, {
                    preserveScroll: true,
                    onSuccess: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    const bulkDeleteAllProofs = () => {
        const currentStatus = filters.status || 'all';
        setConfirmModal({
            isOpen: true,
            title: 'Bulk Delete Proofs',
            message: `Anda akan menghapus SEMUA gambar bukti pembayaran pada list [${currentStatus}]. Lanjutkan?`,
            variant: 'danger',
            onConfirm: () => {
                router.post('/admin/bookings-bulk-delete-proofs', {
                    status: currentStatus
                }, {
                    preserveScroll: true,
                    onSuccess: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    const setToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        router.get('/admin/bookings', {
            ...filters,
            year: year.toString(),
            month: month.toString(),
            day: day.toString(),
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const resetFilters = () => {
        setSearch('');
        router.get('/admin/bookings', {}, { preserveState: false });
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'request_edit': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getFollowUpLink = (item, templateContent) => {
        if (!item || !templateContent) return '#';

        let text = templateContent
            .replace(/\[client_name\]/g, item.booking?.name || '')
            .replace(/\[booking_code\]/g, item.booking?.booking_code || '')
            .replace(/\[package_name\]/g, item.package?.name || '')
            .replace(/\[scheduled_date\]/g, item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

        const phone = item.booking?.phone?.startsWith('0') ? '62' + item.booking.phone.substring(1) : item.booking?.phone;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    // Grouping Logic
    const groupedItems = useMemo(() => {
        if (!bookingItems?.data) return {};
        return bookingItems.data.reduce((acc, item) => {
            const dateKey = item.scheduled_date || 'No Date';
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(item);
            return acc;
        }, {});
    }, [bookingItems?.data]);

    const sortedDates = Object.keys(groupedItems).sort((a, b) => new Date(a) - new Date(b));

    const statusOptions = [
        { id: 'all', label: 'Semua' },
        { id: 'pending', label: 'Pending' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'request_edit', label: 'Req Edit' },
        { id: 'completed', label: 'Done' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <AdminLayout>
            <Head title="Daily Schedule Overview" />

            <div className="pt-8 lg:pt-16 pb-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter">List Booking Dashboard</h1>
                            <p className="text-[9px] text-brand-black/50 dark:text-brand-white/50 font-bold uppercase tracking-widest mt-0.5">
                                Daily schedule monitoring.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {(filters.status === 'completed' || filters.status === 'cancelled') && (
                                <>
                                    <button
                                        onClick={bulkDeleteAllProofs}
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
                                    >
                                        <PhotoIcon className="w-3.5 h-3.5" /> Hapus Semua Bukti
                                    </button>
                                    <button
                                        onClick={bulkDeleteAll}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
                                    >
                                        <TrashIcon className="w-3.5 h-3.5" /> Hapus Semua Booking
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setIsTemplateModalOpen(true)}
                                className="px-4 py-2 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl border border-white/10"
                            >
                                <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5 text-brand-gold" /> Template Follow Up
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
                            >
                                <XMarkIcon className="w-3.5 h-3.5" /> Reset
                            </button>
                        </div>
                    </div>



                    {/* Advanced Filters */}
                    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
                        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto grow">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="relative grow md:max-w-xs">
                                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/20" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search Customer/Code..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border-0 rounded-xl focus:ring-1 focus:ring-brand-gold text-[10px] font-bold transition-all shadow-inner"
                                />
                            </form>

                            {/* Compact Date Filters */}
                            <div className="flex items-center gap-0.5 p-1 bg-gray-50 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 w-fit shadow-inner">
                                <div className="relative group">
                                    <select
                                        value={filters.year || ''}
                                        onChange={(e) => handleFilter('year', e.target.value)}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Tahun</option>
                                        {options.years.map((year) => (
                                            <option key={year} value={year} className="bg-white dark:bg-brand-black">{year}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>
                                <div className="w-px h-3 bg-black/10 dark:bg-white/10 mx-1"></div>
                                <div className="relative group">
                                    <select
                                        value={filters.month || ''}
                                        onChange={(e) => handleFilter('month', e.target.value)}
                                        disabled={!filters.year}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Bulan</option>
                                        {options.months.map((month) => (
                                            <option key={month} value={month} className="bg-white dark:bg-brand-black">{monthNames[month]}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>
                                <div className="w-px h-3 bg-black/10 dark:bg-white/10 mx-1"></div>
                                <div className="relative group">
                                    <select
                                        value={filters.day || ''}
                                        onChange={(e) => handleFilter('day', e.target.value)}
                                        disabled={!filters.month}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">Tgl</option>
                                        {options.days.map((day) => (
                                            <option key={day} value={day} className="bg-white dark:bg-brand-black">{day}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>
                                <div className="w-px h-3 bg-black/10 dark:bg-white/10 mx-1"></div>
                                <div className="relative group">
                                    <select
                                        value={filters.photographer_id || ''}
                                        onChange={(e) => handleFilter('photographer_id', e.target.value)}
                                        className="appearance-none bg-transparent border-0 rounded-lg pl-2 pr-7 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <option value="" className="bg-white dark:bg-brand-black">FG / All</option>
                                        {photographers.map((fg) => (
                                            <option key={fg.id} value={fg.id} className="bg-white dark:bg-brand-black">{fg.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                onClick={setToday}
                                className="px-4 py-2 bg-brand-gold text-brand-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-brand-gold/90 transition-all shrink-0"
                            >
                                Hari Ini
                            </button>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-1 overflow-x-auto pb-1.5 lg:pb-0 w-full lg:w-auto shrink-0">
                            {statusOptions.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleFilter('status', s.id)}
                                    className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${filters.status === s.id
                                        ? 'bg-brand-red text-white shadow-md'
                                        : 'bg-gray-100 text-brand-black/40 dark:bg-white/5 dark:text-brand-white/40 hover:bg-gray-200'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grouped Timeline View */}
                    <div className="space-y-8">
                        {sortedDates.length > 0 ? (
                            sortedDates.map((dateKey) => (
                                <section key={dateKey}>
                                    {/* Date Partition */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-px grow bg-black/5 dark:bg-white/5"></div>
                                        <div className="flex items-center gap-2 bg-brand-black dark:bg-brand-white px-4 py-1.5 rounded-full shadow-md">
                                            <CalendarIcon className="w-3.5 h-3.5 text-brand-gold" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white dark:text-brand-black">
                                                {new Date(dateKey).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="h-px grow bg-black/5 dark:bg-white/5"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {groupedItems[dateKey].map((item) => (
                                            <div key={item.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                                                {/* Photographer Badge */}
                                                <div className="absolute top-0 right-0 p-3 flex flex-col items-end gap-1">
                                                    <span className={`px-2 py-0.5 ${item.photographer ? 'bg-brand-gold/10 text-brand-gold' : 'bg-gray-100 text-gray-400'} rounded-full font-black text-[8px] uppercase tracking-tighter`}>
                                                        {item.photographer?.name || 'No FG'}
                                                    </span>
                                                    {item.photographer?.phone && (
                                                        <a
                                                            href={`https://wa.me/${item.photographer.phone}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[7px] font-black text-green-500 hover:text-green-600 transition-colors uppercase tracking-widest"
                                                        >
                                                            WA: {item.photographer.phone}
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="mb-4">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-red truncate max-w-[120px]">
                                                            {item.package?.sub_category?.name || 'Package'}
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${getStatusColor(item.booking?.status)}`}>
                                                            {item.booking?.status || '??'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter leading-tight mb-2 group-hover:text-brand-red transition-all truncate">
                                                        {item.package?.name || 'Untitled'}
                                                    </h3>

                                                    <div className="flex items-center gap-2 text-[10px] font-black italic uppercase tracking-tighter bg-brand-black rounded-lg px-3 py-1.5 w-fit">
                                                        <ClockIcon className="w-3.5 h-3.5 text-brand-gold" />
                                                        <div className="flex flex-col leading-none">
                                                            {item.start_time !== item.adjusted_start_time ? (
                                                                <>
                                                                    <span className="line-through opacity-30 text-[7px] mb-0.5">
                                                                        {item.start_time?.substring(0, 5)} - {item.end_time?.substring(0, 5)}
                                                                    </span>
                                                                    <span className="text-brand-gold">
                                                                        {item.adjusted_start_time?.substring(0, 5)} - {item.adjusted_end_time?.substring(0, 5)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-brand-gold">
                                                                    {item.start_time?.substring(0, 5)} - {item.end_time?.substring(0, 5)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {item.booking?.payment_proof && item.booking.payment_proof.length > 0 && (
                                                    <div className="mt-4 mb-4">
                                                        <div
                                                            className="relative rounded-xl overflow-hidden cursor-zoom-in group/img h-32 bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/5"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                window.open(`/storage/${item.booking.payment_proof[0].file_path}`, '_blank');
                                                            }}
                                                        >
                                                            <img
                                                                src={`/storage/${item.booking.payment_proof[0].file_path}`}
                                                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                                                                alt="Proof"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                                                                <MagnifyingGlassIcon className="w-6 h-6 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                                            </div>

                                                            {/* Delete Proof Button */}
                                                            {(filters.status === 'completed' || filters.status === 'cancelled') && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteProof(item.booking.id);
                                                                    }}
                                                                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-all z-20"
                                                                    title="Hapus Bukti Pembayaran"
                                                                >
                                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 flex flex-col gap-2">
                                                            {item.booking.status === 'pending' ? (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        updateStatus(item.booking.id, 'confirmed');
                                                                    }}
                                                                    className="w-full py-2 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:scale-[1.02] transition-all"
                                                                >
                                                                    Buat Invoice
                                                                </button>
                                                            ) : (
                                                                <div className="flex gap-2">
                                                                    <a
                                                                        href={`/admin/bookings/${item.booking.id}/invoice`}
                                                                        target="_blank"
                                                                        className="flex-1 py-2 bg-brand-gold text-brand-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:scale-[1.02] transition-all text-center"
                                                                    >
                                                                        Invoice
                                                                    </a>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedItemForFollowUp(item);
                                                                            setIsSelectionModalOpen(true);
                                                                        }}
                                                                        className="flex-1 py-2 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:scale-[1.02] transition-all text-center border border-white/10 flex items-center justify-center gap-1.5 shadow-xl"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                                            <path d="M17.472 14.382c-.301-.15-1.78-.876-2.056-.976-.277-.1-.478-.15-.678.15s-.777.977-.952 1.177-.35.225-.651.075c-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.13-.611.136-.134.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525s-.678-1.635-.929-2.239c-.244-.589-.493-.51-.678-.52h-.579c-.201 0-.527.076-.802.376s-1.053 1.028-1.053 2.508 1.103 2.909 1.254 3.109c.151.2 2.169 3.312 5.255 4.643.735.316 1.307.505 1.754.647.739.234 1.412.201 1.944.121.594-.09 1.78-.727 2.03-1.431.25-.705.25-1.309.175-1.432-.075-.123-.276-.198-.577-.348zM12 2C6.477 2 2 6.477 2 12c0 2.159.685 4.155 1.854 5.8L2.05 22l4.31-.968C7.942 21.683 9.897 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                                                        </svg>
                                                                        Follow Up
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                                    <div className="grow overflow-hidden pr-2">
                                                        <p className="text-[8px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 truncate mb-0.5">Customer / Code</p>
                                                        <p className="font-bold text-[11px] text-brand-black dark:text-brand-white truncate uppercase tracking-tighter mb-0.5">
                                                            <span className="font-mono text-brand-red">{item.booking?.booking_code || '---'}</span> • {item.booking?.name || 'Unknown'}
                                                        </p>
                                                        {item.booking?.phone && (
                                                            <a
                                                                href={`https://wa.me/${item.booking.phone.startsWith('0') ? '62' + item.booking.phone.substring(1) : item.booking.phone}`}
                                                                target="_blank"
                                                                className="text-[8px] font-black text-green-500 hover:text-green-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                                                            >
                                                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M17.472 14.382c-.301-.15-1.78-.876-2.056-.976-.277-.1-.478-.15-.678.15s-.777.977-.952 1.177-.35.225-.651.075c-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.13-.611.136-.134.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525s-.678-1.635-.929-2.239c-.244-.589-.493-.51-.678-.52h-.579c-.201 0-.527.076-.802.376s-1.053 1.028-1.053 2.508 1.103 2.909 1.254 3.109c.151.2 2.169 3.312 5.255 4.643.735.316 1.307.505 1.754.647.739.234 1.412.201 1.944.121.594-.09 1.78-.727 2.03-1.431.25-.705.25-1.309.175-1.432-.075-.123-.276-.198-.577-.348zM12 2C6.477 2 2 6.477 2 12c0 2.159.685 4.155 1.854 5.8L2.05 22l4.31-.968C7.942 21.683 9.897 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                                                </svg>
                                                                {item.booking.phone}
                                                            </a>
                                                        )}
                                                    </div>
                                                    {item.booking?.id && (
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <a
                                                                href={`/admin/bookings/${item.booking.id}/invoice`}
                                                                target="_blank"
                                                                title="Generate Invoice"
                                                                className="bg-brand-gold/10 text-brand-gold p-2 rounded-xl hover:bg-brand-gold hover:text-brand-black transition-all shadow-sm"
                                                            >
                                                                <DocumentArrowDownIcon className="w-4 h-4" />
                                                            </a>
                                                            <Link
                                                                href={`/admin/bookings/${item.booking.id}`}
                                                                className="bg-brand-black dark:bg-brand-white text-white dark:text-brand-black p-2 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </Link>
                                                            {(filters.status === 'completed' || filters.status === 'cancelled') && (
                                                                <button
                                                                    onClick={() => deleteBooking(item.booking.id)}
                                                                    className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 hover:scale-110 active:scale-95 transition-all shadow-md"
                                                                    title="Hapus Booking"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className="py-12 text-center bg-gray-50 dark:bg-white/2 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                                <p className="text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-widest italic text-[10px] flex flex-col items-center gap-3">
                                    <CalendarDaysIcon className="w-10 h-10 opacity-10" />
                                    No records.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {bookingItems?.links?.length > 3 && (
                        <div className="mt-20 flex justify-center">
                            <div className="inline-flex gap-1 p-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl shadow-xl">
                                {bookingItems.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${link.active
                                            ? 'bg-brand-red text-white shadow-lg'
                                            : 'text-brand-black/40 dark:text-brand-white/40 hover:bg-gray-100 dark:hover:bg-white/10'
                                            } ${!link.url && 'opacity-30 cursor-not-allowed hidden'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals & Notifications */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Template Selection Modal */}
            <Modal show={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-brand-gold text-brand-black rounded-2xl shadow-xl">
                            <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter italic text-brand-black dark:text-brand-white leading-none">Pilih Template</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mt-1">Pilih pesan untuk dikirim ke {selectedItemForFollowUp?.booking?.name}</p>
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
                            <div className="text-center py-6 text-[10px] font-black uppercase text-brand-black/20">Belum ada template. Silakan buat di menu "Template Follow Up".</div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Follow Up Template Management Modal */}
            <Modal show={isTemplateModalOpen} onClose={() => {
                setIsTemplateModalOpen(false);
                setEditingTemplate(null);
                setTemplateForm({ name: '', content: '' });
            }} maxWidth="2xl">
                <div className="flex flex-col lg:flex-row h-[500px]">
                    {/* Sidebar: List Templates */}
                    <div className="w-full lg:w-64 border-r border-black/5 dark:border-white/5 flex flex-col p-5 bg-gray-50 dark:bg-black/10 shrink-0">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-4">Daftar Template</h3>
                        <div className="space-y-2 overflow-y-auto grow pr-2">
                            {followUpTemplates.map(tpl => (
                                <div key={tpl.id} className="group relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingTemplate(tpl);
                                            setTemplateForm({ name: tpl.name, content: tpl.content });
                                        }}
                                        className={`w-full text-left p-3 rounded-xl text-[10px] font-bold uppercase transition-all ${editingTemplate?.id === tpl.id ? 'bg-brand-gold text-brand-black shadow-lg shadow-brand-gold/20' : 'bg-white dark:bg-white/5 text-brand-black dark:text-brand-white hover:bg-black/5'}`}
                                    >
                                        <div className="truncate pr-6">{tpl.name}</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteTemplate(tpl.id); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-lg"
                                    >
                                        <TrashIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingTemplate(null);
                                    setTemplateForm({ name: '', content: '' });
                                }}
                                className="w-full p-3 rounded-xl border border-dashed border-black/20 dark:border-white/20 text-[10px] font-black uppercase text-brand-black/40 dark:text-brand-white/40 hover:border-brand-gold hover:text-brand-gold transition-all"
                            >
                                + Template Baru
                            </button>
                        </div>
                    </div>

                    {/* Content: Editor */}
                    <form onSubmit={handleTemplateAction} className="grow p-6 flex flex-col min-w-0">
                        <div className="flex items-center gap-4 mb-6 shrink-0">
                            <div className="p-3 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black rounded-2xl shadow-xl">
                                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter italic text-brand-black dark:text-brand-white leading-none">
                                    {editingTemplate ? 'Edit Template' : 'Template Baru'}
                                </h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mt-1">Konfigurasi pesan WhatsApp kustom</p>
                            </div>
                        </div>

                        <div className="space-y-6 overflow-y-auto grow pr-2">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/30 dark:text-brand-white/30 ml-2 block mb-2">Nama Template</label>
                                <input
                                    type="text"
                                    value={templateForm.name}
                                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-black/20 border-0 rounded-xl focus:ring-2 focus:ring-brand-gold text-xs font-bold text-brand-black dark:text-brand-white p-4"
                                    placeholder="Contoh: Pengingat Jadwal"
                                    required
                                />
                            </div>

                            {/* Variabel Tersedia hidden to avoid confusion as per user request */}

                            <div className="grow flex flex-col min-h-[120px]">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/30 dark:text-brand-white/30 ml-2 block mb-2">Isi Pesan</label>
                                <textarea
                                    value={templateForm.content}
                                    onChange={(e) => setTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full grow bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold text-sm font-bold text-brand-black dark:text-brand-white p-4 transition-all resize-none shadow-inner"
                                    placeholder="Ketik pesan Anda di sini..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsTemplateModalOpen(false)}
                                className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Tutup
                            </button>
                            <button
                                type="submit"
                                className="grow py-3 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] shadow-2xl transition-all"
                            >
                                {editingTemplate ? 'Simpan Perubahan' : 'Buat Template'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <EditNotif
                show={notif.show}
                message={notif.message}
                type={notif.type}
                onClose={() => setNotif(prev => ({ ...prev, show: false }))}
            />
        </AdminLayout >
    );
}
