import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { ShieldCheckIcon, CalendarIcon, MapPinIcon, PhoneIcon, UserIcon, ChatBubbleBottomCenterTextIcon, ClockIcon, HomeIcon, ShoppingCartIcon, TicketIcon } from '@heroicons/react/24/outline';

export default function CheckoutCreate({ carts = [], rooms = [], photographers = [] }) {
    const { auth } = usePage().props;
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [validatingCode, setValidatingCode] = useState(false);

    const getRoomLabel = (id) => {
        const room = rooms.find(r => r.id === parseInt(id));
        return room ? room.label : `Room ${id}`;
    };

    const getPhotographerName = (id) => {
        const fg = photographers.find(p => p.id === parseInt(id));
        return fg ? fg.name : 'Unknown Photographer';
    };

    const user = auth?.user || {};

    const { data, setData, post, processing, errors } = useForm({
        name: user.name || localStorage.getItem('afstudio_customer_name') || '',
        university: '',
        domicile: '',
        phone: '',
        location: '',
        notes: '',
        referral_code: '',
        cart_uid: localStorage.getItem('afstudio_cart_uid') || '',
    });

    const total = Array.isArray(carts)
        ? carts.reduce((sum, c) => sum + (parseFloat(c?.package?.price_numeric || 0) * c.quantity), 0)
        : 0;

    const formatPrice = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    const validateReferralCode = async (code) => {
        if (!code.trim()) {
            setAppliedDiscount(null);
            return;
        }

        setValidatingCode(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                             document.querySelector('input[name="_token"]')?.value;

            const response = await fetch('/api/referral-codes/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ code: code.toUpperCase() })
            });

            const result = await response.json();

            if (response.ok && result.valid) {
                setAppliedDiscount(result.code);
            } else {
                setAppliedDiscount(null);
                if (result.message) {
                    console.warn('Referral validation:', result.message);
                }
            }
        } catch (error) {
            console.error('Error validating referral code:', error);
            setAppliedDiscount(null);
        } finally {
            setValidatingCode(false);
        }
    };

    const handleReferralCodeChange = (e) => {
        const code = e.target.value;
        setData('referral_code', code);
        if (code.length > 2) {
            validateReferralCode(code);
        } else {
            setAppliedDiscount(null);
        }
    };

    const calculateDiscount = () => {
        if (!appliedDiscount) return 0;

        if (appliedDiscount.discount_type === 'percentage') {
            return (total * appliedDiscount.discount_value) / 100;
        } else {
            return Math.min(appliedDiscount.discount_value, total);
        }
    };

    const discount = calculateDiscount();
    const finalTotal = total - discount;

    const submit = (e) => {
        e.preventDefault();
        console.log('Submitting form with data:', data);

        post('/checkout', {
            preserveScroll: true,
            headers: {
                'X-Cart-UID': data.cart_uid
            },
            onError: (errors) => {
                console.error('Checkout error:', errors);
                window.scrollTo(0, 0);
            },
            onSuccess: () => {
                console.log('Checkout successful!');
            },
            onFinish: () => {
                console.log('Checkout finished');
            }
        });
    };

    const { flash } = usePage().props;

    return (
        <div className="min-h-screen bg-brand-white dark:bg-brand-black transition-colors duration-300 pb-20">
            <Head title="Checkout - AFSTUDIO" />
            <Navbar />

            <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left: Booking Form */}
                    <div className="flex-1 order-2 lg:order-1">
                        <div className="mb-8 p-6 bg-brand-gold/10 border-l-4 border-brand-gold rounded-r-xl">
                            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-brand-black dark:text-brand-white flex items-center gap-3">
                                <ShieldCheckIcon className="w-8 h-8 md:w-10 md:h-10 text-brand-red" />
                                Form Booking
                            </h1>
                            <p className="mt-2 text-brand-black/60 dark:text-brand-white/60 text-sm font-bold uppercase tracking-widest">
                                Mohon untuk diisi kak ya! 🙏🏻😇
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Error Messages */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">Validation Errors:</p>
                                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                                        {Object.entries(errors).map(([field, message]) => (
                                            <li key={field}>• {Array.isArray(message) ? message[0] : message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Session UID (Read-only) */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/40 dark:text-brand-white/40">
                                    <ShieldCheckIcon className="w-4 h-4" /> Session ID
                                </label>
                                <div className="w-full bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-brand-black/50 dark:text-brand-white/50 font-mono text-xs tracking-widest">
                                    {data.cart_uid || 'NO-SESSION'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                        <UserIcon className="w-4 h-4" /> Nama ; <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name}</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                        <PhoneIcon className="w-4 h-4" /> WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                        placeholder="e.g. 081234567890"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs font-bold">{errors.phone}</p>}
                                </div>

                                {/* University */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                        <HomeIcon className="w-4 h-4" /> Nama univ:
                                    </label>
                                    <input
                                        type="text"
                                        value={data.university}
                                        onChange={e => setData('university', e.target.value)}
                                        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                        placeholder="Contoh: UNEJ / POLIJE"
                                    />
                                    {errors.university && <p className="text-red-500 text-xs font-bold">{errors.university}</p>}
                                </div>

                                {/* Domicile */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                        <MapPinIcon className="w-4 h-4" /> Domisili:
                                    </label>
                                    <input
                                        type="text"
                                        value={data.domicile}
                                        onChange={e => setData('domicile', e.target.value)}
                                        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                        placeholder="Contoh: Kaliwates, Jember"
                                    />
                                    {errors.domicile && <p className="text-red-500 text-xs font-bold">{errors.domicile}</p>}
                                </div>

                                {/* Tanggal Acara (Read-only from first item for display) */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                        <CalendarIcon className="w-4 h-4" /> Tanggal acara ;
                                    </label>
                                    <div className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-brand-black/60 dark:text-brand-white/60 font-bold">
                                        {carts[0]?.scheduled_date || '-'}
                                    </div>
                                </div>

                                {/* Jam yg Disepakati (Read-only from first item for display) */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                        <ClockIcon className="w-4 h-4" /> Jam yg disepakati
                                    </label>
                                    <div className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-brand-black/60 dark:text-brand-white/60 font-bold">
                                        {carts[0]?.start_time?.substring(0, 5) || '-'} WIB
                                    </div>
                                </div>
                            </div>

                            {/* Paket yang diambil (Read-only summary) */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    <ShoppingCartIcon className="w-4 h-4" /> Paket yang di ambil (total harga):
                                </label>
                                <div className="w-full bg-brand-gold/5 border border-brand-gold/20 rounded-xl px-4 py-3 text-brand-gold font-black italic">
                                    {carts.map(c => c.package?.name).join(', ')} ({formatPrice(total)})
                                </div>
                            </div>

                            {/* Location (Alamat Acara) */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    <MapPinIcon className="w-4 h-4" /> Alamat acara ; <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                    placeholder="Alamat lengkap lokasi pemotretan"
                                />
                                {errors.location && <p className="text-red-500 text-xs font-bold">{errors.location}</p>}
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    <TicketIcon className="w-4 h-4" /> Kode Referral
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.referral_code}
                                        onChange={handleReferralCodeChange}
                                        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white uppercase"
                                        placeholder="Masukkan kode referral (opsional)"
                                    />
                                    {validatingCode && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                {appliedDiscount && (
                                    <p className="text-xs font-bold text-green-600 dark:text-green-400">
                                        ✓ Kode valid! Diskon {appliedDiscount.discount_type === 'percentage' ? `${appliedDiscount.discount_value}%` : `Rp${appliedDiscount.discount_value}`} diterapkan
                                    </p>
                                )}
                            </div>

                            {/* Catatan Tambahan */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    <ChatBubbleBottomCenterTextIcon className="w-4 h-4" /> Catatan Tambahan
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white h-24"
                                    placeholder="Kebutuhan khusus atau permintaan lainnya..."
                                />
                                {errors.notes && <p className="text-red-500 text-xs font-bold">{errors.notes}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-brand-red text-white font-black uppercase tracking-[0.2em] rounded-xl hover:bg-brand-gold hover:text-brand-black transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-96 order-1 lg:order-2">
                        <div className="sticky top-24 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-brand-black dark:text-brand-white">
                                Order Summary
                            </h2>

                            <div
                                className="
                                    space-y-4 max-h-[400px]
                                    overflow-y-auto pr-2 custom-scrollbar
                                "
                            >
                                {carts.map((cart) => (
                                    <div key={cart.id} className="pb-4 border-b border-black/5 dark:border-white/5 last:border-0">
                                        <div className="flex gap-4 mb-2">
                                            <div className="w-12 h-12 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-brand-black dark:text-brand-white">{cart.quantity}x</span>
                                            </div>
                                            <div className="grow">
                                                <h3 className="text-xs font-bold uppercase text-brand-black dark:text-brand-white mb-1">
                                                    {cart.package.name}
                                                </h3>
                                                <p className="text-[10px] text-brand-black/50 dark:text-brand-white/50 uppercase">
                                                    {cart.package.sub_category?.name}
                                                </p>
                                            </div>
                                            <div className="text-xs font-bold text-brand-black dark:text-brand-white">
                                                {formatPrice(cart.package.price_numeric * cart.quantity)}
                                            </div>
                                        </div>

                                        {/* Schedule Info Display */}
                                        <div className="bg-brand-gold/10 rounded-lg p-3 border border-brand-gold/20">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-brand-black dark:text-brand-white mb-1">
                                                <CalendarIcon className="w-3.5 h-3.5 text-brand-black/40 dark:text-brand-white/40" />
                                                <span>{cart.scheduled_date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-brand-black dark:text-brand-white mb-1">
                                                <ClockIcon className="w-3.5 h-3.5 text-brand-black/40 dark:text-brand-white/40" />
                                                <span>{cart.start_time?.substring(0, 5)} - {cart.end_time?.substring(0, 5)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-brand-black dark:text-brand-white">
                                                {cart.photographer_id ? (
                                                    <>
                                                        <UserIcon className="w-3.5 h-3.5 text-brand-black/40 dark:text-brand-white/40" />
                                                        <span>FG: {getPhotographerName(cart.photographer_id)}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MapPinIcon className="w-3.5 h-3.5 text-brand-black/40 dark:text-brand-white/40" />
                                                        <span>Studio {getRoomLabel(cart.room_id)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t-2 border-dashed border-black/10 dark:border-white/10 space-y-2">
                                <div className="flex justify-between items-center text-xs font-bold text-brand-black/60 dark:text-brand-white/60">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                {appliedDiscount && (
                                    <div className="flex justify-between items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded">
                                        <span>Diskon ({appliedDiscount.discount_type === 'percentage' ? `${appliedDiscount.discount_value}%` : 'Fixed'})</span>
                                        <span>- {formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-xl font-black text-brand-red italic uppercase tracking-tighter">
                                    <span>Total</span>
                                    <span>{formatPrice(finalTotal || total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
