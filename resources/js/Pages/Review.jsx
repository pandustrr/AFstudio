import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { StarIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Review({ reviews }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    return (
        <div className="bg-white dark:bg-brand-black min-h-screen font-sans transition-colors duration-500">
            <Head title="Reviews - AF Studio" />
            <Navbar />

            <div className="pt-24 pb-12 px-4 md:pt-32 md:pb-20 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-brand-black dark:text-brand-white mb-2 md:mb-4">
                        Suara Mereka
                    </h1>
                    <p className="text-brand-black/60 dark:text-brand-white/60 text-xs md:text-base font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                        Pengalaman nyata dari klien yang telah mempercayakan momen berharganya kepada kami.
                    </p>
                </div>

                {reviews.data.length === 0 ? (
                    <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-3xl animate-fade-in">
                        <StarIcon className="w-16 h-16 text-brand-black/20 dark:text-brand-white/20 mx-auto mb-4" />
                        <p className="text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-widest">
                            Belum ada review
                        </p>
                    </div>
                ) : (
                    <div className="masonry-grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {reviews.data.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white dark:bg-brand-black border border-black/5 dark:border-white/5 rounded-2xl p-4 md:p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-red/10 rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-brand-red font-black text-xs md:text-sm">
                                                {review.customer_initial}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xs md:text-sm text-brand-black dark:text-brand-white uppercase tracking-wider">
                                                {review.customer_name}
                                            </h3>
                                            <span className="text-[9px] md:text-[10px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest block">
                                                Customer
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest">
                                        {review.created_at}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < review.rating
                                                ? 'text-yellow-400'
                                                : 'text-black/5 dark:text-white/5'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Review Text */}
                                <div className="relative mb-6">
                                    <span className="absolute -top-2 -left-2 text-2xl md:text-4xl text-black/5 dark:text-white/5 font-serif leading-none">"</span>
                                    <p className="text-xs md:text-sm text-brand-black/80 dark:text-brand-white/80 leading-relaxed italic relative z-10 px-2 line-clamp-6">
                                        {review.review_text}
                                    </p>
                                    <span className="absolute bottom-0 right-0 text-2xl md:text-4xl text-black/5 dark:text-white/5 font-serif leading-none">"</span>
                                </div>

                                {/* Photo */}
                                {review.photo_url && (
                                    <div className="relative rounded-xl overflow-hidden group-hover:shadow-lg transition-all">
                                        <div className="aspect-4/3">
                                            <img
                                                src={review.photo_url}
                                                alt={`Review by ${review.customer_name}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => setSelectedPhoto(review.photo_url)}
                                                className="px-4 py-2 bg-white/20 rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/30 hover:bg-white hover:text-black transition-all"
                                            >
                                                Lihat Foto
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination (Simple for now) */}
                {reviews.links && reviews.links.length > 3 && (
                    <div className="flex justify-center mt-8 md:mt-12 gap-1 md:gap-2">
                        {reviews.links.map((link, k) => (
                            <Link
                                key={k}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${link.active
                                    ? 'bg-brand-black text-white dark:bg-brand-white dark:text-brand-black'
                                    : 'bg-black/5 dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40 hover:bg-black/10 dark:hover:bg-white/10'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Photo Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white/50 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={selectedPhoto}
                            alt="Review Full"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Footer removed until implemented */}
        </div>
    );
}
