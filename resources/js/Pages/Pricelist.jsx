import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { CheckBadgeIcon, SparklesIcon, FireIcon, ChevronRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

import ScheduleModal from '@/Components/Pricelist/ScheduleModal'; // Import Modal

export default function Pricelist({ categories }) {
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || null);
    const activeCategory = categories.find(c => c.id === activeCategoryId);

    // Sub-category state
    const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);

    // Modal State
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedPackageForCart, setSelectedPackageForCart] = useState(null);

    const openScheduleModal = (pkg) => {
        setSelectedPackageForCart(pkg);
        setIsScheduleModalOpen(true);
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
            />

            {/* Header Section */}
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

            {/* Category Tabs */}
            <section className="px-6 mb-6 sticky top-[4.5rem] md:top-20 z-10">
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

            {/* Sub-Category Tabs (New) */}
            {activeCategory?.sub_categories.length > 0 && (
                <section className="px-6 mb-10 sticky top-[8.5rem] md:top-32 z-10 animate-in fade-in slide-in-from-top-2">
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
            <section className="pb-20 px-4 md:px-6 max-w-7xl mx-auto space-y-16 md:space-y-24">
                {activeCategory?.sub_categories
                    .filter(sub => activeSubCategoryId === 'all' ? true : sub.id === activeSubCategoryId)
                    .map((sub, sIdx) => (
                        <div key={sub.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Only show Title if NOT filtering (or if desired) - currently redundant if we have tabs, but ok to keep for context */}
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
                                        className={`relative group p-5 md:p-7 rounded-[2.5rem] md:rounded-3xl border transition-all duration-500 flex flex-col w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] max-w-sm ${pkg.is_popular
                                            ? 'bg-brand-black text-white border-brand-black shadow-2xl shadow-brand-red/10 ring-4 ring-brand-red/5'
                                            : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 text-brand-black dark:text-brand-white'
                                            } hover:-translate-y-2`}
                                    >
                                        {/* Popular Badge */}
                                        {pkg.is_popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-lg">
                                                <FireIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                Most Popular
                                            </div>
                                        )}

                                        <div className="mb-6 md:mb-8">
                                            <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-0.5 md:mb-1">{pkg.name}</h3>
                                            <div className="text-2xl md:text-3xl font-black text-brand-gold tracking-tight italic">
                                                {pkg.price_display}
                                            </div>
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
                                            <button
                                                onClick={() => openScheduleModal(pkg)}
                                                className={`p-3.5 md:p-4 rounded-2xl md:rounded-xl flex items-center justify-center transition-all ${pkg.is_popular
                                                    ? 'bg-brand-red text-white hover:bg-brand-gold hover:text-brand-black shadow-lg shadow-brand-red/20'
                                                    : 'bg-black/5 dark:bg-white/10 text-brand-black dark:text-brand-white hover:bg-brand-black hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-black shadow-sm'
                                                    }`}
                                                title="Add to Cart"
                                            >
                                                <ShoppingCartIcon className="w-5 h-5" />
                                            </button>
                                            <a
                                                href={`https://wa.me/6281230487469?text=Halo AF Studio! Saya tertarik dengan paket ${pkg.name} (${sub.name} - ${activeCategory.name}).`}
                                                target="_blank"
                                                className={`block w-full py-3.5 md:py-4 rounded-2xl md:rounded-xl text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${pkg.is_popular
                                                    ? 'bg-brand-red text-white hover:bg-brand-gold hover:text-brand-black shadow-lg shadow-brand-red/20'
                                                    : 'bg-black/5 dark:bg-white/10 text-brand-black dark:text-brand-white hover:bg-brand-black hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-black shadow-sm'
                                                    }`}
                                            >
                                                Pilih Paket
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                {activeCategory?.sub_categories.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
                        <p className="text-brand-black/20 dark:text-brand-white/20 font-black uppercase tracking-widest text-[10px]">Informasi paket belum tersedia untuk kategori ini.</p>
                    </div>
                )}
            </section>

            {/* Bottom CTA */}
            <section className="pb-20 md:pb-28 px-4 md:px-6">
                <div className="max-w-3xl mx-auto rounded-[2rem] md:rounded-[32px] overflow-hidden relative group">
                    <div className="absolute inset-0 bg-brand-gold transform group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative p-8 md:p-12 text-center text-brand-black flex flex-col items-center">
                        <FireIcon className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 opacity-20" />
                        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic mb-3 leading-none">
                            TIDAK MENEMUKAN <br className="hidden md:block" />YANG COCOK?
                        </h2>
                        <p className="max-w-xs mx-auto text-[10px] md:text-xs font-bold mb-6 opacity-70 uppercase tracking-tight">
                            Kami menyediakan solusi custom untuk setiap kebutuhan unik Anda. Konsultasikan konsep foto impian Anda bersama kami secara gratis.
                        </p>
                        <a
                            href="https://wa.me/6281230487469"
                            className="inline-flex items-center gap-2 px-6 py-3.5 md:px-8 md:py-4 bg-black text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                        >
                            Hubungi via WhatsApp
                            <ChevronRightIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
