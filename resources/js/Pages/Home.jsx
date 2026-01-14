import React from 'react';
import GuestLayout from '../Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Home() {
    return (
        <GuestLayout>
            <Head title="Premium Photography" />

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 transition-colors">
                {/* Background Patterns */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-white dark:bg-brand-black/60"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <h2 className="text-brand-gold font-bold uppercase tracking-[0.2em] mb-4 text-[10px] sm:text-xs animate-fade-in">
                        AFstudio Professional Photography
                    </h2>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-black dark:text-brand-white mb-6 sm:mb-8 tracking-tighter uppercase leading-[0.95]">
                        Capture <span className="text-brand-red">Your</span> <br className="hidden sm:block" />
                        <span className="italic font-serif normal-case font-light text-brand-gold">Perfect</span> Story
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/selector-photo"
                            className="bg-brand-red hover:bg-red-800 text-brand-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-widest text-[9px] sm:text-[10px] transition-all duration-300 hover:scale-105 shadow-xl shadow-brand-red/20"
                        >
                            Pilih Foto Anda
                        </Link>
                        <Link
                            href="/price-list"
                            className="text-brand-black dark:text-brand-white hover:text-brand-gold px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-widest text-[9px] sm:text-[10px] transition-all duration-300 border border-black/10 dark:border-white/10 hover:border-brand-gold"
                        >
                            Lihat Paket
                        </Link>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute bottom-10 left-10 hidden lg:block animate-bounce opacity-20">
                    <div className="w-0.5 h-16 bg-linear-to-b from-brand-gold to-transparent"></div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 sm:py-24 px-6 transition-colors font-sans">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-16 gap-6">
                        <div className="max-w-md">
                            <span className="text-brand-red text-[10px] font-bold uppercase tracking-widest block mb-3">Layanan Kami</span>
                            <h2 className="text-2xl sm:text-4xl font-black text-brand-black dark:text-brand-white uppercase leading-tight">
                                Dedikasi <span className="italic font-serif text-brand-gold normal-case font-light">untuk</span> <br />
                                Seni Visual Premium
                            </h2>
                        </div>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-xs sm:text-sm max-w-[280px] mb-2 font-medium">
                            Kami mengubah momen-momen berharga menjadi karya seni abadi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { title: 'Wedding', desc: 'Momen sakral penuh cinta.', image: 'https://picsum.photos/seed/wedding/800/1000' },
                            { title: 'Portrait', desc: 'Menonjolkan karakter unik Anda.', image: 'https://picsum.photos/seed/portrait/800/1000' },
                            { title: 'Commercial', desc: 'Visual profesional untuk bisnis.', image: 'https://picsum.photos/seed/commercial/800/1000' },
                        ].map((cat, i) => (
                            <div key={i} className="group relative aspect-3/4 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 transition-all">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 opacity-60 dark:opacity-40 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-white/90 dark:from-brand-black via-transparent to-transparent p-6 sm:p-8 flex flex-col justify-end">
                                    <h3 className="text-xl sm:text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-1 group-hover:text-brand-gold transition-colors">{cat.title}</h3>
                                    <p className="text-[10px] sm:text-xs font-bold text-brand-black/60 dark:text-brand-white/60 uppercase tracking-wide">{cat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-16 sm:py-24 bg-black/2 dark:bg-white/2 border-y border-black/5 dark:border-white/5 px-6 transition-colors">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white uppercase mb-6 leading-tight">
                        Siap Memulai <br className="sm:block hidden" />
                        <span className="text-brand-gold italic font-serif normal-case font-light underline decoration-brand-red/30 underline-offset-4">Cerita</span> Anda?
                    </h2>
                    <p className="text-brand-black/50 dark:text-brand-white/50 text-sm sm:text-base mb-10 max-w-xl mx-auto font-bold uppercase tracking-wide">
                        Konsultasikan kebutuhan fotografi Anda dengan tim ahli kami.
                    </p>
                    <Link
                        href="/selector-photo"
                        className="inline-block bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black hover:bg-brand-gold hover:text-brand-black px-10 sm:px-12 py-3.5 sm:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-500 shadow-lg"
                    >
                        Pilih Koleksi Foto
                    </Link>
                </div>
            </section>
        </GuestLayout>
    );
}
