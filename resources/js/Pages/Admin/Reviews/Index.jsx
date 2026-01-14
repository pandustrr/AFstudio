import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react'; // Added router import
import AdminLayout from '@/Layouts/AdminLayout';
import { StarIcon as StarOutlineIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

export default function Index({ reviews, averageRating, totalReviews, currentFilter }) { // Added currentFilter prop
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const { delete: destroy, processing } = useForm();

    const openDeleteModal = (id) => {
        setSelectedReviewId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        destroy(`/admin/reviews/${selectedReviewId}`, {
            onSuccess: () => setDeleteModalOpen(false),
            preserveScroll: true,
        });
    };

    const handleFilterChange = (filter) => {
        router.get('/admin/reviews', { filter }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Reviews" />

            <div className="p-6 lg:p-8">
                {/* Header */}
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
                                        <StarIcon
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

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {[
                        { id: 'all', label: 'Semua' },
                        { id: 'daily', label: 'Hari Ini' },
                        { id: 'weekly', label: 'Minggu Ini' },
                        { id: 'monthly', label: 'Bulan Ini' },
                        { id: 'yearly', label: 'Tahun Ini' },
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => handleFilterChange(filter.id)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentFilter === filter.id
                                ? 'bg-brand-black text-white dark:bg-brand-gold dark:text-brand-black shadow-lg scale-105'
                                : 'bg-black/5 dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40 hover:bg-black/10 dark:hover:bg-white/10'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
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

                                        {/* Date */}
                                        <p className="text-xs text-brand-black/40 dark:text-brand-white/40 flex items-center gap-1 mt-auto">
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
                                            onClick={() => openDeleteModal(review.id)}
                                            className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all text-center"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
