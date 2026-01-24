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
    XMarkIcon
} from '@heroicons/react/24/outline';
import { formatIDR } from '../../utils/formatters';

export default function Reservations({ reservations, allSessions, selectedSessionId }) {
    const [filterSessionId, setFilterSessionId] = useState(selectedSessionId || '');
    const [filterCustomerName, setFilterCustomerName] = useState('');

    const getDateDisplay = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Filter reservations based on session_id and customer name
    const getFilteredReservations = () => {
        return reservations.filter((reservation) => {
            const matchSession = !filterSessionId || reservation.session_id === filterSessionId;
            const matchCustomer = !filterCustomerName ||
                reservation.customer_name.toLowerCase().includes(filterCustomerName.toLowerCase());
            return matchSession && matchCustomer;
        });
    };

    const handleSessionFilterChange = (e) => {
        setFilterSessionId(e.target.value);
    };

    const handleCustomerNameChange = (e) => {
        setFilterCustomerName(e.target.value);
    };

    const handleClearFilter = () => {
        setFilterSessionId('');
        setFilterCustomerName('');
    };

    const filteredReservations = getFilteredReservations();

    return (
        <AdminLayout>
            <Head title="Jadwal Reservasi" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 min-h-screen max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white dark:bg-white/3 p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-1">Jadwal Reservasi</h1>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">
                                Lihat semua reservasi booking dari customer
                            </p>
                        </div>

                        {/* Filter Section */}
                        <div className="flex flex-col sm:flex-row gap-4 items-end w-full sm:w-auto">
                            {/* Session ID Filter */}
                            <div className="flex flex-col gap-2 flex-1 sm:flex-none">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Session ID
                                </label>
                                <select
                                    value={filterSessionId}
                                    onChange={handleSessionFilterChange}
                                    className="px-4 py-2.5 rounded-lg border-2 border-brand-gold bg-white dark:bg-brand-black text-sm font-bold text-brand-black dark:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundSize: '12px',
                                        paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="">Semua Session</option>
                                    {allSessions && allSessions.map((session) => (
                                        <option key={session.id} value={session.id}>
                                            {session.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Customer Name Filter */}
                            <div className="flex flex-col gap-2 flex-1 sm:flex-none">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Nama Customer
                                </label>
                                <input
                                    type="text"
                                    value={filterCustomerName}
                                    onChange={handleCustomerNameChange}
                                    placeholder="Cari..."
                                    className="px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-brand-black dark:text-brand-white placeholder-brand-black/30 dark:placeholder-brand-white/30 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                                />
                            </div>

                            {/* Clear Button */}
                            {(filterSessionId || filterCustomerName) && (
                                <button
                                    onClick={handleClearFilter}
                                    className="px-4 py-2.5 rounded-lg bg-brand-red/10 hover:bg-brand-red/20 text-brand-red font-semibold transition-colors"
                                    title="Clear all filters"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reservations List */}
                <div className="space-y-4">
                    {filteredReservations.length > 0 ? (
                        filteredReservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Date & Time */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CalendarIcon className="w-4 h-4 text-brand-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Tanggal</span>
                                        </div>
                                        <p className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tight">
                                            {getDateDisplay(reservation.date)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <ClockIcon className="w-4 h-4 text-brand-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Waktu</span>
                                        </div>
                                        <p className="text-sm font-black text-brand-gold">
                                            {reservation.time}
                                            {reservation.offset_minutes > 0 && (
                                                <span className="text-xs text-brand-red ml-2">+{reservation.offset_minutes} min</span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserIcon className="w-4 h-4 text-brand-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Customer</span>
                                        </div>
                                        <p className="text-sm font-black text-brand-black dark:text-brand-white uppercase">
                                            {reservation.customer_name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <EnvelopeIcon className="w-4 h-4 text-brand-gold" />
                                            <a href={`mailto:${reservation.customer_email}`} className="text-xs font-bold text-brand-black/60 dark:text-brand-white/60 hover:text-brand-gold transition-colors">
                                                {reservation.customer_email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <PhoneIcon className="w-4 h-4 text-brand-gold" />
                                            <a href={`tel:${reservation.customer_phone}`} className="text-xs font-bold text-brand-black/60 dark:text-brand-white/60 hover:text-brand-gold transition-colors">
                                                {reservation.customer_phone}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Package Info */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShoppingBagIcon className="w-4 h-4 text-brand-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Paket</span>
                                        </div>
                                        <p className="text-sm font-black text-brand-black dark:text-brand-white uppercase">
                                            {reservation.package_name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <CurrencyDollarIcon className="w-4 h-4 text-brand-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Harga</span>
                                        </div>
                                        <p className="text-sm font-black text-brand-gold">
                                            {formatIDR(reservation.package_price)}
                                        </p>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="flex flex-col gap-2">
                                        {reservation.offset_description && (
                                            <>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">Catatan</div>
                                                <p className="text-xs text-brand-black/60 dark:text-brand-white/60 italic">
                                                    {reservation.offset_description}
                                                </p>
                                            </>
                                        )}
                                        {!reservation.offset_description && (
                                            <div className="text-[10px] font-bold text-brand-black/20 dark:text-brand-white/20 uppercase">-</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-white/3 border border-dashed border-black/10 dark:border-white/10 rounded-2xl p-12 text-center">
                            <CalendarIcon className="w-12 h-12 text-brand-black/20 dark:text-brand-white/20 mx-auto mb-4" />
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest italic">
                                {filterSessionId || filterCustomerName ? 'Tidak ada reservasi sesuai filter' : 'Belum ada reservasi booking'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
