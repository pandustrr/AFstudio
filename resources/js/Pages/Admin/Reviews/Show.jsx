import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ review }) {
    return (
        <AdminLayout>
            <Head title={`Review - ${review.session.customer_name}`} />

            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href="/admin/reviews"
                            className="text-sm text-brand-red hover:underline mb-2 inline-block"
                        >
                            ← Kembali ke Reviews
                        </Link>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">
                            Detail Review
                        </h1>
                    </div>
                </div>

                {/* Review Card */}
                <div className="bg-white dark:bg-brand-black/50 rounded-2xl border border-black/5 dark:border-white/5 p-8">
                    {/* Customer Info */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                        <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center">
                            <span className="text-brand-red font-black text-2xl">
                                {review.session.customer_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-brand-black dark:text-brand-white">
                                {review.session.customer_name}
                            </h2>
                            <p className="text-sm text-brand-black/60 dark:text-brand-white/60">
                                UID: <span className="font-mono">{review.session.uid}</span>
                            </p>
                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 mt-1">
                                Status: <span className="uppercase font-bold">{review.session.status}</span>
                            </p>
                        </div>
                    </div>

                    {/* Rating */}
                    {review.rating && (
                        <div className="mb-6">
                            <h3 className="text-sm font-black uppercase tracking-wider text-brand-black/60 dark:text-brand-white/60 mb-2">
                                Rating
                            </h3>
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-3xl ${i < review.rating
                                            ? 'text-yellow-400'
                                            : 'text-brand-black/10 dark:text-brand-white/10'
                                            }`}
                                    >
                                        ⭐
                                    </span>
                                ))}
                                <span className="ml-2 text-2xl font-black text-brand-black dark:text-brand-white">
                                    {review.rating}/5
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Review Text */}
                    <div className="mb-6">
                        <h3 className="text-sm font-black uppercase tracking-wider text-brand-black/60 dark:text-brand-white/60 mb-3">
                            Ulasan
                        </h3>
                        <div className="bg-brand-black/5 dark:bg-white/5 rounded-xl p-6">
                            <p className="text-brand-black dark:text-brand-white leading-relaxed text-lg">
                                "{review.review_text}"
                            </p>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="mb-6">
                        <h3 className="text-sm font-black uppercase tracking-wider text-brand-black/60 dark:text-brand-white/60 mb-2">
                            Tanggal Review
                        </h3>
                        <p className="text-brand-black dark:text-brand-white font-bold">
                            📅 {review.created_at}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-black/5 dark:border-white/5">
                        <Link
                            href={`/admin/photo-editing/${review.session.id}`}
                            className="px-6 py-3 bg-brand-red text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-brand-red/90 transition-all"
                        >
                            Lihat Request
                        </Link>
                        <Link
                            href={`/admin/reviews/${review.id}`}
                            method="delete"
                            as="button"
                            className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all"
                            onBefore={() => confirm('Yakin ingin menghapus review ini?')}
                        >
                            Hapus Review
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
