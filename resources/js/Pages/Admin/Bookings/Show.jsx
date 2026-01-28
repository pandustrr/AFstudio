import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ChevronLeftIcon,
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
    ChatBubbleLeftEllipsisIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    KeyIcon,
    DocumentArrowDownIcon,
    DocumentIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import ConfirmModal from '../../../Components/ConfirmModal';

export default function BookingShow({ booking, photographers = [] }) {
    const { processing } = useForm();
    const [confirmConfig, setConfirmConfig] = React.useState({
        isOpen: false,
        status: null,
        title: '',
        message: '',
        variant: 'warning'
    });

    const updateStatus = (newStatus) => {
        router.patch(`/admin/bookings/${booking.id}`, {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => setConfirmConfig({ ...confirmConfig, isOpen: false })
        });
    };

    const triggerConfirm = (status, title, message, variant = 'warning') => {
        setConfirmConfig({
            isOpen: true,
            status,
            title,
            message,
            variant
        });
    };





    const formatPrice = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    const getStatusStyles = (s) => {
        switch (s) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AdminLayout>
            <Head title={`Booking ${booking.booking_code}`} />

            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={() => updateStatus(confirmConfig.status)}
                title={confirmConfig.title}
                message={confirmConfig.message}
                variant={confirmConfig.variant}
                processing={processing}
            />

            <div className="pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Back Button */}
                    <Link
                        href="/admin/bookings"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 hover:text-brand-red transition-colors mb-8"
                    >
                        <ChevronLeftIcon className="w-4 h-4" /> Back to List
                    </Link>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter">
                                    {booking.booking_code}
                                </h1>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <p className="text-sm text-brand-black/50 dark:text-brand-white/50 font-bold uppercase tracking-widest">
                                Booking placed on {booking.booking_date}
                            </p>
                        </div>

                        {/* Status Actions (Compact) */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex flex-wrap gap-2">
                                {booking.status === 'confirmed' && (
                                    <button
                                        onClick={() => updateStatus('completed')}
                                        disabled={processing}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                                    >
                                        <CheckCircleIcon className="w-4 h-4" /> Mark Completed
                                    </button>
                                )}
                            </div>

                            {booking.status === 'cancelled' && (
                                <button
                                    onClick={() => updateStatus('pending')}
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all mt-2"
                                >
                                    <ArrowPathIcon className="w-4 h-4" /> Kembali ke Status Pending
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Customer Details */}
                            <section className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                                <h2 className="text-sm font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-6 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> Customer Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 bg-brand-red/5 p-4 rounded-2xl border border-brand-red/10">
                                        <p className="text-[10px] font-black uppercase text-brand-red mb-1 flex items-center gap-2">
                                            <KeyIcon className="w-3 h-3" /> Session ID / Guest UID
                                        </p>
                                        <p className="font-mono font-black text-brand-black dark:text-brand-white text-lg tracking-widest">{booking.guest_uid || booking.booking_code}</p>
                                        <p className="text-[9px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase mt-1">Gunakan kode ini untuk login di Selector Photo</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Full Name</p>
                                        <p className="font-bold text-brand-black dark:text-brand-white">{booking.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Phone / WhatsApp</p>
                                        <a href={`https://wa.me/${booking.phone}`} target="_blank" className="font-bold text-brand-red flex items-center gap-2">
                                            <PhoneIcon className="w-4 h-4" /> {booking.phone}
                                        </a>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Location / Venue</p>
                                        <p className="font-bold text-brand-black dark:text-brand-white flex items-center gap-2">
                                            <MapPinIcon className="w-4 h-4 text-brand-black/40 border border-brand-black/10 rounded p-0.5" /> {booking.location}
                                        </p>
                                    </div>
                                    {booking.notes && (
                                        <div className="md:col-span-2">
                                            <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Additional Notes</p>
                                            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 text-sm text-brand-black/70 dark:text-brand-white/70 italic flex gap-3">
                                                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 shrink-0 opacity-20" />
                                                "{booking.notes}"
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Payment Proof Status */}
                            {booking.payment_proof && booking.payment_proof.length > 0 ? (
                                <section className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                                    <div className="mb-8">
                                        <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-3">Foto Bukti Pembayaran</p>
                                        <div className="relative group overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 max-h-[500px] bg-gray-100 dark:bg-white/5">
                                            <img
                                                src={`/storage/${booking.payment_proof[0].file_path}`}
                                                alt="Payment Proof"
                                                className="w-full h-auto object-contain cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-500"
                                                onClick={() => window.open(`/storage/${booking.payment_proof[0].file_path}`, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none flex items-center justify-center">
                                                <MagnifyingGlassIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Nama File</p>
                                            <p className="font-bold text-brand-black dark:text-brand-white break-all text-sm">{booking.payment_proof[0].file_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Ukuran File</p>
                                            <p className="font-bold text-brand-black dark:text-brand-white text-sm">{(booking.payment_proof[0].file_size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Tanggal Upload</p>
                                            <p className="font-bold text-brand-black dark:text-brand-white text-sm">{new Date(booking.payment_proof[0].created_at).toLocaleString('id-ID')}</p>
                                        </div>
                                        {booking.payment_proof[0].verified_at && (
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Tanggal Verifikasi</p>
                                                <p className="font-bold text-brand-black dark:text-brand-white text-sm">{new Date(booking.payment_proof[0].verified_at).toLocaleString('id-ID')}</p>
                                            </div>
                                        )}
                                        {booking.payment_proof[0].admin_notes && (
                                            <div className="md:col-span-2">
                                                <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Catatan Admin</p>
                                                <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 text-sm text-brand-black/70 dark:text-brand-white/70">{booking.payment_proof[0].admin_notes}</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-10 flex flex-wrap gap-4">
                                        {booking.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => triggerConfirm(
                                                        'confirmed',
                                                        'Konfirmasi Booking',
                                                        'Setelah dikonfirmasi, sistem akan membuatkan sesi photo selector untuk customer.',
                                                        'success'
                                                    )}
                                                    className="flex items-center gap-2 px-8 py-4 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                                                >
                                                    <DocumentIcon className="w-5 h-5" /> Konfirmasi dan Buat Invoice
                                                </button>
                                                <button
                                                    onClick={() => triggerConfirm(
                                                        'cancelled',
                                                        'Batalkan Booking',
                                                        'Apakah Anda yakin ingin membatalkan pesanan ini?',
                                                        'danger'
                                                    )}
                                                    className="flex items-center gap-2 px-8 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                                                >
                                                    <XCircleIcon className="w-5 h-5" /> Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {booking.status === 'confirmed' && (
                                                    <>
                                                        <a
                                                            href={`/admin/bookings/${booking.id}/invoice`}
                                                            target="_blank"
                                                            className="flex items-center gap-2 px-8 py-4 bg-brand-gold text-brand-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-gold/20"
                                                        >
                                                            <DocumentIcon className="w-5 h-5" /> Lihat Invoice
                                                        </a>
                                                        <a
                                                            href={`https://wa.me/${booking.phone.startsWith('0') ? '62' + booking.phone.substring(1) : booking.phone}?text=${encodeURIComponent(`Halo ${booking.name}! ${String.fromCodePoint(0x1F44B)} Terima kasih sudah booking di AFstudio. Booking kamu sudah kami konfirmasi, nih! ${String.fromCodePoint(0x1F60A)}\n\nSilakan klik link di bawah untuk melihat rincian invoice kamu:\n${window.location.origin}/pdf/booking/${booking.booking_code}\n\nSampai jumpa di sesi nanti! Jika ada pertanyaan, langsung kabari kami, ya. ${String.fromCodePoint(0x2728)}`)}`}
                                                            target="_blank"
                                                            className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/20"
                                                        >
                                                            <PhoneIcon className="w-5 h-5" /> WA Customer
                                                        </a>
                                                        <button
                                                            onClick={() => triggerConfirm(
                                                                'cancelled',
                                                                'Batalkan Booking',
                                                                'Apakah Anda yakin ingin membatalkan pesanan ini?',
                                                                'danger'
                                                            )}
                                                            className="flex items-center gap-2 px-8 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                                                        >
                                                            <XCircleIcon className="w-5 h-5" /> Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </section>
                            ) : (
                                <section className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-3xl p-8">
                                    <p className="text-yellow-800 dark:text-yellow-200 font-bold text-sm flex items-center gap-2">
                                        <DocumentIcon className="w-5 h-5" /> ⚠️ Belum ada bukti pembayaran yang diunggah
                                    </p>
                                </section>
                            )}

                            {/* Paket & Jadwal Booking */}
                            <section className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                                <h2 className="text-sm font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-6 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" /> Paket & Jadwal 
                                </h2>
                                <div className="space-y-6">
                                    {booking.items.map((item) => (
                                        <div key={item.id} className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div>
                                                    <h3 className="font-black text-brand-black dark:text-brand-white uppercase tracking-tight mb-1">
                                                        {item.package.name}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest mb-4">
                                                        {item.package.sub_category?.name}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-brand-black/60 dark:text-brand-white/60">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            {item.scheduled_date}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-bold text-brand-black/60 dark:text-brand-white/60">
                                                            <ClockIcon className="w-4 h-4" />
                                                            {item.start_time !== item.adjusted_start_time ? (
                                                                <div className="flex flex-col">
                                                                    <span className="line-through opacity-40 text-[10px] leading-tight">
                                                                        {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                                                                    </span>
                                                                    <span className="text-brand-red font-black">
                                                                        {item.adjusted_start_time.substring(0, 5)} - {item.adjusted_end_time.substring(0, 5)}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span>{item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-brand-black/60 dark:text-brand-white/60">
                                                                <UserIcon className="w-4 h-4 text-brand-red" />
                                                                <div className="flex flex-col">
                                                                    <span className={`px-2 py-0.5 rounded-lg ${item.photographer ? 'bg-brand-gold/10 text-brand-gold' : 'bg-gray-100 text-gray-400'} text-[10px] font-black uppercase tracking-tight w-fit`}>
                                                                        {item.photographer?.name || 'Belum Ditentukan'}
                                                                    </span>
                                                                    {item.photographer?.phone && (
                                                                        <a
                                                                            href={`https://wa.me/${item.photographer.phone}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-[8px] font-black text-green-500 hover:text-green-600 transition-colors uppercase tracking-widest mt-0.5 px-0.5"
                                                                        >
                                                                            WA: {item.photographer.phone}
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 mb-1">Harga</p>
                                                    <p className="font-black text-brand-black dark:text-brand-white text-lg italic tracking-tighter">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar: Payment Summary */}
                        <div className="space-y-6">
                            <section className="bg-brand-black dark:bg-white text-white dark:text-brand-black rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ArrowPathIcon className="w-24 h-24 -rotate-12" />
                                </div>
                                <h2 className="relative text-sm font-black uppercase tracking-widest opacity-40 mb-8">Payment Summary</h2>

                                <div className="relative space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10 dark:border-black/10">
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Original Price</span>
                                        <span className="text-lg font-black italic tracking-tighter">{formatPrice(booking.total_price)}</span>
                                    </div>

                                    {/* Discount Section */}
                                    {booking.discount_amount > 0 && (
                                        <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/30">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Discount Applied</span>
                                                {booking.referral_code && (
                                                    <span className="text-[9px] font-mono text-green-400/70">{booking.referral_code.code}</span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center text-green-400 font-black text-xl italic tracking-tighter">
                                                <span>- {formatPrice(booking.discount_amount)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Final Price */}
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10 dark:border-black/10 bg-brand-gold/10 p-3 rounded-lg">
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-70">Final Price</span>
                                        <span className="text-xl font-black italic tracking-tighter">
                                            {formatPrice(booking.total_price - booking.discount_amount)}
                                        </span>
                                    </div>

                                    <div className="bg-brand-red/10 dark:bg-brand-red/5 p-4 rounded-xl border border-brand-red/20">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">Down Payment</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">25% Rounded</span>
                                        </div>
                                        <div className="flex justify-between items-center text-brand-red font-black text-2xl italic tracking-tighter">
                                            <span>{formatPrice(booking.down_payment)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Remaining (On the day)</span>
                                        <span className="text-xs font-black italic tracking-tighter opacity-60">
                                            {formatPrice((booking.total_price - booking.discount_amount) - booking.down_payment)}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-6 text-center italic text-[10px] text-brand-black/40 dark:text-brand-white/40 uppercase font-black tracking-widest leading-relaxed">
                                Mohon verifikasi bukti pembayaran dengan pelanggan melalui WhatsApp sebelum mengkonfirmasi pemesanan.
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
