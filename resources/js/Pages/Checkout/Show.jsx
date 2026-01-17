import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { CheckCircleIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';

export default function CheckoutShow({ booking }) {

    const formatPrice = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    // Prepare WhatsApp Message
    const waNumber = "6281230487469"; // Admin Number

    let itemsMessage = "";
    booking.items.forEach((item, index) => {
        itemsMessage += `${index + 1}. ${item.package.name} - ${item.scheduled_date} (${item.start_time.substring(0, 5)}-${item.end_time.substring(0, 5)})\n`;
    });

    const message = `Halo Admin AF Studio, saya sudah melakukan booking dan pembayaran DP.
    
No. Booking: *${booking.booking_code}*
Nama: ${booking.name}

Detail Paket:
${itemsMessage}

Total Biaya: ${formatPrice(booking.total_price)}
DP yang ditransfer (25%): *${formatPrice(booking.down_payment)}*
 
Mohon konfirmasinya. Terima kasih!`;

    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="min-h-screen bg-brand-white dark:bg-brand-black transition-colors duration-300 pb-20">
            <Head title={`Booking ${booking.booking_code} - AFSTUDIO`} />
            <Navbar />

            <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-4xl mx-auto text-center">

                <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-100 text-green-600 mb-6 animate-in zoom-in spin-in-12 duration-500">
                    <CheckCircleIcon className="w-12 h-12 md:w-16 md:h-16" />
                </div>

                <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-black dark:text-brand-white mb-4">
                    Booking Successful!
                </h1>
                <p className="text-brand-black/60 dark:text-brand-white/60 text-sm md:text-base max-w-lg mx-auto mb-12">
                    Thank you, <strong>{booking.name}</strong>. Your booking code is <span className="font-black text-brand-black dark:text-brand-white">{booking.booking_code}</span>.
                    Please complete your <strong>Down Payment (DP)</strong> to confirm your slot.
                </p>

                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-10 max-w-md mx-auto shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <QrCodeIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                            <span className="text-xs font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60">
                                Scan QRIS to Pay DP
                            </span>
                        </div>

                        {/* Placeholder QR Code - In real app use actual image */}
                        <div className="bg-white p-4 rounded-xl mb-6 mx-auto w-48 h-48 flex items-center justify-center border border-black/10">
                            {/* Replace with actual QR Image */}
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AFSTUDIO-PAYMENT" alt="QRIS Payment" className="w-full h-full object-contain mix-blend-multiply" />
                        </div>

                        {/* Booking Details Summary */}
                        <div className="mb-6 text-left space-y-3 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                            {booking.items.map((item) => (
                                <div key={item.id} className="border-b border-black/5 dark:border-white/5 last:border-0 pb-2 last:pb-0">
                                    <p className="text-xs font-bold uppercase text-brand-black dark:text-brand-white">{item.package.name}</p>
                                    <p className="text-[10px] text-brand-black/60 dark:text-brand-white/60">
                                        Date: {item.scheduled_date} | Time: {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                                    </p>
                                    <p className="text-[10px] text-brand-black/60 dark:text-brand-white/60">Room: {item.room_id}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mb-4 text-left">
                            <p className="text-xs font-bold uppercase text-brand-black/40 dark:text-brand-white/40 mb-1">Total Pricing</p>
                            <p className="text-lg font-bold text-brand-black dark:text-brand-white tracking-tight">
                                {formatPrice(booking.total_price)}
                            </p>
                        </div>

                        <div className="mb-8 text-left bg-brand-gold/10 p-4 rounded-xl border border-brand-gold/20">
                            <p className="text-xs font-bold uppercase text-brand-black/60 dark:text-brand-white/60 mb-1">Down Payment (Transfer Amount)</p>
                            <p className="text-3xl font-black text-brand-red italic tracking-tight">
                                {formatPrice(booking.down_payment)}
                            </p>
                            <p className="text-[10px] text-brand-black/40 dark:text-brand-white/40 mt-1">
                                (25% of Total, Min. 100k)
                            </p>
                        </div>

                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-green-600 hover:scale-105 transition-all shadow-lg shadow-green-500/20"
                        >
                            <PhoneIcon className="w-5 h-5" />
                            Send Proof via WhatsApp
                        </a>

                        <p className="mt-4 text-[10px] text-brand-black/40 dark:text-brand-white/40 leading-tight">
                            After payment, send the receipt to our admin via WhatsApp for instant confirmation.
                        </p>
                    </div>
                </div>

                <div className="mt-12">
                    <Link href="/" className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 hover:text-brand-red transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
