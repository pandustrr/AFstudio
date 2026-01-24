import React, { useState } from 'react';
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
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { formatIDR } from '../../utils/formatters';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Reservations({ reservations, allSessions, selectedSessionId }) {
    const [filterValue, setFilterValue] = useState(selectedSessionId || '');
    const [searchCustomerName, setSearchCustomerName] = useState('');
    const [selectedCustomerGroup, setSelectedCustomerGroup] = useState(null);
    const { get } = useForm();

    const getDateDisplay = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Extract unique UIDs from reservations
    const uniqueUIDs = [...new Set(reservations.map(r => r.cart_uid))].sort();

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
                sessions: []
            };
        }
        acc[key].sessions.push(reservation);
        return acc;
    }, {});

    const customerGroups = Object.values(groupedReservations);

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilterValue(value);
        if (value) {
            get(route('photographer.reservations', { uid: value }));
        }
    };

    const handleClearFilter = () => {
        setFilterValue('');
        get(route('photographer.reservations'));
    };

    const handleClearSearch = () => {
        setSearchCustomerName('');
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

                            {/* Filter by UID */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Filter by Customer UID
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={filterValue}
                                        onChange={handleFilterChange}
                                        className="flex-1 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-bold text-brand-black dark:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                    >
                                        <option value="">Semua Customer</option>
                                        {uniqueUIDs.map((uid) => (
                                            <option key={uid} value={uid}>
                                                {uid}
                                            </option>
                                        ))}
                                    </select>
                                    {filterValue && (
                                        <button
                                            onClick={handleClearFilter}
                                            className="p-2 rounded-lg bg-brand-red/10 hover:bg-brand-red/20 text-brand-red transition-colors"
                                            title="Clear filter"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    )}
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
                                            <UserIcon className="w-6 h-6 text-brand-gold flex-shrink-0" />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tight">
                                                    {group.customer_name}
                                                </h3>
                                                <p className="text-xs text-brand-black/40 dark:text-brand-white/40 font-bold mt-1">
                                                    UID: {group.cart_uid}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-2xl font-black text-brand-gold">
                                                    {group.sessions.length}
                                                </p>
                                                <p className="text-[10px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase">
                                                    {group.sessions.length === 1 ? 'Sesi' : 'Sesi'}
                                                </p>
                                            </div>
                                            <ChevronRightIcon className={`w-5 h-5 text-brand-gold transition-transform ${
                                                selectedCustomerGroup?.cart_uid === group.cart_uid ? 'rotate-90' : ''
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
                                                            href={`tel:${group.customer_phone}`}
                                                            className="text-[9px] font-bold text-brand-black/60 dark:text-brand-white/60 hover:text-brand-gold transition-colors"
                                                        >
                                                            {group.customer_phone}
                                                        </a>
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
                                {searchCustomerName || filterValue ? 'Tidak ada reservasi sesuai pencarian' : 'Belum ada reservasi booking'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
