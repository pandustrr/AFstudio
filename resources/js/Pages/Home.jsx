import React from 'react';
import GuestLayout from '../Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import {
    SparklesIcon,
    ArrowRightIcon,
    PlayIcon,
    CameraIcon,
    UserGroupIcon,
    StarIcon,
    CursorArrowRaysIcon,
    HeartIcon,
    TrophyIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

export default function Home({ categories = [] }) {
    return (
        <GuestLayout>
            <Head title="Premium Photography & Art Studio" />

            {/* Artistic Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-9999 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-16 transition-all duration-700">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-brand-white dark:bg-brand-black transition-colors duration-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-brand-red/5 via-transparent to-brand-gold/5 blur-[120px] animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden translate-y-10">
                        <span className="text-[20vw] lg:text-[12vw] font-black text-brand-black/2 dark:text-brand-white/2 leading-none uppercase tracking-tighter">
                            AFSTUDIO
                        </span>
                    </div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl w-full">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-black/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 mb-6 lg:mb-8 animate-fade-in group hover:border-brand-gold/30 transition-all cursor-default shadow-sm">
                        <SparklesIcon className="w-3.5 h-3.5 text-brand-gold animate-soft-pulse" />
                        <span className="text-[8px] lg:text-[9px] font-black text-brand-black/60 dark:text-brand-white/60 uppercase tracking-[0.3em]">Mengabadikan Warisan Visual</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[100px] font-black text-brand-black dark:text-brand-white mb-6 lg:mb-8 tracking-[-0.05em] uppercase leading-[0.9] animate-fade-in-up">
                        MELAMPAUI <span className="text-brand-red">MOMEN.</span> <br />
                        <span className="italic font-light text-brand-gold lowercase tracking-tight font-serif">keanggunan</span> ARTISTIK
                    </h1>

                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] sm:text-xs lg:text-base max-w-2xl mx-auto mb-10 lg:mb-12 font-bold uppercase tracking-[0.2em] leading-relaxed animate-fade-in delay-200">
                        Mari abadikan setiap penggalan cerita Anda dengan sentuhan estetik yang tidak lekang oleh waktu. <br className="hidden md:block" />
                        Ruang di mana setiap bayangan dan cahaya berkolaborasi untuk Anda.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 animate-fade-in delay-300">
                        <Link
                            href="/price-list"
                            className="group relative px-8 lg:px-10 py-4 lg:py-5 bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 w-full sm:w-auto text-center"
                        >
                            <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10 font-black uppercase tracking-[0.2em] text-[9px] lg:text-xs flex items-center justify-center gap-3 group-hover:text-brand-black transition-colors">
                                Mulai Cerita Anda <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>

                        <Link
                            href="/about"
                            className="group flex items-center justify-center gap-4 px-6 lg:px-8 py-3 lg:py-4 text-brand-black dark:text-brand-white transition-colors w-full sm:w-auto"
                        >
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-brand-gold transition-all duration-500">
                                <span className="font-serif italic text-base lg:text-lg text-brand-gold group-hover:scale-110 transition-transform">i</span>
                            </div>
                            <span className="font-black uppercase tracking-[0.2em] text-[8px] lg:text-[10px] group-hover:text-brand-gold transition-colors underline decoration-brand-gold/30 underline-offset-8">Mengenal Kami</span>
                        </Link>
                    </div>
                </div>

                {/* Floating Navigation/Status */}
                <div className="absolute bottom-8 lg:bottom-12 inset-x-0 px-6 lg:px-10 flex justify-between items-end select-none">
                    <div className="hidden lg:flex items-center gap-8 -rotate-90 origin-left translate-y-[-50%] opacity-20 dark:opacity-40 whitespace-nowrap">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-brand-black dark:text-brand-white">EST 2019 — COLREG 2024</span>
                        <div className="h-px w-16 bg-brand-gold"></div>
                    </div>

                    <div className="flex flex-col items-center gap-3 group cursor-pointer mb-2" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                        <div className="w-px h-12 lg:h-16 bg-linear-to-b from-brand-gold to-transparent relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-red animate-scroll-line"></div>
                        </div>
                        <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-[0.3em] text-brand-gold group-hover:translate-y-1 transition-transform">Eksplorasi</span>
                    </div>

                    <div className="hidden lg:flex flex-col gap-4 text-brand-black dark:text-brand-white opacity-20 dark:opacity-40">
                        <div className="text-[9px] font-black text-right tracking-[0.2em] hover:opacity-100 transition-opacity cursor-default">
                            AFSTUDIO STUDIO <br />
                            JEMBER — JAWA TIMUR
                        </div>
                    </div>
                </div>
            </section>

            {/* Scrolling Banner */}
            <div className="py-6 bg-brand-black dark:bg-white/5 overflow-hidden border-y border-white/5 relative z-20">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-12 px-6">
                            <span className="text-white/20 dark:text-white/10 text-2xl lg:text-4xl font-black uppercase tracking-[0.3em] italic">Visi Artistik</span>
                            <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                            <span className="text-white/20 dark:text-white/10 text-2xl lg:text-4xl font-black uppercase tracking-[0.3em] italic">Jiwa Sinematik</span>
                            <div className="w-2 h-2 bg-brand-red rounded-full"></div>
                            <span className="text-white/20 dark:text-white/10 text-2xl lg:text-4xl font-black uppercase tracking-[0.3em] italic">Bingkai Abadi</span>
                            <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Impact Section */}
            <section className="py-24 lg:py-32 bg-brand-white dark:bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {[
                            { label: 'Momen Diabadikan', val: '2.5K+', icon: CameraIcon },
                            { label: 'Klien Bahagia', val: '1.2K+', icon: UserGroupIcon },
                            { label: 'Tahun Berkarya', val: '05+', icon: SparklesIcon },
                            { label: 'Penghargaan', val: '12+', icon: TrophyIcon },
                        ].map((stat, i) => (
                            <div key={i} className="group p-8 rounded-4xl bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 hover:border-brand-gold/30 transition-all duration-700">
                                <stat.icon className="w-6 h-6 text-brand-red mb-6 group-hover:scale-110 transition-transform" />
                                <div className="text-3xl lg:text-5xl font-black text-brand-black dark:text-brand-white mb-2 tracking-tighter italic">{stat.val}</div>
                                <div className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-brand-black/40 dark:text-brand-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Showcase - Dynamic Categories from DB */}
            <section className="py-20 lg:py-32 px-6 bg-brand-white dark:bg-brand-black relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-end mb-16 lg:mb-24">
                        <div className="lg:col-span-8 space-y-4 lg:space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px w-10 lg:w-12 bg-brand-red"></div>
                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-brand-red">Layanan Pilihan</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-none italic transition-colors">
                                LAYANAN YANG <br /> <span className="text-brand-gold underline decoration-brand-red/10 underline-offset-12">MENGINSPIRASI.</span>
                            </h2>
                        </div>
                        <div className="lg:col-span-4 pb-0 lg:pb-4 border-l-2 lg:border-l border-brand-gold/30 pl-6 lg:pl-8">
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs lg:text-sm font-bold uppercase tracking-widest leading-relaxed transition-colors">
                                Setiap momen memiliki jiwanya sendiri. Kami hadir untuk menangkap esensi terdalam melalui lensa profesional kami.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {categories.length > 0 ? (
                            categories.map((cat, i) => (
                                <Link key={cat.id} href="/price-list" className="group block relative aspect-4/5 rounded-4xl overflow-hidden bg-black/5 dark:bg-white/5 shadow-xl transition-all duration-1000">
                                    <img
                                        src={cat.background_image || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80"}
                                        alt={cat.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-brand-black/90 via-transparent to-transparent p-8 lg:p-10 flex flex-col justify-end">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                            <SparklesIcon className="w-6 h-6 lg:w-8 lg:h-8 text-brand-gold mb-3 lg:mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
                                            <h3 className="text-xl lg:text-2xl font-black text-brand-white uppercase mb-1.5 group-hover:text-brand-gold transition-colors tracking-tight">{cat.name}</h3>
                                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Lihat Paket</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-6 lg:top-8 right-6 lg:right-8 w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-[-10px] transition-all duration-700">
                                        <ArrowRightIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-brand-gold" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            // Fallback if no categories in DB
                            [
                                { title: 'The Wedding', slug: 'momen-sakral', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80' },
                                { title: 'Personal Brand', slug: 'karakter-unik', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80' },
                                { title: 'Artistic Space', slug: 'visual-bisnis', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80' },
                            ].map((serv, i) => (
                                <Link key={i} href="/price-list" className="group block relative aspect-4/5 rounded-4xl overflow-hidden bg-black/5 dark:bg-white/5 shadow-xl transition-all duration-1000">
                                    <img src={serv.img} alt={serv.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-80 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-linear-to-t from-brand-black/90 via-transparent to-transparent p-8 lg:p-10 flex flex-col justify-end">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                            <SparklesIcon className="w-6 h-6 lg:w-8 lg:h-8 text-brand-gold mb-3 lg:mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
                                            <h3 className="text-xl lg:text-2xl font-black text-brand-white uppercase mb-1.5 group-hover:text-brand-gold transition-colors tracking-tight">{serv.title}</h3>
                                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">{serv.slug}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Recent Masterpieces */}
            <section className="py-24 bg-brand-white dark:bg-brand-black overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 mb-16 flex justify-between items-end">
                    <div className="space-y-4">
                        <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.5em] block">Arsip Digital</span>
                        <h2 className="text-4xl lg:text-6xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic">KARYA <span className="text-brand-gold">TERBARU.</span></h2>
                    </div>
                    <Link href="/selector-photo" className="hidden md:flex items-center gap-3 text-[10px] font-black text-brand-black dark:text-brand-white uppercase tracking-widest hover:text-brand-gold transition-colors">
                        Lihat Semua Karya <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex gap-6 animate-marquee-slow hover:pause cursor-pointer pb-10">
                    {[
                        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80',
                    ].map((img, i) => (
                        <div key={i} className="min-w-[300px] md:min-w-[450px] aspect-3/4 rounded-4xl overflow-hidden relative group shadow-2xl">
                            <img src={img} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" alt="Work Preview" />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="text-brand-gold text-[9px] font-black uppercase tracking-[0.4em] mb-2 block">Sesi Premium</span>
                                <h4 className="text-white text-xl font-black uppercase tracking-tight">Arsip Studio Vol. {i + 1}</h4>
                            </div>
                        </div>
                    ))}
                    {[
                        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
                    ].map((img, i) => (
                        <div key={`dup-${i}`} className="min-w-[300px] md:min-w-[450px] aspect-3/4 rounded-4xl overflow-hidden relative group shadow-2xl">
                            <img src={img} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" alt="Work Preview duplicate" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choice Section */}
            <section className="py-24 lg:py-40 bg-brand-white dark:bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute -inset-4 bg-brand-gold/10 blur-[60px] rounded-full animate-pulse"></div>
                            <div className="relative grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="aspect-square rounded-4xl overflow-hidden shadow-2xl text-0 leading-none">
                                        <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Detail Art 1" />
                                    </div>
                                    <div className="aspect-4/5 rounded-4xl overflow-hidden shadow-2xl text-0 leading-none">
                                        <img src="https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Detail Art 2" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="aspect-4/5 rounded-4xl overflow-hidden shadow-2xl text-0 leading-none">
                                        <img src="https://images.unsplash.com/photo-1452508334461-17aa3a7279fb?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Detail Art 3" />
                                    </div>
                                    <div className="aspect-square rounded-4xl overflow-hidden shadow-2xl text-0 leading-none">
                                        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Detail Art 4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-10 lg:pl-12 order-1 lg:order-2">
                            <div className="space-y-6">
                                <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.5em] block">Mengapa AFSTUDIO</span>
                                <h2 className="text-4xl lg:text-7xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-[0.9] italic">
                                    MELAMPAUI <br /><span className="text-brand-gold">YANG BIASA.</span>
                                </h2>
                                <p className="text-brand-black/50 dark:text-brand-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-md">
                                    Kami percaya setiap frame harus menceritakan sesuatu yang abadi. Bukan sekadar foto, tapi sebuah warisan visual.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { title: 'Pencahayaan Utama', desc: 'Penguasaan cahaya untuk dramatisasi maksimal.', icon: SparklesIcon },
                                    { title: 'Retouch Canggih', desc: 'Editing premium yang natural namun tajam.', icon: CursorArrowRaysIcon },
                                    { title: 'Resonansi Emosional', desc: 'Menangkap perasaan, bukan hanya sekadar pose.', icon: HeartIcon },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-12 h-12 shrink-0 bg-brand-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-brand-gold transition-all duration-500">
                                            <item.icon className="w-5 h-5 text-brand-black dark:text-brand-white group-hover:text-brand-black transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-widest mb-1">{item.title}</h4>
                                            <p className="text-[10px] font-black text-brand-black/30 dark:text-brand-white/30 uppercase tracking-widest">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="py-24 lg:py-40 bg-brand-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 lg:mb-32">
                        <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Alur Proses</span>
                        <h2 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter italic">PERJALANAN <span className="text-brand-gold">SENI.</span></h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24 relative">
                        <div className="hidden lg:block absolute top-[60px] left-0 w-full h-px bg-white/10"></div>
                        {[
                            { step: '01', title: 'Konsultasi', desc: 'Mendiskusikan visi, gaya, dan esensi yang ingin Anda abadikan.', icon: ChatBubbleBottomCenterTextIcon },
                            { step: '02', title: 'Produksi', desc: 'Sesi profesional dengan arahan artistik penuh.', icon: CameraIcon },
                            { step: '03', title: 'Mahakarya', desc: 'Proses editing premium untuk hasil akhir yang abadi.', icon: StarIcon },
                        ].map((item, i) => (
                            <div key={i} className="relative group text-center lg:text-left">
                                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-10 group-hover:border-brand-gold transition-all duration-700 relative z-20 shadow-2xl backdrop-blur-md">
                                    <span className="text-2xl font-black text-brand-gold italic">{item.step}</span>
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight group-hover:text-brand-gold transition-colors">{item.title}</h3>
                                <p className="text-white/40 text-[11px] lg:text-[13px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto lg:mx-0">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 lg:py-32 bg-brand-white dark:bg-brand-black transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-brand-gold/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <span className="text-brand-red text-[10px] font-black uppercase tracking-[0.5em] block">Hubungi Kami</span>
                                <h2 className="text-4xl lg:text-7xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-[0.9] italic">
                                    HADIRKAN <br /><span className="text-brand-gold">VISI ANDA.</span>
                                </h2>
                                <p className="text-brand-black/50 dark:text-brand-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-md">
                                    Punya pertanyaan atau ide gila untuk sesi Anda? Kirimkan pesan, mari kita diskusikan mahakarya selanjutnya.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Waktu Operasional</div>
                                    <div className="text-sm font-bold text-brand-black dark:text-brand-white uppercase">Senin — Minggu</div>
                                    <div className="text-[10px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest">09:00 — 21:00 WIB</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Respon Cepat</div>
                                    <div className="text-sm font-bold text-brand-black dark:text-brand-white uppercase">WhatsApp Priority</div>
                                    <div className="text-[10px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest">Rata-rata &lt; 15 Menit</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-1 bg-linear-to-r from-brand-red to-brand-gold rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <form className="relative bg-white dark:bg-white/5 p-8 lg:p-12 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-3xl space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-[0.2em] ml-2">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            placeholder="Jhon Doe"
                                            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-brand-black dark:text-brand-white text-sm font-bold focus:ring-2 focus:ring-brand-gold transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-[0.2em] ml-2">Email / WhatsApp</label>
                                        <input
                                            type="text"
                                            placeholder="@handle / 0812..."
                                            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-brand-black dark:text-brand-white text-sm font-bold focus:ring-2 focus:ring-brand-red transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-[0.2em] ml-2">Pilih Layanan</label>
                                    <select className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-brand-black dark:text-brand-white text-sm font-bold focus:ring-2 focus:ring-brand-gold transition-all appearance-none cursor-pointer">
                                        <option value="">Pilih Kategori...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-[0.2em] ml-2">Pesan Anda</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Ceritakan sedikit tentang visi Anda..."
                                        className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-brand-black dark:text-brand-white text-sm font-bold focus:ring-2 focus:ring-brand-gold transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button type="button" className="w-full py-5 bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-brand-gold hover:text-brand-black transition-all duration-500 shadow-xl active:scale-95">
                                    Kirim Pesan Sekarang
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Invitation Section */}
            <section className="py-24 lg:py-32 px-6 relative overflow-hidden transition-colors">
                <div className="absolute inset-0 bg-brand-gold/3 dark:bg-brand-white/1"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="flex flex-col items-center gap-5 lg:gap-6 mb-10 lg:mb-12">
                        <StarIcon className="w-5 h-5 lg:w-6 lg:h-6 text-brand-gold animate-soft-pulse" />
                        <div className="h-px w-16 lg:w-20 bg-linear-to-r from-transparent via-brand-gold to-transparent"></div>
                    </div>

                    <h2 className="text-4xl sm:text-6xl md:text-[80px] font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-8 lg:mb-10 leading-[0.85] transition-colors">
                        JADILAH BAGIAN <br /> DARI <span className="text-brand-gold italic font-serif normal-case font-light">legasi</span> KAMI.
                    </h2>

                    <p className="text-brand-black/50 dark:text-brand-white/40 text-[10px] sm:text-xs lg:text-sm max-w-xl mx-auto mb-12 lg:mb-16 font-bold uppercase tracking-[0.3em] leading-relaxed transition-colors">
                        Kami mengundang Anda untuk merasakan pengalaman fotografi yang benar-benar berbeda. Sesi Anda, cerita Anda, karya seni Anda.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-brand-white dark:bg-white/5 p-8 lg:p-12 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-2xl transition-all">
                        <div className="lg:col-span-5 h-[250px] lg:h-auto rounded-3xl overflow-hidden border border-black/5 group/map relative min-h-[300px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15797.77169528612!2d113.8052148!3d-8.1583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd697669d0d5b43%3A0xc3f58992e59e38e1!2sAF%20STUDIO!5e0!3m2!1sid!2sid!4v1706500000000!5m2!1sid!2sid"
                                className="w-full h-full grayscale opacity-80 group-hover/map:grayscale-0 group-hover/map:opacity-100 transition-all duration-700"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="absolute top-4 left-4 pointer-events-none transition-opacity group-hover/map:opacity-0">
                                <div className="px-3 py-1 bg-brand-black text-white text-[8px] font-black uppercase tracking-widest rounded-full">Perspektif Studio</div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col justify-center space-y-6 text-center lg:text-left py-4 lg:py-0">
                            <h3 className="text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-none italic">
                                KUNJUNGI <br /> <span className="text-brand-gold">KAMI.</span>
                            </h3>
                            <p className="text-brand-black/50 dark:text-brand-white/40 text-[10px] lg:text-xs font-bold uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto lg:mx-0">
                                Jl. Diponegoro gang kidul pasar selatan pasar, dusun krajan 2, Kalisat, Kab. Jember, Jawa Timur 68193
                            </p>
                            <div className="pt-2">
                                <a
                                    href="https://maps.apple.com/?q=AF+STUDIO+Kalisat+Jember"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 text-[10px] font-black text-brand-red uppercase tracking-widest hover:text-brand-gold transition-colors underline decoration-brand-red/20 underline-offset-8"
                                >
                                    Buka Google Maps <ArrowRightIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-3 flex flex-col justify-center gap-4">
                            <Link
                                href="/price-list"
                                className="bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black hover:bg-brand-gold hover:text-brand-black p-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-700 shadow-xl hover:-translate-y-1 text-center"
                            >
                                Reservasi
                            </Link>
                            <Link
                                href="/selector-photo"
                                className="bg-brand-white dark:bg-white/5 text-brand-black dark:text-brand-white p-6 rounded-2xl border border-black/10 dark:border-white/10 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-700 hover:border-brand-gold shadow-lg hover:-translate-y-1 text-center"
                            >
                                Pilih Karya
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute -left-10 lg:-left-20 bottom-0 text-[100px] lg:text-[150px] font-black text-brand-black/2 dark:text-brand-white/2 select-none italic leading-none pointer-events-none uppercase">BUAT</div>
                <div className="absolute -right-10 lg:-right-20 top-0 text-[100px] lg:text-[150px] font-black text-brand-black/2 dark:text-brand-white/2 select-none italic leading-none pointer-events-none uppercase">VISI</div>
            </section>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                @keyframes marquee-slow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-slow {
                    animation: marquee-slow 60s linear infinite;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
                @keyframes soft-pulse {
                    0%, 100% { opacity: 0.5; scale: 1; }
                    50% { opacity: 1; scale: 1.1; }
                }
                .animate-soft-pulse {
                    animation: soft-pulse 4s infinite ease-in-out;
                }
                @keyframes scroll-line {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
                .animate-scroll-line {
                    animation: scroll-line 3s infinite linear;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(50px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </GuestLayout>
    );
}
