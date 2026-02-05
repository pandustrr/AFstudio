import React from 'react';
import { StarIcon as StarOutlineIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function HeaderSection({ averageRating, totalReviews }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <StarOutlineIcon className="w-8 h-8 text-brand-black dark:text-brand-white" />
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">
                        Reviews
                    </h1>
                </div>
                <p className="text-sm text-brand-black/60 dark:text-brand-white/60">
                    Ulasan dari customer untuk kualitas layanan Anda.
                </p>
            </div>

            {/* Stats Card */}
            <div className="flex bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Rata-rata Rating</span>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-brand-black dark:text-brand-white">{averageRating}</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <StarIconSolid
                                    key={i}
                                    className={`w-4 h-4 ${i <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-black/10 dark:text-white/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-px h-10 bg-black/5 dark:bg-white/5" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Total Reviews</span>
                    <span className="text-2xl font-black text-brand-black dark:text-brand-white">{totalReviews}</span>
                </div>
            </div>
        </div>
    );
}
