import React, { useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    XMarkIcon,
    ChevronRightIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { formatIDR } from '../../utils/formatters';
import Modal from '@/Components/Modal';
import {
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';

export default function Reservations({ reservations, allSessions, filters, followUpTemplates = [] }) {
    const [searchCustomerName, setSearchCustomerName] = useState('');
    const [selectedCustomerGroup, setSelectedCustomerGroup] = useState(null);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [selectedItemForFollowUp, setSelectedItemForFollowUp] = useState(null);
    const { get } = useForm();

    const getDateDisplay = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Status filter options
    const statusOptions = [
        { id: 'all', label: 'Semua' },
        { id: 'pending', label: 'Pending' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'request_edit', label: 'Req Edit' },
        { id: 'completed', label: 'Done' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    // Filter reservations based on customer name search
    const filteredReservations = reservations.filter(r =>
        r.customer_name.toLowerCase().includes(searchCustomerName.toLowerCase())
    );

    // Group reservations by customer name and uid
    const groupedReservations = filteredReservations.reduce((acc, reservation) => {
        const key = `${reservation.customer_name}|${reservation.cart_uid}`;
        if (!acc[key]) {
            acc[key] = {
                customer_name: reservation.customer_name,
                cart_uid: reservation.cart_uid,
                customer_email: reservation.customer_email,
                customer_phone: reservation.customer_phone,
                booking_status: reservation.booking_status,
                date: reservation.date,
                sessions: []
            };
        }
        acc[key].sessions.push(reservation);
        return acc;
    }, {});

    const customerGroups = Object.values(groupedReservations);

    const handleFilterStatus = (status) => {
        get(`/photographer/reservations?status=${status}`, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleClearSearch = () => {
        setSearchCustomerName('');
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

    const getFollowUpLink = (session, templateContent) => {
        if (!session || !templateContent) return '#';

        let text = templateContent
            .replace(/\[client_name\]/g, session.customer_name || '')
            .replace(/\[booking_code\]/g, session.cart_uid || '')
            .replace(/\[package_name\]/g, session.package_name || '')
            .replace(/\[scheduled_date\]/g, session.date ? new Date(session.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

        const phone = session.customer_phone?.startsWith('0') ? '62' + session.customer_phone.substring(1) : session.customer_phone;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };


    return (
        <AdminLayout>
            <Head title="Jadwal Reservasi" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white dark:bg-white/3 p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl mb-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-1">Jadwal Reservasi</h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">
                                Lihat semua reservasi booking dari customer
                            </p>
                        </div>

                        {/* Filters Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search by Customer Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Cari Nama Customer
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchCustomerName}
                                        onChange={(e) => setSearchCustomerName(e.target.value)}
                                        placeholder="Ketik nama customer..."
                                        className="flex-1 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-bold text-brand-black dark:text-brand-white placeholder-brand-black/30 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                    />
                                    {searchCustomerName && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="p-2 rounded-lg bg-brand-red/10 hover:bg-brand-red/20 text-brand-red transition-colors"
                                            title="Clear search"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filter by Status */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Filter Status Booking
                                </label>
                                
                                {/* Mobile View: Dropdown */}
                                <div className="relative sm:hidden">
                                    <select
                                        value={filters?.status || 'confirmed'}
                                        onChange={(e) => handleFilterStatus(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-white/5 border-0 rounded-xl text-[11px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-1 focus:ring-brand-gold appearance-none"
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s.id} value={s.id} className="bg-white dark:bg-brand-black">
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 dark:text-brand-white/40 pointer-events-none" />
                                </div>

                                {/* Desktop View: Tabs */}
                                <div className="hidden sm:flex gap-1 overflow-x-auto pb-1.5 lg:pb-0">
                                    {statusOptions.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleFilterStatus(s.id)}
                                            className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${filters?.status === s.id
                                                ? 'bg-brand-red text-white shadow-md'
                                                : 'bg-gray-100 text-brand-black/40 dark:bg-white/5 dark:text-brand-white/40 hover:bg-gray-200'
                                                }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grouped Reservations Summary */}
                <div className="space-y-4">
                    {customerGroups.length > 0 ? (
                        customerGroups.map((group) => (
                            <Fragment key={`${group.customer_name}-${group.cart_uid}`}>
                                <button
                                    onClick={() => setSelectedCustomerGroup(
                                        selectedCustomerGroup?.cart_uid === group.cart_uid ? null : group
                                    )}
                                    className="w-full bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-brand-gold/30 text-left"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <UserIcon
                                                className="
                                                    w-6 h-6 text-brand-gold shrink-0
                                                "
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm sm:text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tight truncate">
                                                    {group.customer_name}
                                                </h3>
                                                <p className="text-[9px] sm:text-[10px] text-brand-black/40 dark:text-brand-white/40 font-bold mt-0.5">
                                                    UID: {group.cart_uid}
                                                </p>
                                            </div>

                                            {/* Status & Date - Mobile & Desktop Balanced */}
                                            <div className="flex flex-col items-center gap-1 sm:gap-1.5 px-3 sm:px-6 sm:border-x border-black/5 dark:border-white/5 mx-1 sm:mx-2 shrink-0">
                                                <span className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-[4px] sm:rounded text-[7px] sm:text-[8px] font-black uppercase tracking-widest ${getStatusColor(group.booking_status)}`}>
                                                    {group.booking_status}
                                                </span>
                                                <div className="flex items-center gap-1 opacity-40">
                                                    <CalendarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter">
                                                        {new Date(group.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 min-w-[50px]">
                                                <p className="text-lg sm:text-2xl font-black text-brand-gold leading-none">
                                                    {group.sessions.length}
                                                </p>
                                                <p className="text-[8px] sm:text-[10px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase mt-0.5">
                                                    SESI
                                                </p>
                                            </div>
                                            <ChevronRightIcon className={`w-4 h-4 sm:w-5 sm:h-5 text-brand-gold transition-transform shrink-0 ${selectedCustomerGroup?.cart_uid === group.cart_uid ? 'rotate-90' : ''
                                                }`} />
                                        </div>
                                    </div>
                                </button>

                                {/* Expanded View - Modal */}
                                <Transition
                                    show={selectedCustomerGroup?.cart_uid === group.cart_uid}
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="space-y-3 mb-4">
                                        {group.sessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className="bg-brand-gold/5 dark:bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-4 ml-4"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Date & Time */}
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="w-4 h-4 text-brand-gold" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Tanggal</span>
                                                        </div>
                                                        <p className="text-xs font-black text-brand-black dark:text-brand-white">
                                                            {getDateDisplay(session.date)}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <ClockIcon className="w-4 h-4 text-brand-gold" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Waktu</span>
                                                        </div>
                                                        <p className="text-xs font-black text-brand-gold">
                                                            {session.time}
                                                            {session.offset_minutes > 0 && (
                                                                <span className="text-[9px] text-brand-red ml-2">+{session.offset_minutes}m</span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Package Info */}
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <ShoppingBagIcon className="w-4 h-4 text-brand-gold" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Paket</span>
                                                        </div>
                                                        <p className="text-xs font-black text-brand-black dark:text-brand-white">
                                                            {session.package_name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <CurrencyDollarIcon className="w-4 h-4 text-brand-gold" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Harga</span>
                                                        </div>
                                                        <p className="text-xs font-black text-brand-gold">
                                                            {formatIDR(session.package_price)}
                                                        </p>
                                                    </div>

                                                    {/* Contact Info */}
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <EnvelopeIcon className="w-4 h-4 text-brand-gold" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Kontak</span>
                                                        </div>
                                                        <a
                                                            href={`mailto:${group.customer_email}`}
                                                            className="text-[9px] font-bold text-brand-black/60 dark:text-brand-white/60 hover:text-brand-gold transition-colors"
                                                        >
                                                            {group.customer_email}
                                                        </a>
                                                        <a
                                                            href={` tel:${group.customer_phone}`}
                                                            className="text-[9px] font-bold text-brand-black/60 dark:text-brand-white/60 hover:text-brand-gold transition-colors"
                                                        >
                                                            {group.customer_phone}
                                                        </a>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedItemForFollowUp(session);
                                                                setIsSelectionModalOpen(true);
                                                            }}
                                                            className="mt-2 w-full py-1.5 bg-green-500 hover:bg-green-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/10"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M17.472 14.382c-.301-.15-1.78-.876-2.056-.976-.277-.1-.478-.15-.678.15s-.777.977-.952 1.177-.35.225-.651.075c-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.13-.611.136-.134.301-.35.451-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525s-.678-1.635-.929-2.239c-.244-.589-.493-.51-.678-.52h-.579c-.201 0-.527.076-.802.376s-1.053 1.028-1.053 2.508 1.103 2.909 1.254 3.109c.151.2 2.169 3.312 5.255 4.643.735.316 1.307.505 1.754.647.739.234 1.412.201 1.944.121.594-.09 1.78-.727 2.03-1.431.25-.705.25-1.309.175-1.432-.075-.123-.276-.198-.577-.348zM12 2C6.477 2 2 6.477 2 12c0 2.159.685 4.155 1.854 5.8L2.05 22l4.31-.968C7.942 21.683 9.897 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                                            </svg>
                                                            Follow Up
                                                        </button>
                                                    </div>
                                                </div>
                                                {session.offset_description && (
                                                    <div className="mt-3 pt-3 border-t border-brand-gold/20">
                                                        <p className="text-[9px] font-bold text-brand-black/60 dark:text-brand-white/60 italic">
                                                            📝 {session.offset_description}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Transition>
                            </Fragment>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-white/3 border border-dashed border-black/10 dark:border-white/10 rounded-2xl p-12 text-center">
                            <CalendarIcon className="w-12 h-12 text-brand-black/20 dark:text-brand-white/20 mx-auto mb-4" />
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest italic">
                                {searchCustomerName ? 'Tidak ada reservasi sesuai pencarian' : 'Belum ada reservasi booking untuk status ini'}
                            </p>
                        </div>
                    )}
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
                                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mt-1">Pilih pesan untuk dikirim ke {selectedItemForFollowUp?.customer_name}</p>
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
            </div>
        </AdminLayout>
    );
}
