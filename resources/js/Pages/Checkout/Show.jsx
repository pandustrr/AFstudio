import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { CheckCircleIcon, QrCodeIcon, DocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';

export default function CheckoutShow({ booking, rooms = [], homePage = {} }) {
    const { settings } = usePage().props;
    const [proofFile, setProofFile] = useState(null);
    const [proofUploaded, setProofUploaded] = useState(false);
    const [uploadedProofStatus, setUploadedProofStatus] = useState(null);
    const { post, processing, errors } = useForm();

    useEffect(() => {
        // Check if payment proof already exists
        const checkProofStatus = async () => {
            try {
                const response = await fetch(`/api/booking/${booking.id}/proof-status`);
                if (response.ok) {
                    const data = await response.json();
                    setUploadedProofStatus(data.status);
                    setProofUploaded(!!data.exists);
                }
            } catch (error) {
                console.log('Error checking proof status:', error);
            }
        };

        checkProofStatus();
    }, [booking.id]);

    const getRoomLabel = (id) => {
        const room = rooms.find(r => r.id === parseInt(id));
        return room ? room.label : `Room ${id}`;
    };

    const formatPrice = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    // Prepare WhatsApp Message
    const waNumber = settings?.admin_whatsapp || homePage?.admin_whatsapp || "6285134363956"; // Admin Number

    let itemsMessage = "";
    booking.items.forEach((item, index) => {
        itemsMessage += `${index + 1}. ${item.package.name} - ${item.scheduled_date} (${item.start_time.substring(0, 5)}-${item.end_time.substring(0, 5)}) [${getRoomLabel(item.room_id)}]\n`;
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File terlalu besar. Maksimal 5MB.');
                return;
            }
            setProofFile(file);
        }
    };

    const handleUploadProof = (e) => {
        e.preventDefault();
        if (!proofFile) {
            alert('Silakan pilih file bukti pembayaran terlebih dahulu.');
            return;
        }

        const formData = new FormData();
        formData.append('booking_id', booking.id);
        formData.append('proof_file', proofFile);

        router.post('/checkout/upload-proof', formData, {
            onSuccess: () => {
                setProofFile(null);
                setProofUploaded(true);
                setUploadedProofStatus('pending');
            }
        });
    };

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

                        {/* QRIS Payment Code */}
                        <div className="bg-white p-4 rounded-xl mb-6 mx-auto w-56 h-auto flex items-center justify-center border border-black/10">
                            <img src="/images/qris-afstudio.jpeg" alt="QRIS Payment AF Studio" className="w-full h-auto object-contain rounded-lg" />
                        </div>

                        {/* Booking Details Summary */}
                        <div className="mb-6 text-left space-y-3 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                            {booking.items.map((item) => (
                                <div key={item.id} className="border-b border-black/5 dark:border-white/5 last:border-0 pb-2 last:pb-0">
                                    <p className="text-xs font-bold uppercase text-brand-black dark:text-brand-white">{item.package.name}</p>
                                    <p className="text-[10px] text-brand-black/60 dark:text-brand-white/60">
                                        Date: {item.scheduled_date} | Time: {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                                    </p>
                                    {(item.room_id || item.room_name) && (
                                        <p className="text-[10px] text-brand-black/60 dark:text-brand-white/60">
                                            Studio: {item.room_name || getRoomLabel(item.room_id)}
                                        </p>
                                    )}
                                    {item.photographer && (
                                        <p className="text-[10px] text-brand-black/60 dark:text-brand-white/60">
                                            Photographer: {item.photographer.name}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mb-4 text-left">
                            <p className="text-xs font-bold uppercase text-brand-black/40 dark:text-brand-white/40 mb-1">Total Pricing</p>
                            <p className="text-lg font-bold text-brand-black dark:text-brand-white tracking-tight">
                                {formatPrice(booking.total_price)}
                            </p>
                        </div>

                        {/* Discount Info */}
                        {booking.discount_amount > 0 && (
                            <div className="mb-4 text-left bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-xs font-bold uppercase text-green-600 dark:text-green-400 mb-1">Discount Applied</p>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                    - {formatPrice(booking.discount_amount)}
                                </p>
                                {booking.referral_code && (
                                    <p className="text-[10px] text-green-600/70 dark:text-green-400/70 mt-1">
                                        Code: <span className="font-mono">{booking.referral_code.code}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Final Price */}
                        <div className="mb-8 text-left bg-brand-gold/10 p-3 rounded-lg border border-brand-gold/20">
                            <p className="text-xs font-bold uppercase text-brand-black/40 dark:text-brand-white/40 mb-1">Final Price (After Discount)</p>
                            <p className="text-2xl font-black text-brand-red italic tracking-tight">
                                {formatPrice(booking.total_price - booking.discount_amount)}
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

                        {/* Upload Proof of Payment Section - REQUIRED FIRST STEP */}
                        <div className="mb-8 pb-8 border-b border-black/10 dark:border-white/10">
                            <form onSubmit={handleUploadProof} className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <DocumentIcon className="w-5 h-5 text-brand-red" />
                                    <span className="text-xs font-black uppercase tracking-widest text-brand-red">
                                        ★ Upload Bukti Pembayaran Terlebih Dahulu (Wajib)
                                    </span>
                                </div>

                                <div className="relative">
                                    <label htmlFor="proof_file" className="block">
                                        <input
                                            type="file"
                                            id="proof_file"
                                            name="proof_file"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            required
                                            disabled={proofUploaded}
                                        />
                                        <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${proofUploaded
                                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                            : proofFile
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                                : 'border-brand-black/20 dark:border-brand-white/20 hover:border-brand-black/40 dark:hover:border-brand-white/40'
                                            }`}>
                                            {proofUploaded ? (
                                                <>
                                                    <CheckIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                                    <p className="text-sm font-bold text-green-600 dark:text-green-400">Bukti Pembayaran Terverifikasi</p>

                                                    {booking.payment_proof && booking.payment_proof.length > 0 && (
                                                        <div className="mt-4 rounded-xl overflow-hidden border border-green-200 dark:border-green-800">
                                                            <img
                                                                src={`/storage/${booking.payment_proof[0].file_path}`}
                                                                alt="Payment Proof"
                                                                className="w-full h-auto object-contain max-h-48"
                                                            />
                                                        </div>
                                                    )}

                                                    <p className="text-[10px] text-green-600/60 dark:text-green-400/60 mt-1">
                                                        Status: <span className="font-bold capitalize">{uploadedProofStatus}</span>
                                                    </p>
                                                </>
                                            ) : proofFile ? (
                                                <>
                                                    <CheckIcon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{proofFile.name}</p>
                                                    <p className="text-xs text-blue-600/60 dark:text-blue-400/60 mt-1">
                                                        {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <DocumentIcon className="w-8 h-8 text-brand-black/40 dark:text-brand-white/40 mx-auto mb-2" />
                                                    <p className="text-xs font-bold text-brand-black/60 dark:text-brand-white/60">
                                                        Click atau drag file bukti pembayaran
                                                    </p>
                                                    <p className="text-[10px] text-brand-black/40 dark:text-brand-white/40 mt-1">
                                                        (JPG, PNG, PDF - Max 5MB)
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {errors.proof_file && (
                                    <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                                        <p className="text-xs text-red-600 dark:text-red-400">{errors.proof_file}</p>
                                    </div>
                                )}

                                {!proofUploaded && (
                                    <button
                                        type="submit"
                                        disabled={!proofFile || processing}
                                        className={`w-full py-4 font-black uppercase tracking-widest rounded-xl transition-all ${proofFile && !processing
                                            ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-lg shadow-blue-500/20'
                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {processing ? 'Uploading...' : 'Upload Bukti Pembayaran'}
                                    </button>
                                )}

                                <p className="text-[10px] text-brand-black/40 dark:text-brand-white/40 leading-tight">
                                    Upload screenshot/foto bukti transfer anda. Admin akan memverifikasi dalam beberapa menit.
                                </p>
                            </form>
                        </div>

                        {/* WhatsApp Button - ENABLED ONLY AFTER UPLOAD */}
                        {proofUploaded ? (
                            <>
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-green-600 hover:scale-105 transition-all shadow-lg shadow-green-500/20"
                                >
                                    <PhoneIcon className="w-5 h-5" />
                                    Hubungi Admin via WhatsApp
                                </a>

                                <p className="mt-4 text-[10px] text-brand-black/40 dark:text-brand-white/40 leading-tight">
                                    Bukti pembayaran sudah diunggah. Klik tombol di atas untuk menghubungi admin dan konfirmasi booking Anda.
                                </p>
                            </>
                        ) : (
                            <div className="w-full py-4 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest rounded-xl cursor-not-allowed text-center">
                                <PhoneIcon className="w-5 h-5 inline-block mr-2" />
                                Upload bukti pembayaran terlebih dahulu
                            </div>
                        )}
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
