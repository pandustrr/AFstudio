import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { CheckBadgeIcon, SparklesIcon, FireIcon, ChevronRightIcon, ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import ScheduleModal from '@/Components/Pricelist/ScheduleModal'; // Import Modal

export default function Pricelist({ categories, rooms, locked }) {
    const { props } = usePage();
    const homePage = props?.homePage;
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || null);
    const activeCategory = categories.find(c => c.id === activeCategoryId);

    // Sub-category state
    const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);

    // Modal State
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedPackageForCart, setSelectedPackageForCart] = useState(null);
    const [bookingMode, setBookingMode] = useState('cart'); // 'cart' or 'direct'

    // Handle initial state for locked package
    useEffect(() => {
        if (locked?.type === 'package' && categories[0]?.sub_categories[0]?.packages[0]) {
            const pkg = categories[0].sub_categories[0].packages[0];
            setSelectedPackageForCart(pkg);
            setIsScheduleModalOpen(true);
        }
    }, [locked, categories]);

    const openScheduleModal = (pkg, mode = 'cart') => {
        setSelectedPackageForCart(pkg);
        setBookingMode(mode);
        setIsScheduleModalOpen(true);
    };

    // Fungsi redirect ke halaman checkout
    const handleLanjutBooking = () => {
        window.location.href = '/checkout/create'; // Jika pakai Inertia: Inertia.visit('/checkout/create')
    };

    const formatPrice = (price) => {
        if (!price) return '';
        const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(numericPrice);
    };

    const formatSessionDuration = (maxSessions) => {
        if (!maxSessions) return '';
        // 1 session = 30 menit
        const totalMinutes = maxSessions * 30;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    };

    // Initialize/Reset sub-category when main category changes
    useEffect(() => {
        // Default to 'all' if there are sub-categories, otherwise null
        if (activeCategory?.sub_categories?.length > 0) {
            setActiveSubCategoryId('all');
        } else {
            setActiveSubCategoryId(null);
        }
    }, [activeCategoryId, activeCategory]);

    return (
        <div className="min-h-screen bg-brand-white dark:bg-brand-black transition-colors duration-300">
            <Head title="Price List - AFSTUDIO" />

            <Navbar />

            {/* Schedule Modal */}
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                packageData={selectedPackageForCart}
                rooms={rooms}
                canBook={!!locked}
                mode={bookingMode}
                 onLanjutBooking={handleLanjutBooking}
            />

            {/* Header Section */}
            {!locked && (
                <section className="pt-20 md:pt-28 pb-6 md:pb-10 px-6 text-center bg-linear-to-b from-brand-red/5 via-transparent to-transparent">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 rounded-full mb-3">
                        <SparklesIcon className="w-3 h-3 text-brand-red" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-red">Pricing & Packages</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-3">
                        INVEST IN YOUR <span className="text-brand-gold">MEMORIES.</span>
                    </h1>
                    <p className="max-w-sm mx-auto text-brand-black/60 dark:text-brand-white/60 text-[10px] md:text-[11px] font-bold uppercase tracking-wider leading-relaxed">
                        Profesional fotografi dengan hasil kualitas terbaik untuk setiap momen berharga Anda.
                    </p>
                </section>
            )}

            {locked && (
                <section className="pt-10 pb-6 px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 rounded-full mb-3">
                        <SparklesIcon className="w-3 h-3 text-brand-gold" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-gold">Private Access</span>
                    </div>

                    {/* For package or sub-category share: show Category name at top */}
                    {(locked.type === 'package' || locked.type === 'sub-category') && categories[0] ? (
                        <div className="flex flex-col items-center gap-1">
                            {/* Category Name - Top, Larger Gold Title */}
                            <h2 className="text-3xl md:text-5xl font-black text-brand-gold uppercase tracking-tighter italic leading-tight">
                                {categories[0].name}
                            </h2>

                            {/* Accent gold line */}
                            <div className="w-16 h-1.5 bg-brand-gold mt-8 rounded-full"></div>
                        </div>
                    ) : (
                        /* For other locked types (all or category): show locked.name as title */
                        <h1 className="text-3xl md:text-5xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-3">
                            {locked.name}
                        </h1>
                    )}
                </section>
            )}

            {/* Category Tabs - Show for public (!locked) or when sharing all categories (locked.type === 'all') */}
            {(!locked || locked?.type === 'all') && (
                <section className="px-6 mb-6 top">
                    <div className="max-w-4xl mx-auto overflow-x-auto no-scrollbar scroll-smooth">
                        <div className="inline-flex min-w-full md:flex md:flex-wrap md:justify-center gap-1.5 p-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/5">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategoryId(category.id)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeCategoryId === category.id
                                        ? 'bg-brand-black text-white dark:bg-brand-gold dark:text-brand-black shadow-lg scale-105'
                                        : 'text-brand-black/40 dark:text-brand-white/40 hover:text-brand-black dark:hover:text-brand-white'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sub-Category Tabs - Show for public, single category share, or all categories share */}
            {activeCategory?.sub_categories.length > 0 && (!locked || locked?.type === 'category' || locked?.type === 'all') && (
                <section className="px-6 mb-10 top-sub animate-in fade-in slide-in-from-top-2">
                    <div className="max-w-3xl mx-auto overflow-x-auto no-scrollbar scroll-smooth pb-2">
                        <div className="inline-flex min-w-full md:flex md:flex-wrap md:justify-center gap-2 p-1">
                            {/* ALL button */}
                            <button
                                onClick={() => setActiveSubCategoryId('all')}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all border ${activeSubCategoryId === 'all'
                                    ? 'bg-brand-red text-white border-brand-red shadow-md'
                                    : 'bg-white/30 dark:bg-white/5 text-brand-black/60 dark:text-brand-white/60 border-black/5 dark:border-white/5 hover:bg-white hover:text-brand-black dark:hover:bg-white/10'
                                    }`}
                            >
                                ALL
                            </button>

                            {activeCategory.sub_categories.map((sub) => (
                                <button
                                    key={sub.id}
                                    onClick={() => setActiveSubCategoryId(sub.id)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all border ${activeSubCategoryId === sub.id
                                        ? 'bg-brand-red text-white border-brand-red shadow-md'
                                        : 'bg-white/30 dark:bg-white/5 text-brand-black/60 dark:text-brand-white/60 border-black/5 dark:border-white/5 hover:bg-white hover:text-brand-black dark:hover:bg-white/10'
                                        }`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Content Section */}
            {/* Content Section */}
            <section
                className="
                    pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-[500px] relative
                "
            >

                {/* Overlay for Public View (!locked) */}
                {!locked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-brand-white/50 dark:bg-brand-black/50 backdrop-blur-[2px]">
                        <div
                            className="
                                bg-white/80 dark:bg-black/80 p-8 md:p-12 rounded-[32px]
                                shadow-2xl border border-white/20 dark:border-white/10
                                max-w-lg w-full transform hover:scale-105
                                transition-all duration-500
                            "
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <SparklesIcon className="w-8 h-8 md:w-10 md:h-10 text-brand-gold" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black uppercase text-brand-black dark:text-brand-white mb-4 italic tracking-tighter">
                                Butuh Akses Penuh?
                            </h3>
                            <p className="text-sm font-bold text-brand-black/60 dark:text-brand-white/60 mb-8 leading-relaxed uppercase tracking-wide">
                                Hubungi admin kami melalui WhatsApp untuk berkonsultasi dan mendapatkan detail harga paket lengkap sesuai kebutuhanmu.
                            </p>
                            <a
                                href={`https://wa.me/${homePage?.admin_whatsapp || '6281230487469'}?text=Halo%20Admin%2C%20saya%20ingin%20melihat%20pricelist%20lengkap%20AF%20Studio`}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                <span className="flex-1">Hubungi Admin</span>
                                <ChevronRightIcon className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                )}

                <div className={`${!locked ? 'blur-lg select-none pointer-events-none opacity-50 grayscale-[0.5]' : ''} transition-all duration-500`}>
                    {/* Always use single-category display with tabs for navigation */}
                    {activeCategory?.sub_categories
                        .filter(sub => activeSubCategoryId === 'all' || !activeSubCategoryId ? true : sub.id === activeSubCategoryId)
                        .map((sub, sIdx) => (
                            <div key={sub.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mb-16">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <h2 className="text-xl md:text-3xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic">
                                        {sub.name}
                                    </h2>
                                    <div className="w-10 h-0.5 md:w-12 md:h-1 bg-brand-gold rounded-full"></div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-stretch">
                                    {sub.packages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            className={`relative group overflow-hidden p-5 md:p-7 rounded-[40px] border transition-all duration-500 flex flex-col w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] max-w-sm ${pkg.is_popular
                                                ? 'bg-brand-black text-white border-brand-black shadow-2xl shadow-brand-red/10 ring-4 ring-brand-red/5'
                                                : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 text-brand-black dark:text-brand-white'
                                                } hover:-translate-y-2`}
                                        >
                                            <div className="absolute inset-0 bg-linear-to-r from-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                            {pkg.is_popular && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-lg">
                                                    <FireIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                    Most Popular
                                                </div>
                                            )}

                                            <div className="mb-6 md:mb-8 text-center">
                                                <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-0.5 md:mb-1">{pkg.name}</h3>
                                                <div className="text-2xl md:text-3xl font-black text-brand-gold tracking-tight italic">
                                                    {pkg.price_display ? pkg.price_display : (pkg.price_numeric ? formatPrice(pkg.price_numeric) : '')}
                                                </div>
                                                {pkg.max_sessions && (
                                                    <div className="text-xs md:text-sm font-bold text-brand-black/50 dark:text-brand-white/50 mt-1 uppercase tracking-wide">
                                                        {formatSessionDuration(pkg.max_sessions)} Duration
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 grow">
                                                {(pkg.features || []).map((feature, fIdx) => (
                                                    <div key={fIdx} className="flex items-start gap-2.5">
                                                        <CheckBadgeIcon className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 mt-0.5 ${pkg.is_popular ? 'text-brand-gold' : 'text-brand-red'}`} />
                                                        <span className="text-[10px] md:text-[11px] font-bold opacity-80 leading-tight uppercase tracking-tight">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-2">
                                                {locked && (
                                                    <>
                                                        {/* Icon Keranjang */}
                                                        <button
                                                            onClick={() => openScheduleModal(pkg, 'cart')}
                                                            className={`flex items-center justify-center w-14 md:w-16 py-3.5 md:py-4 rounded-2xl md:rounded-xl transition-all ${pkg.is_popular
                                                                ? 'bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-black border-2 border-brand-gold/30'
                                                                : 'bg-black/5 dark:bg-white/10 text-brand-black dark:text-brand-white hover:bg-brand-gold hover:text-brand-black border-2 border-black/5 dark:border-white/5'
                                                                }`}
                                                        >
                                                            <ShoppingCartIcon className="w-5 h-5" />
                                                        </button>

                                                        {/* Tombol Langsung Beli */}
                                                        <button
                                                            onClick={() => openScheduleModal(pkg, 'direct')}
                                                            className={`flex-1 py-3.5 md:py-4 rounded-2xl md:rounded-xl text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${pkg.is_popular
                                                                ? 'bg-brand-red text-white hover:bg-brand-gold hover:text-brand-black shadow-lg shadow-brand-red/20'
                                                                : 'bg-black/5 dark:bg-white/10 text-brand-black dark:text-brand-white hover:bg-brand-black hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-black shadow-sm'
                                                                }`}
                                                        >
                                                            Langsung Beli
                                                        </button>
                                                    </>
                                                )}
                                                {!locked && (
                                                    <button
                                                        onClick={() => openScheduleModal(pkg)}
                                                        className={`block w-full py-3.5 md:py-4 rounded-2xl md:rounded-xl text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${pkg.is_popular
                                                            ? 'bg-brand-red text-white hover:bg-brand-gold hover:text-brand-black shadow-lg shadow-brand-red/20'
                                                            : 'bg-black/5 dark:bg-white/10 text-brand-black dark:text-brand-white hover:bg-brand-black hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-black shadow-sm'
                                                            }`}
                                                    >
                                                        Lihat Detail
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                    {!locked?.type && activeCategory?.sub_categories.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
                            <p className="text-brand-black/20 dark:text-brand-white/20 font-black uppercase tracking-widest text-[10px]">Informasi paket belum tersedia untuk kategori ini.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            {!locked && (
                <section className="pb-20 md:pb-28 px-4 md:px-6">
                    <div className="max-w-4xl mx-auto rounded-[40px] overflow-hidden relative group">
                        <div className="absolute inset-0 bg-brand-black dark:bg-white/5 transform group-hover:scale-[1.01] transition-transform duration-700"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 rounded-full text-brand-gold text-[9px] font-black uppercase tracking-widest border border-brand-gold/20">
                                    <SparklesIcon className="w-3 h-3" />
                                    <span>Special Request</span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white dark:text-brand-white italic leading-none">
                                    Punya Konsep <br className="hidden md:block" /> <span className="text-brand-gold">Foto Impian?</span>
                                </h2>
                                <p className="text-white/60 dark:text-brand-white/60 text-xs md:text-sm font-bold leading-relaxed max-w-md uppercase tracking-wide">
                                    Kreasikan idemu bersama kami. Dapatkan penawaran eksklusif dan konsultasi gratis untuk mewujudkan momen terbaikmu.
                                </p>
                            </div>

                            <a
                                href={`https://wa.me/${homePage?.admin_whatsapp || '6281230487469'}?text=Halo%20Admin%2C%20saya%20ingin%20konsultasi%20paket%20custom`}
                                className="shrink-0 inline-flex items-center gap-3 px-8 py-5 bg-brand-gold text-brand-black rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-gold/10"
                            >
                                <span>Konsultasi Sekarang</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
