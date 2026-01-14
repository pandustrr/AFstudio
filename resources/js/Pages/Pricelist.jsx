import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { CheckBadgeIcon, SparklesIcon, FireIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pricelist({ categories }) {
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || null);

    const activeCategory = categories.find(c => c.id === activeCategoryId);

    return (
        <div className="min-h-screen bg-brand-white dark:bg-brand-black transition-colors duration-300">
            <Head title="Price List - AFSTUDIO" />
            <Navbar />

            {/* Header Section */}
            <section className="pt-32 pb-12 px-6 text-center bg-linear-to-b from-brand-red/5 via-transparent to-transparent">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 rounded-full mb-4">
                    <SparklesIcon className="w-3.5 h-3.5 text-brand-red" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-red">Pricing & Packages</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-4">
                    INVEST IN YOUR <span className="text-brand-gold">MEMORIES.</span>
                </h1>
                <p className="max-w-md mx-auto text-brand-black/60 dark:text-brand-white/60 text-xs md:text-sm font-bold uppercase tracking-wider">
                    Profesional fotografi dengan hasil kualitas terbaik untuk setiap momen berharga Anda.
                </p>
            </section>

            {/* Category Tabs */}
            <section className="px-6 mb-16">
                <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto p-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategoryId(category.id)}
                            className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategoryId === category.id
                                ? 'bg-brand-black text-white dark:bg-brand-gold dark:text-brand-black shadow-xl scale-105'
                                : 'text-brand-black/40 dark:text-brand-white/40 hover:text-brand-black dark:hover:text-brand-white'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Content Section */}
            <section className="pb-24 px-6 max-w-7xl mx-auto space-y-24">
                {activeCategory?.sub_categories.map((sub, sIdx) => (
                    <div key={sub.id} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${sIdx * 100}ms` }}>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <h2 className="text-2xl md:text-3xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic">
                                {sub.name}
                            </h2>
                            <div className="w-12 h-1 bg-brand-gold rounded-full"></div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 items-stretch">
                            {sub.packages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className={`relative group p-8 rounded-3xl border transition-all duration-500 flex flex-col w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] max-w-sm ${pkg.is_popular
                                        ? 'bg-brand-black text-white border-brand-black shadow-2xl shadow-brand-red/10 ring-4 ring-brand-red/5'
                                        : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 text-brand-black dark:text-brand-white'
                                        } hover:-translate-y-2`}
                                >
                                    {/* Popular Badge */}
                                    {pkg.is_popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-brand-red text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                                            <FireIcon className="w-3 h-3" />
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{pkg.name}</h3>
                                        <div className="text-3xl font-black text-brand-gold tracking-tight italic">
                                            {pkg.price_display}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10 grow">
                                        {(pkg.features || []).map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-start gap-3">
                                                <CheckBadgeIcon className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.is_popular ? 'text-brand-gold' : 'text-brand-red'}`} />
                                                <span className="text-xs font-bold opacity-80 leading-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <a
                                        href={`https://wa.me/+6281234567890?text=Halo AF Studio! Saya tertarik dengan paket ${pkg.name} (${sub.name} - ${activeCategory.name}).`}
                                        target="_blank"
                                        className={`block w-full py-4 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all ${pkg.is_popular
                                            ? 'bg-brand-red text-white hover:bg-brand-gold hover:text-brand-black shadow-lg shadow-brand-red/20'
                                            : 'bg-black/5 dark:bg-white/10 text-brand-black dark:text-brand-white hover:bg-brand-black hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-black shadow-sm'
                                            }`}
                                    >
                                        Pilih Paket
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {activeCategory?.sub_categories.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
                        <p className="text-brand-black/20 dark:text-brand-white/20 font-black uppercase tracking-widest text-xs">Informasi paket belum tersedia untuk kategori ini.</p>
                    </div>
                )}
            </section>

            {/* Bottom CTA */}
            <section className="pb-32 px-6">
                <div className="max-w-4xl mx-auto rounded-[40px] overflow-hidden relative group">
                    <div className="absolute inset-0 bg-brand-gold transform group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative p-12 md:p-16 text-center text-brand-black flex flex-col items-center">
                        <FireIcon className="w-12 h-12 mb-6 opacity-20" />
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-4 leading-none">
                            TIDAK MENEMUKAN <br />YANG COCOK?
                        </h2>
                        <p className="max-w-md mx-auto text-sm md:text-base font-bold mb-8 opacity-70">
                            Kami menyediakan solusi custom untuk setiap kebutuhan unik Anda. Konsultasikan konsep foto impian Anda bersama kami secara gratis.
                        </p>
                        <a
                            href="https://wa.me/+6281234567890"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                        >
                            Hubungi via WhatsApp
                            <ChevronRightIcon className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
