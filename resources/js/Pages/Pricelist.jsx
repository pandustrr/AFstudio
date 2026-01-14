import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { CheckBadgeIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/outline';

export default function Pricelist({ pricelists }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-brand-white dark:bg-brand-black transition-colors duration-300">
            <Head title="Price List - AFSTUDIO" />
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-12 px-6 text-center bg-linear-to-b from-brand-red/5 via-transparent to-transparent">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-red/10 rounded-full mb-3">
                    <SparklesIcon className="w-3 h-3 text-brand-red" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-red">Pricing & Packages</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic mb-3">
                    CHOOSE YOUR <span className="text-brand-gold">PACKAGE.</span>
                </h1>
                <p className="max-w-md mx-auto text-brand-black/60 dark:text-brand-white/60 text-xs md:text-sm font-medium">
                    Semua paket dikerjakan secara profesional dengan hasil kualitas terbaik.
                </p>
            </section>

            {/* Pricing Grid */}
            <section className="pb-16 px-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                    {pricelists.length > 0 ? (
                        pricelists.map((item) => (
                            <div
                                key={item.id}
                                className={`relative group p-6 md:p-8 h-full rounded-2xl border transition-all duration-500 overflow-hidden flex flex-col ${item.is_popular
                                    ? 'bg-brand-black text-white border-brand-black shadow-lg shadow-brand-red/5 scale-[1.02] z-10'
                                    : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 text-brand-black dark:text-brand-white'
                                    } hover:scale-[1.03]`}
                            >
                                {/* Glow Effect for Premium */}
                                {item.is_popular && (
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-red/20 blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                )}

                                {/* Popular Badge */}
                                {item.is_popular && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-gold text-brand-black rounded-full text-[8px] font-black uppercase tracking-widest mb-5 w-fit">
                                        <FireIcon className="w-2.5 h-2.5" />
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-lg font-black uppercase tracking-tighter mb-2">{item.name}</h3>
                                <div className="mb-4">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-black text-brand-gold">{formatCurrency(item.price)}</span>
                                    </div>
                                    {item.discount_price && (
                                        <span className={`text-[10px] font-bold line-through decoration-brand-red opacity-40`}>
                                            {formatCurrency(item.discount_price)}
                                        </span>
                                    )}
                                </div>

                                <p className={`text-[10px] font-medium leading-relaxed mb-5 min-h-[32px] ${item.is_popular ? 'opacity-70' : 'opacity-50'}`}>
                                    {item.description || 'Pilihan terbaik untuk kebutuhan fotografi standar.'}
                                </p>

                                <div className="space-y-2.5 mb-6 grow">
                                    {(item.features || []).map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <CheckBadgeIcon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${item.is_popular ? 'text-brand-gold' : 'text-brand-red'}`} />
                                            <span className="text-[11px] font-bold opacity-80">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href={`https://wa.me/+6281234567890?text=Halo AF Studio! Saya tertarik dengan paket ${item.name}.`}
                                    target="_blank"
                                    className={`block w-full py-3.5 rounded-lg text-center text-[9px] font-black uppercase tracking-[0.15em] transition-all outline-none ${item.is_popular
                                        ? 'bg-brand-red text-white hover:bg-brand-gold hover:text-brand-black'
                                        : 'bg-black/5 dark:bg-white/10 text-brand-black dark:text-brand-white hover:bg-brand-black hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-black'
                                        }`}
                                >
                                    Booking Now
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <p className="text-brand-black/40 uppercase font-black tracking-widest text-[9px]">Belum ada paket tersedia.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="pb-20 px-6">
                <div className="max-w-2xl mx-auto bg-brand-gold p-8 md:p-12 rounded-3xl text-center text-brand-black relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic mb-3">NEED A CUSTOM <br />PACKAGE?</h2>
                        <p className="max-w-xs mx-auto text-sm font-bold mb-5 opacity-80">
                            Punya kebutuhan khusus di luar paket yang tersedia?
                        </p>
                        <a
                            href="https://wa.me/+6281234567890"
                            className="inline-block px-6 py-3.5 bg-brand-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                        >
                            Consult With Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
