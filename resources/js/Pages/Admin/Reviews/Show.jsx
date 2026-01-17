import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { StarIcon } from '@heroicons/react/24/solid';
import { CalendarIcon } from '@heroicons/react/24/outline';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

export default function Show({ review }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/admin/reviews/${review.id}`, {
            onSuccess: () => setDeleteModalOpen(false),
        });
    };

    return (
        <AdminLayout>
            <Head title={`Review - ${review.session.customer_name}`} />

            <div className="p-4 lg:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link
                            href="/admin/reviews"
                            className="text-xs text-brand-red hover:underline mb-1 inline-block"
                        >
                            ← Kembali ke Reviews
                        </Link>
                        <h1 className="text-2xl font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">
                            Detail Review
                        </h1>
                    </div>
                </div>

                {/* Review Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white dark:bg-brand-black/50 rounded-2xl border border-black/5 dark:border-white/5 p-4">
                            {/* Customer Info */}
                            <div className="text-center mb-4 pb-4 border-b border-black/5 dark:border-white/5">
                                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-brand-red font-black text-2xl">
                                        {review.session.customer_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h2 className="text-lg font-black text-brand-black dark:text-brand-white mb-0.5">
                                    {review.session.customer_name}
                                </h2>
                                <p className="text-[10px] text-brand-black/60 dark:text-brand-white/60">
                                    UID: <span className="font-mono">{review.session.uid}</span>
                                </p>
                                <div className="mt-2">
                                    <span className="px-2 py-0.5 bg-black/5 dark:bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-wider text-brand-black/60 dark:text-brand-white/60">
                                        {review.session.status}
                                    </span>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="mb-4 text-center">
                                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5">
                                    <CalendarIcon className="w-3.5 h-3.5 text-brand-black/40 dark:text-brand-white/40" />
                                    <span className="text-[10px] font-bold text-brand-black dark:text-brand-white">
                                        {review.created_at}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <Link
                                    href={`/admin/photo-editing/${review.session.id}`}
                                    className="w-full px-4 py-2 bg-brand-gold hover:bg-black hover:text-white text-brand-black rounded-lg font-black text-xs uppercase tracking-wider transition-all text-center"
                                >
                                    Lihat Request
                                </Link>
                                <button
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="w-full px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all text-center"
                                >
                                    Hapus Review
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white dark:bg-brand-black/50 rounded-2xl border border-black/5 dark:border-white/5 p-4">
                            {/* Rating */}
                            {review.rating && (
                                <div className="mb-4 pb-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-wider text-brand-black/40 dark:text-brand-white/40 mb-1">
                                            Rating Diberikan
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-brand-black dark:text-brand-white">
                                                {review.rating}
                                            </span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating
                                                            ? 'text-yellow-400'
                                                            : 'text-brand-black/10 dark:text-brand-white/10'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Review Text */}
                            <div className="mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-brand-black/40 dark:text-brand-white/40 mb-2">
                                    Ulasan Customer
                                </h3>
                                <div className="bg-brand-black/5 dark:bg-white/5 rounded-xl p-4 relative">
                                    <span className="absolute top-2 left-2 text-2xl text-black/5 dark:text-white/5 font-serif">"</span>
                                    <p className="text-sm text-brand-black dark:text-brand-white leading-relaxed italic relative z-10 px-2">
                                        {review.review_text}
                                    </p>
                                    <span className="absolute bottom-2 right-2 text-2xl text-black/5 dark:text-white/5 font-serif leading-none">"</span>
                                </div>
                            </div>

                            {/* Review Photo */}
                            {review.photo_url && (
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-wider text-brand-black/40 dark:text-brand-white/40 mb-2">
                                        Foto Review
                                    </h3>
                                    <div className="relative group rounded-xl overflow-hidden border border-black/5 dark:border-white/5 w-fit">
                                        <img
                                            src={review.photo_url}
                                            alt="Review Memory"
                                            className="max-h-80 w-auto object-contain"
                                        />
                                        <a
                                            href={review.photo_url}
                                            target="_blank"
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white font-black uppercase tracking-widest text-[10px]"
                                        >
                                            <span className="px-3 py-1.5 border border-white/20 rounded-lg backdrop-blur-sm bg-black/20">
                                                Buka Foto Penuh
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DeleteConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    title="Hapus Review"
                    message="Review ini akan dihapus permanen. Lanjutkan?"
                    processing={processing}
                />
            </div>
        </AdminLayout>
    );
}
