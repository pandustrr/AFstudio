import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import EditNotif from '@/Components/EditNotif';

import HeaderSection from './HeaderSection';
import FilterSection from './FilterSection';
import ReviewsListSection from './ReviewsListSection';

export default function Index({ reviews, averageRating, totalReviews, filters, options }) { // Updated props
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [showSuccessNotif, setShowSuccessNotif] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { delete: destroy, processing } = useForm();

    const monthNames = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const openDeleteModal = (id) => {
        setSelectedReviewId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        destroy(`/admin/reviews/${selectedReviewId}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSuccessMessage('Review berhasil dihapus');
                setShowSuccessNotif(true);
            },
            preserveScroll: true,
        });
    };

    const [localReviews, setLocalReviews] = useState(reviews);

    React.useEffect(() => {
        setLocalReviews(reviews);
    }, [reviews]);

    const handleToggle = (reviewId) => {
        // Optimistic update
        const updatedReviews = localReviews.map(r =>
            r.id === reviewId ? { ...r, is_visible: !r.is_visible } : r
        );
        setLocalReviews(updatedReviews);

        router.patch(`/admin/reviews/${reviewId}/toggle`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => { },
            onError: () => setLocalReviews(reviews)
        });
    };

    const handleFilterChange = (type, value) => {
        const newFilters = { ...filters, [type]: value };

        if (type === 'year') {
            newFilters.month = '';
            newFilters.day = '';
        } else if (type === 'month') {
            newFilters.day = '';
        }

        router.get('/admin/reviews', newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const setToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        router.get('/admin/reviews', {
            ...filters,
            year: year.toString(),
            month: month.toString(),
            day: day.toString(),
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Reviews" />

            <EditNotif
                show={showSuccessNotif}
                onClose={() => setShowSuccessNotif(false)}
                message={successMessage}
                type="success"
                duration={2000}
            />

            <div className="p-6 lg:p-8">
                <HeaderSection averageRating={averageRating} totalReviews={totalReviews} />

                <FilterSection
                    filters={filters}
                    options={options}
                    monthNames={monthNames}
                    onFilterChange={handleFilterChange}
                    onSetToday={setToday}
                />

                <ReviewsListSection
                    reviews={localReviews}
                    onToggle={handleToggle}
                    onDelete={openDeleteModal}
                />

                <ConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    title="Hapus Review"
                    message="Review ini akan dihapus permanen. Lanjutkan?"
                    processing={processing}
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
}
