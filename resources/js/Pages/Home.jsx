import React from 'react';
import GuestLayout from '../Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Home() {
    return (
        <GuestLayout>
            <Head title="Premium Photography" />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Patterns */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-brand-black/60"></div>
                    <div className="absolute inset-0 bg-linear-to-b from-brand-black via-transparent to-brand-black"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl">
                    <h2 className="text-brand-gold font-medium uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-4 text-xs sm:text-sm animate-fade-in">
                        AFstudio Professional Photography
                    </h2>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-brand-white mb-6 sm:mb-8 tracking-tighter uppercase leading-[0.9]">
                        Capture <span className="text-brand-red">Your</span> <br className="hidden sm:block" />
                        <span className="italic font-serif normal-case font-light text-brand-gold">Perfect</span> Story
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link
                            href="/selector-photo"
                            className="bg-brand-red hover:bg-red-800 text-brand-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-300 hover:scale-105 shadow-2xl shadow-brand-red/20"
                        >
                            Pilih Foto Anda
                        </Link>
                        <Link
                            href="/price-list"
                            className="text-brand-white hover:text-brand-gold px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-300 border border-white/20 hover:border-brand-gold"
                        >
                            Lihat Paket
                        </Link>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute bottom-10 left-10 hidden lg:block animate-bounce opacity-20">
                    <div className="w-0.5 h-20 bg-linear-to-b from-brand-gold to-transparent"></div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 sm:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-20 gap-6">
                        <div className="max-w-xl">
                            <span className="text-brand-red text-xs font-bold uppercase tracking-widest block mb-4">Layanan Kami</span>
                            <h2 className="text-3xl sm:text-5xl font-black text-brand-white uppercase leading-tight">
                                Dedikasi <span className="italic font-serif text-brand-gold normal-case font-light">untuk</span> <br />
                                Seni Visual Premium
                            </h2>
                        </div>
                        <p className="text-brand-white/40 text-sm sm:text-base max-w-sm mb-2">
                            Kami mengubah momen-momen berharga menjadi karya seni abadi yang akan dikenang selamanya.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                        {[
                            { title: 'Wedding', desc: 'Momen sakral penuh cinta.', image: 'https://picsum.photos/seed/wedding/800/1000' },
                            { title: 'Portrait', desc: 'Menonjolkan karakter unik Anda.', image: 'https://picsum.photos/seed/portrait/800/1000' },
                            { title: 'Commercial', desc: 'Visual profesional untuk bisnis.', image: 'https://picsum.photos/seed/commercial/800/1000' },
                        ].map((cat, i) => (
                            <div key={i} className="group relative aspect-4/5 overflow-hidden rounded-2xl bg-white/5 border border-white/5">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/20 to-transparent p-6 sm:p-10 flex flex-col justify-end">
                                    <h3 className="text-2xl sm:text-3xl font-black text-brand-white uppercase mb-2 group-hover:text-brand-gold transition-colors">{cat.title}</h3>
                                    <p className="text-brand-white/60 text-xs sm:text-sm font-medium">{cat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-20 sm:py-32 bg-white/[0.02] border-y border-white/5 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-10">
                        <svg className="w-8 h-8 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-brand-white uppercase mb-8 leading-tight">
                        Siap Memulai <br className="sm:block hidden" />
                        <span className="text-brand-gold italic font-serif normal-case font-light underline decoration-brand-red underline-offset-8">Cerita</span> Anda?
                    </h2>
                    <p className="text-brand-white/50 text-base sm:text-lg mb-12 max-w-2xl mx-auto font-medium">
                        Konsultasikan kebutuhan fotografi Anda dengan tim ahli kami dan dapatkan hasil yang melampaui ekspektasi.
                    </p>
                    <Link
                        href="/selector-photo"
                        className="inline-block bg-brand-white text-brand-black hover:bg-brand-gold hover:text-brand-black px-10 sm:px-16 py-4 sm:py-5 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm transition-all duration-500 shadow-xl"
                    >
                        Pilih Koleksi Foto
                    </Link>
                </div>
            </section>
        </GuestLayout>
    );
}
