import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { StarIcon } from '@heroicons/react/24/solid';
import { XMarkIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon, CameraIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function Review({ reviews }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    return (
        <div className="bg-brand-white dark:bg-brand-black min-h-screen font-sans transition-colors duration-500 relative overflow-hidden">
            <Head title="Suara Mereka - AFSTUDIO" />

            {/* Artistic Noise Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-50 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>

            <Navbar />

            {/* Hero Section - Ultra Premium Style */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full -mr-64 -mt-32 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-red/5 blur-[100px] rounded-full -ml-32 -mb-16 animate-soft-pulse"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
                        {/* Animated Badge */}
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-black/5 dark:bg-white/5 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/10 animate-fade-in shadow-sm">
                            <SparklesIcon className="w-3.5 h-3.5 text-brand-gold" />
                            <span className="text-[8px] md:text-[9px] font-black text-brand-black/60 dark:text-brand-white/60 uppercase tracking-[0.4em]">Testimonials & Resonance</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-none italic">
                            SUARA <span className="text-brand-gold">MEREKA.</span>
                        </h1>

                        <div className="flex items-center gap-6 animate-fade-in delay-300">
                            <div className="h-px w-8 md:w-12 bg-linear-to-r from-transparent to-brand-gold"></div>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] md:text-xs font-black uppercase tracking-[0.5em] italic">Articulating the Experience</p>
                            <div className="h-px w-8 md:w-12 bg-linear-to-l from-transparent to-brand-gold"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 pb-32 relative z-10 transition-all duration-700">
                {reviews.data.length === 0 ? (
                    <div className="text-center py-32 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-[3rem] border border-black/5 dark:border-white/10 animate-fade-in shadow-2xl">
                        <div className="w-20 h-20 bg-brand-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-brand-gold/20">
                            <ChatBubbleBottomCenterTextIcon className="w-10 h-10 text-brand-gold/40" />
                        </div>
                        <p className="text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-[0.4em] text-xs">
                            Echos of moments yet to be shared
                        </p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {reviews.data.map((review, idx) => (
                            <div
                                key={review.id}
                                className="break-inside-avoid relative group bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] p-6 md:p-8 border border-black/5 dark:border-white/10 hover:border-brand-gold/30 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Rating Stars - Absolute Top Right */}
                                <div className="absolute top-8 right-8 flex items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`w-2.5 h-2.5 ${i < review.rating ? 'text-brand-gold' : 'text-black/5 dark:text-white/5'}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 bg-linear-to-tr from-brand-red to-brand-gold rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-white font-black text-base italic">
                                                {review.customer_initial}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-black dark:bg-brand-white rounded-lg flex items-center justify-center border-2 border-white dark:border-brand-black shadow-sm">
                                            <CameraIcon className="w-2.5 h-2.5 text-white dark:text-brand-black" />
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-xs md:text-sm text-brand-black dark:text-brand-white uppercase tracking-[0.1em] truncate pr-12">
                                            {review.customer_name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black text-brand-gold uppercase tracking-widest leading-none">Verified</span>
                                            <div className="w-0.5 h-0.5 bg-brand-black/10 dark:bg-white/10 rounded-full"></div>
                                            <span className="text-[8px] font-medium text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest leading-none">
                                                {review.created_at}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Quote Style */}
                                <div className="relative mb-8">
                                    <div className="absolute -top-3 -left-1 text-[3rem] text-brand-gold opacity-[0.05] dark:opacity-10 font-serif leading-none select-none italic">“</div>
                                    <p className="text-xs md:text-sm text-brand-black/70 dark:text-brand-white/70 leading-relaxed font-medium italic relative z-10 px-3 group-hover:text-brand-black dark:group-hover:text-brand-white transition-colors">
                                        {review.review_text}
                                    </p>
                                </div>

                                {/* Curated Photo Style */}
                                {review.photo_url && (
                                    <div className="relative rounded-3xl overflow-hidden group/image border border-black/5 dark:border-white/5 mt-auto">
                                        <div className="aspect-4/3 overflow-hidden">
                                            <img
                                                src={review.photo_url}
                                                alt={`Review by ${review.customer_name}`}
                                                className="w-full h-full object-cover group-hover/image:scale-110 transition-all duration-1000 ease-out"
                                            />
                                        </div>
                                        {/* Cinematic Overlay */}
                                        <div
                                            onClick={() => setSelectedPhoto(review.photo_url)}
                                            className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover/image:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm cursor-pointer"
                                        >
                                            <div className="px-6 py-3 bg-white text-brand-black rounded-full flex items-center gap-3 shadow-2xl scale-90 group-hover/image:scale-100 transition-transform">
                                                <ArrowsPointingOutIcon className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">View</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination - Premium Minimalist */}
                {reviews.links && reviews.links.length > 3 && (
                    <div className="flex justify-center mt-24 items-center gap-6">
                        <div className="h-px w-20 bg-brand-black/5 dark:bg-white/5"></div>
                        <div className="flex items-center gap-3">
                            {reviews.links.map((link, k) => (
                                link.url && (
                                    <Link
                                        key={k}
                                        href={link.url}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase transition-all duration-500 border ${link.active
                                            ? 'bg-brand-black text-white dark:bg-brand-white dark:text-brand-black border-transparent shadow-xl'
                                            : 'bg-white/0 text-brand-black/40 dark:text-brand-white/40 border-black/5 dark:border-white/10 hover:border-brand-gold hover:text-brand-gold'
                                            }`}
                                    >
                                        {link.label.replace('&laquo; Previous', '←').replace('Next &raquo;', '→')}
                                    </Link>
                                )
                            ))}
                        </div>
                        <div className="h-px w-20 bg-brand-black/5 dark:bg-white/5"></div>
                    </div>
                )}
            </main>

            {/* Cinematic Fullscreen Preview */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-black/98 backdrop-blur-2xl transition-all duration-500">
                    <div
                        className="absolute inset-0 cursor-zoom-out"
                        onClick={() => setSelectedPhoto(null)}
                    ></div>

                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-brand-red rounded-full text-white transition-all z-[110] border border-white/10 hover:scale-110 active:scale-90"
                    >
                        <XMarkIcon className="w-8 h-8" />
                    </button>

                    <div className="relative max-w-6xl w-full h-full flex items-center justify-center pointer-events-none">
                        <img
                            src={selectedPhoto}
                            alt="Resonance Depth"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-700 animate-zoom-in pointer-events-auto"
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes soft-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.05; }
                    50% { transform: scale(1.1); opacity: 0.08; }
                }
                .animate-soft-pulse {
                    animation: soft-pulse 8s infinite ease-in-out;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                @keyframes zoom-in {
                    from { opacity: 0; scale: 0.95; }
                    to { opacity: 1; scale: 1; }
                }
                .animate-zoom-in {
                    animation: zoom-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </div>
    );
}
