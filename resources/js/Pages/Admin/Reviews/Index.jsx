import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { StarIcon } from '@heroicons/react/24/outline';

export default function Index({ reviews }) {
    return (
        <AdminLayout>
            <Head title="Reviews" />

            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <StarIcon className="w-8 h-8 text-brand-black dark:text-brand-white" />
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">
                                Reviews
                            </h1>
                        </div>
                        <p className="text-sm text-brand-black/60 dark:text-brand-white/60">
                            Ulasan dari customer
                        </p>
                    </div>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <div className="bg-white dark:bg-brand-black/50 rounded-2xl border border-black/5 dark:border-white/5 p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <StarIcon className="w-16 h-16 text-brand-black/20 dark:text-brand-white/20" />
                        </div>
                        <p className="text-brand-black/40 dark:text-brand-white/40 font-bold">
                            Belum ada review
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white dark:bg-brand-black/50 rounded-2xl border border-black/5 dark:border-white/5 p-6 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Customer Info */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center">
                                                <span className="text-brand-red font-black text-sm">
                                                    {review.session.customer_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-brand-black dark:text-brand-white">
                                                    {review.session.customer_name}
                                                </h3>
                                                <p className="text-xs text-brand-black/40 dark:text-brand-white/40">
                                                    UID: {review.session.uid}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        {review.rating && (
                                            <div className="flex items-center gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        className={`w-5 h-5 ${i < review.rating
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-brand-black/10 dark:text-brand-white/10'
                                                            }`}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm font-bold text-brand-black/60 dark:text-brand-white/60">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                        )}

                                        {/* Review Text */}
                                        <p className="text-brand-black/80 dark:text-brand-white/80 leading-relaxed mb-3">
                                            {review.review_text}
                                        </p>

                                        {/* Date */}
                                        <p className="text-xs text-brand-black/40 dark:text-brand-white/40">
                                            📅 {review.created_at}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={`/admin/reviews/${review.id}`}
                                            className="px-4 py-2 bg-black/5 dark:bg-white/5 text-brand-black/60 dark:text-brand-white/60 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-brand-gold transition-all text-center"
                                        >
                                            Detail
                                        </Link>
                                        <Link
                                            href={`/admin/reviews/${review.id}`}
                                            method="delete"
                                            as="button"
                                            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all text-center"
                                            onBefore={() => confirm('Yakin ingin menghapus review ini?')}
                                        >
                                            Hapus
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
