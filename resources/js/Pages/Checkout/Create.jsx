import React, { useState } from 'react';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { ShieldCheckIcon, CalendarIcon, MapPinIcon, PhoneIcon, UserIcon, ChatBubbleBottomCenterTextIcon, ClockIcon, HomeIcon, ShoppingCartIcon, TicketIcon, QrCodeIcon, DocumentIcon, CheckIcon, CheckCircleIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import ConfirmModal from '@/Components/ConfirmModal';

export default function CheckoutCreate({ carts = [], rooms = [], photographers = [] }) {
    const { auth, settings, homePage } = usePage().props;
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [validatingCode, setValidatingCode] = useState(false);
    const [voucherError, setVoucherError] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Get the shared link to return to if cart is empty
    const backToPricelistUrl = localStorage.getItem('afstudio_last_shared_link') || '/price-list';

    const getRoomLabel = (id) => {
        const room = rooms.find(r => r.id === parseInt(id));
        return room ? room.label : `Room ${id}`;
    };

    const getPhotographerName = (id) => {
        const fg = photographers.find(p => p.id === parseInt(id));
        return fg ? fg.name : 'Unknown Photographer';
    };

    const user = auth?.user || {};

    // Get UID from URL first (for Direct Buy), fallback to localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const uidFromUrl = urlParams.get('uid');

    // Jika ada UID di URL, pastikan tersimpan di localStorage agar sinkron
    if (uidFromUrl && uidFromUrl.includes('-')) {
        localStorage.setItem('afstudio_cart_uid', uidFromUrl);
    }

    const cartItemIdFromUrl = urlParams.get('cart_item_id');
    const cartItemIdsFromUrl = urlParams.get('cart_item_ids');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        university: '',
        domicile: '',
        phone: '',
        location: '',
        venue_name: '',
        notes: '',
        referral_code: '',
        cart_uid: uidFromUrl || localStorage.getItem('afstudio_cart_uid') || '',
        cart_item_id: cartItemIdFromUrl || '',
        cart_item_ids: cartItemIdsFromUrl || '',
        proof_file: null,
        dp_amount: 0,
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
            setVoucherError(null);
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
                setVoucherError(null);
            } else {
                setAppliedDiscount(null);
                setVoucherError(result.message || 'Kode voucher tidak ditemukan.');
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
            setVoucherError(null);
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

    // DP Calculation logic (match backend)
    const calculateDP = () => {
        let dp;
        if (finalTotal > 500000) {
            dp = Math.ceil((finalTotal * 0.25) / 1000) * 1000;
        } else {
            dp = 100000;
        }
        if (dp > finalTotal) dp = finalTotal;
        return dp;
    };
    const downPayment = calculateDP();

    // Helper to get DP label based on total
    const getDPLabel = () => {
        if (finalTotal > 500000) return "(25% of Total)";
        return "(Min. 100k)";
    };

    // Sync initial/min DP to form data
    React.useEffect(() => {
        if (data.dp_amount < downPayment) {
            setData('dp_amount', downPayment);
        }
    }, [downPayment]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File terlalu besar. Maksimal 5MB.');
                return;
            }
            setData('proof_file', file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        console.log('Submitting form with data:', data);

        post('/checkout', {
            preserveScroll: true,
            forceFormData: true,
            headers: {
                'X-Cart-UID': data.cart_uid
            },
            onError: (errors) => {
                console.error('Checkout error:', errors);
                window.scrollTo(0, 0);
            },
            onSuccess: (page) => {
                const b = page.props.flash?.booking;
                if (b) {
                    const waNumber = settings?.admin_whatsapp || homePage?.admin_whatsapp || "6282232586727";
                    let itemsMessage = "";
                    b.items?.forEach((item, index) => {
                        const packageObj = item.package;
                        let timeInfo = `${item.start_time?.substring(0, 5).replace(':', '.')}-${item.end_time?.substring(0, 5).replace(':', '.')}`;

                        if (item.selected_times && item.selected_times.length > 0) {
                            const sorted = [...item.selected_times].sort();
                            timeInfo = "\n      - " + sorted.map((t, i) => {
                                const [h, m] = t.split(':').map(Number);
                                const totalMin = h * 60 + m + 30;
                                const endT = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
                                return `Sesi ${i + 1}: ${t.substring(0, 5).replace(':', '.')}-${endT}`;
                            }).join("\n      - ");
                        }

                        itemsMessage += `${index + 1}. ${packageObj?.name}\n   Tanggal: ${item.scheduled_date}\n   Jadwal: ${timeInfo}\n`;
                        if (item.room_name) itemsMessage += `   Studio: ${item.room_name}\n`;
                    });

                    const message = `Halo Admin! Saya sudah melakukan booking dan pembayaran DP.

*No. Booking: ${b.booking_code}*

Nama: ${b.name}
Lokasi/Venue: ${b.location}${b.venue_name ? ` (${b.venue_name})` : ''}

*Detail Paket:*
${itemsMessage}

*Rincian Pembayaran:*
- Total Paket: ${formatPrice(b.total_price)}
${b.discount_amount > 0 ? `- Diskon: -${formatPrice(b.discount_amount)}${b.referral_code ? ` (Kode: ${b.referral_code.code})` : ''}\n` : ''}- Total Biaya: ${formatPrice(b.total_price - b.discount_amount)}
- DP yang ditransfer: *${formatPrice(b.down_payment)}*
- Sisa Pelunasan: *${formatPrice((b.total_price - b.discount_amount) - b.down_payment)}*

Mohon konfirmasinya ya min. Terima kasih!`;

                    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
                    
                    // Buka WhatsApp di tab baru
                    window.open(waUrl, '_blank');

                    // Kembalikan ke link pricelist awal
                    window.location.href = backToPricelistUrl;
                }
            },
            onFinish: () => {
                console.log('Checkout finished');
            }
        });
    };

    const handleGenerateNewUid = () => {
        const oldUid = localStorage.getItem('afstudio_cart_uid');
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        const newUid = `AF-${randomNumber}`;

        if (carts.length > 0) {
            // Migrate cart items to the new UID first
            router.post('/cart/migrate', {
                old_uid: oldUid,
                new_uid: newUid
            }, {
                onSuccess: () => {
                    localStorage.setItem('afstudio_cart_uid', newUid);
                    setData('cart_uid', newUid);
                    // Refresh and stay on the booking form with the new UID
                    window.location.href = `/checkout?uid=${newUid}`;
                },
                onError: () => {
                    // Fallback: stay on the checkout but the cart might be empty if migration failed
                    localStorage.setItem('afstudio_cart_uid', newUid);
                    setData('cart_uid', newUid);
                    window.location.href = `/checkout?uid=${newUid}`;
                }
            });
        } else {
            // Simply switch to a new UID (clean cart)
            localStorage.setItem('afstudio_cart_uid', newUid);
            setData('cart_uid', newUid);
            window.location.href = `/checkout?uid=${newUid}`;
        }
    };

    const { flash } = usePage().props;
    
    const handleRemoveFromCart = (cartId) => {
        if (!window.confirm('Hapus paket ini dari keranjang?')) return;
        
        router.delete(`/cart/${cartId}`, {
            preserveScroll: true,
            onError: (err) => console.error(err),
            onSuccess: () => {
                console.log('Item removed from cart');
            }
        });
    };

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
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/40 dark:text-brand-white/40 truncate">
                                        <ShieldCheckIcon className="w-4 h-4" /> Session ID
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsConfirmOpen(true)}
                                        className="w-auto px-4 py-2 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border border-brand-red shrink-0"
                                    >
                                        <UserIcon className="w-3.5 h-3.5" /> Ganti UID?
                                    </button>
                                </div>
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
                                        {carts[0]?.package?.allow_split_session && carts[0]?.selected_times ? (
                                            <div className="flex flex-wrap gap-2">
                                                {carts[0].selected_times.map((t, i) => (
                                                    <span key={i} className="bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                                                        {t.substring(0, 5)}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span>{carts[0]?.start_time?.substring(0, 5)} WIB</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Detail Penugasan (Room & Photographer) */}
                            {(carts[0]?.room_name || carts[0]?.room_id) && (
                                <div className="space-y-4 p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-2xl">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-gold/60">Detail Ruangan</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                                <HomeIcon className="w-3 h-3" /> Studio / Ruangan
                                            </label>
                                            <p className="text-sm font-bold text-brand-black dark:text-brand-white">
                                                {carts[0]?.room_name || getRoomLabel(carts[0]?.room_id)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                    <MapPinIcon className="w-4 h-4" /> Alamat lokasi acara <span className="text-red-500">*</span>
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

                            {/* Venue (Gedung Acara) */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    <HomeIcon className="w-4 h-4" /> Gedung acara
                                </label>
                                <input
                                    type="text"
                                    value={data.venue_name}
                                    onChange={e => setData('venue_name', e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                    placeholder="Contoh: Gedung Soetardjo / Ballroom Hotel / Kediaman"
                                />
                                {errors.venue_name && <p className="text-red-500 text-xs font-bold">{errors.venue_name}</p>}
                            </div>

                            {/* Voucher Code */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    <TicketIcon className="w-4 h-4" /> Kode Voucher
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.referral_code}
                                        onChange={handleReferralCodeChange}
                                        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white uppercase"
                                        placeholder="Masukkan kode voucher (opsional)"
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
                                {voucherError && (
                                    <p className="text-xs font-bold text-red-500 dark:text-red-400">
                                        ⚠ {voucherError}
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
                                disabled={processing || !data.proof_file}
                                className={`w-full py-4 font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg ${(processing || !data.proof_file)
                                    ? 'bg-gray-300 dark:bg-white/10 text-black/20 dark:text-white/20 cursor-not-allowed grayscale'
                                    : 'bg-brand-red text-white hover:bg-brand-gold hover:text-brand-black hover:scale-[1.02]'
                                    }`}
                            >
                                {processing ? 'Processing...' : !data.proof_file ? 'Upload Bukti Dulu' : 'Konfirmasi ke Admin via WhatsApp'}
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
                                {carts.length > 0 ? (
                                    carts.map((cart) => (
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
                                                <div className="flex flex-col items-end gap-2 shrink-0">
                                                    <div className="text-xs font-bold text-brand-black dark:text-brand-white">
                                                        {formatPrice(cart.package.price_numeric * cart.quantity)}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFromCart(cart.id)}
                                                        className="p-1.5 text-brand-red hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all active:scale-90"
                                                        title="Hapus dari keranjang"
                                                    >
                                                        <TrashIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Schedule Info Display */}
                                            <div className="bg-brand-gold/10 rounded-lg p-3 border border-brand-gold/20">
                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-brand-black dark:text-brand-white mb-1">
                                                    <CalendarIcon className="w-3.5 h-3.5 text-brand-black/40 dark:text-brand-white/40" />
                                                    <span>{cart.scheduled_date}</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-[10px] font-bold uppercase text-brand-black dark:text-brand-white mb-1">
                                                    <ClockIcon className="w-3.5 h-3.5 text-brand-black/40 dark:text-brand-white/40 mt-0.5" />
                                                    {cart.package?.allow_split_session && cart.selected_times ? (
                                                        <div className="flex flex-col gap-1 w-full">
                                                            <div className="flex items-center justify-between border-b border-brand-gold/10 pb-1 mb-1">
                                                                <span className="text-[9px] opacity-60">RINCIAN JADWAL</span>
                                                                <span className="text-[9px] text-brand-gold">{cart.selected_times.length} SESI</span>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-1">
                                                                {cart.selected_times.sort().map((t, i) => {
                                                                    const [h, m] = t.split(':').map(Number);
                                                                    const totalMin = h * 60 + m + 30;
                                                                    const endT = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
                                                                    return (
                                                                        <div key={i} className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
                                                                            <span>Sesi {i + 1}</span>
                                                                            <span className="text-brand-gold">{t.substring(0, 5).replace(':', '.')}-{endT}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span>{cart.start_time?.substring(0, 5)} - {cart.end_time?.substring(0, 5)}</span>
                                                    )}
                                                </div>
                                                {(cart.room_id || cart.room_name) && (
                                                    <div className="flex flex-col gap-1 border-t border-brand-gold/10 pt-1 mt-1">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-brand-black dark:text-brand-white">
                                                            <MapPinIcon className="w-3.5 h-3.5 text-brand-black/40 dark:text-brand-white/40" />
                                                            <span>Studio: {cart.room_name || getRoomLabel(cart.room_id)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
                                        <ShoppingCartIcon className="w-12 h-12 text-brand-black/10 dark:text-brand-white/10 mx-auto mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-4">Keranjang Kosong</p>
                                        <Link 
                                            href={backToPricelistUrl} 
                                            className="inline-block px-6 py-3 bg-brand-gold text-brand-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-gold/20"
                                        >
                                            Pilih Kategori
                                        </Link>
                                    </div>
                                )}
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

                            {/* Payment Section (Added as per user request) */}
                            <div className="mt-8 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <QrCodeIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                        <h2 className="text-sm font-black uppercase tracking-widest text-brand-black dark:text-brand-white">
                                            Scan QRIS to Pay DP
                                        </h2>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl mb-6 mx-auto w-full flex flex-col items-center justify-center border border-black/10 shadow-inner">
                                        <img src="/images/qris-afstudio.jpeg" alt="QRIS AF Studio" className="w-full h-auto object-contain rounded-lg shadow-sm" />
                                        <a
                                            href="/images/qris-afstudio.jpeg"
                                            download="QRIS-AFSTUDIO.jpeg"
                                            className="flex items-center justify-center gap-2 w-full mt-4 py-3 bg-brand-gold text-brand-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-brand-gold/20"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" /> Download QRIS
                                        </a>
                                    </div>

                                    <div className="p-4 bg-brand-red/5 rounded-2xl border border-brand-red/20 text-center mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-1">Down Payment (Transfer Amount)</p>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative w-full max-w-[240px] mx-auto">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-red font-black text-xl italic italic">Rp</span>
                                                <input
                                                    type="text"
                                                    value={new Intl.NumberFormat('id-ID').format(data.dp_amount || 0)}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                                        setData('dp_amount', val);
                                                    }}
                                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black/20 border-2 border-brand-red/40 focus:border-brand-red rounded-xl text-2xl font-black text-brand-red italic tracking-tighter text-center"
                                                />
                                            </div>
                                            {data.dp_amount < downPayment && (
                                                <p className="text-[10px] font-bold text-brand-red animate-pulse uppercase">
                                                    Min. Pembayaran {formatPrice(downPayment)}
                                                </p>
                                            )}
                                            {data.dp_amount > finalTotal && (
                                                <p className="text-[10px] font-bold text-brand-red animate-pulse uppercase">
                                                    Max. Pembayaran {formatPrice(finalTotal)}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold text-brand-black/40 dark:text-brand-white/40 mt-2 uppercase italic pointer-events-none">
                                            {getDPLabel()}
                                        </p>
                                        <p className="text-[8px] text-brand-black/30 dark:text-brand-white/30 mt-1">
                                            (Tap angka di atas jika ingin membayar lebih)
                                        </p>

                                        {data.dp_amount >= downPayment && data.dp_amount <= finalTotal && (
                                            <div className="mt-4 pt-4 border-t border-brand-red/10">
                                                <p className="text-[10px] font-black uppercase text-brand-black/40 dark:text-brand-white/40 mb-1">Sisa Tagihan (Pelunasan)</p>
                                                <p className="text-sm font-black text-brand-red tracking-tighter">
                                                    {formatPrice(finalTotal - data.dp_amount)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Proof Form Field Integrated */}
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-red">
                                            <DocumentIcon className="w-4 h-4" /> ★ Upload Bukti Pembayaran Terlebih Dahulu (Wajib)
                                        </label>

                                        <label htmlFor="proof_file_field" className="block relative">
                                            <input
                                                type="file"
                                                id="proof_file_field"
                                                className="hidden"
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange}
                                            />
                                            <div className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${data.proof_file
                                                ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                                : 'border-black/10 dark:border-white/10 hover:border-brand-gold'
                                                }`}>
                                                {data.proof_file ? (
                                                    <div className="space-y-2">
                                                        <CheckIcon className="w-8 h-8 text-green-500 mx-auto" />
                                                        <p className="text-xs font-bold text-green-600 truncate">{data.proof_file.name}</p>
                                                        <p className="text-[10px] text-green-600/60 uppercase">Ter-pilih!</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center mx-auto mb-2">
                                                            <DocumentIcon className="w-4 h-4 text-black/40 dark:text-white/40" />
                                                        </div>
                                                        <p className="text-xs font-bold text-black/60 dark:text-white/60">Click / Drag file</p>
                                                        <p className="text-[8px] text-black/40 dark:text-white/40 uppercase">Max 5MB (JPG, PNG, PDF)</p>
                                                    </div>
                                                )}
                                            </div>
                                        </label>

                                        <p className="text-[10px] text-brand-black/40 dark:text-brand-white/40 leading-tight text-center italic">
                                            Upload screenshot/foto bukti transfer anda. Admin akan memverifikasi dalam beberapa menit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    setIsConfirmOpen(false);
                    handleGenerateNewUid();
                }}
                title="Ganti User Baru?"
                message="Anda yakin ingin membuat ID baru? Paket yang sudah dipilih akan otomatis dipindahkan ke identitas baru Anda."
                variant="warning"
                confirmText="Ya, Ganti UID"
            />
        </div>
    );
}
