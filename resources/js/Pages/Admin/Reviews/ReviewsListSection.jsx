import React from 'react';
import { Link } from '@inertiajs/react';
import { StarIcon } from '@heroicons/react/24/solid';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function ReviewsListSection({ reviews, onToggle, onDelete }) {
    if (reviews.length === 0) {
        return (
            <div className="bg-white dark:bg-brand-black/50 rounded-2xl border border-black/5 dark:border-white/5 p-12 text-center">
                <div className="flex justify-center mb-4">
                    <StarIcon className="w-16 h-16 text-brand-black/20 dark:text-brand-white/20" />
                </div>
                <p className="text-brand-black/40 dark:text-brand-white/40 font-bold">
                    Belum ada review
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white dark:bg-brand-black/50 rounded-xl border border-black/5 dark:border-white/5 p-4 hover:shadow-md transition-all"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            {/* Customer Info */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-brand-red/10 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-brand-red font-black text-xs">
                                        {review.session.customer_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-sm text-brand-black dark:text-brand-white truncate">
                                        {review.session.customer_name}
                                    </h3>
                                    <p className="text-[10px] text-brand-black/40 dark:text-brand-white/40 truncate">
                                        UID: {review.session.uid}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            {review.rating && (
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-brand-black/10 dark:text-brand-white/10'
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-1 text-xs font-bold text-brand-black/60 dark:text-brand-white/60">
                                        {review.rating}/5
                                    </span>
                                </div>
                            )}

                            {/* Review Text */}
                            <p className="text-sm text-brand-black/80 dark:text-brand-white/80 leading-relaxed mb-2 line-clamp-2">
                                {review.review_text}
                            </p>

                            {/* Review Photo Preview */}
                            {review.photo_url && (
                                <div className="mb-2">
                                    <img
                                        src={review.photo_url}
                                        alt="Foto Customer"
                                        className="w-16 h-16 object-cover rounded-lg border border-black/5 dark:border-white/5"
                                    />
                                </div>
                            )}

                            {/* Tampilkan Toggle */}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                    Tampilkan
                                </span>
                                <button
                                    onClick={() => onToggle(review.id)}
                                    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${review.is_visible ? 'bg-green-500' : 'bg-gray-200 dark:bg-white/10'
                                        }`}
                                >
                                    <span
                                        className={`${review.is_visible ? 'translate-x-4' : 'translate-x-1'
                                            } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                                    />
                                </button>
                            </div>

                            {/* Date */}
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 flex items-center gap-1 mt-2">
                                <CalendarIcon className="w-3 h-3" />
                                <span>{review.created_at}</span>
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <Link
                                href={`/admin/reviews/${review.id}`}
                                className="px-3 py-1.5 bg-black/5 dark:bg-white/5 text-brand-black/60 dark:text-brand-white/60 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-brand-gold transition-all text-center"
                            >
                                Detail
                            </Link>
                            <button
                                onClick={() => onDelete(review.id)}
                                className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all text-center"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
