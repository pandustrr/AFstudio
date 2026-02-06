import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import EditNotif from '@/Components/EditNotif';

import ProfileSection from './ProfileSection';
import VisionMissionSection from './VisionMissionSection';
import ContactDetailSection from './ContactDetailSection';
import MoodboardListSection from './MoodboardListSection';
import MoodboardFormSection from './MoodboardFormSection';

export default function Index({ about, moodboards }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',
        title: about.title || '',
        description: about.description || '',
        image: null,
        vision: about.vision || '',
        mission: about.mission || '',
        address: about.address || '',
        email: about.email || '',
        phone: about.phone || '',
        instagram: about.instagram || '',
        maps_link: about.maps_link || '',
    });

    const [imagePreview, setImagePreview] = useState(about.image_path ? `/storage/${about.image_path}` : null);
    const [showSuccessNotif, setShowSuccessNotif] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/about', {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Perubahan berhasil disimpan');
                setShowSuccessNotif(true);
            }
        });
    };

    // Moodboard Form
    const { data: mData, setData: setMData, post: postMoodboard, processing: mProcessing, reset: mReset } = useForm({
        image: null,
        title: '',
    });

    const [mImagePreview, setMImagePreview] = useState(null);
    const [deleteMoodboardModal, setDeleteMoodboardModal] = useState(false);
    const [moodboardToDelete, setMoodboardToDelete] = useState(null);

    const handleMoodboardImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMData('image', file);
            setMImagePreview(URL.createObjectURL(file));
        }
    };

    const handleMoodboardSubmit = (e) => {
        e.preventDefault();
        postMoodboard('/admin/about/moodboard', {
            preserveScroll: true,
            onSuccess: () => {
                mReset();
                setMImagePreview(null);
                setSuccessMessage('Moodboard berhasil ditambahkan');
                setShowSuccessNotif(true);
            },
        });
    };

    const openDeleteMoodboardModal = (id) => {
        setMoodboardToDelete(id);
        setDeleteMoodboardModal(true);
    };

    const confirmDeleteMoodboard = () => {
        router.delete(`/admin/about/moodboard/${moodboardToDelete}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteMoodboardModal(false);
                setSuccessMessage('Moodboard berhasil dihapus');
                setShowSuccessNotif(true);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="About Settings" />

            <div className="pt-8 lg:pt-16 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
                <div className="flex flex-col gap-2 mb-10">
                    <h1 className="text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-tight">About Company</h1>
                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed">Atur konten halaman About, Visi Misi, dan Kontak.</p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info & Image */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Section */}
                        <ProfileSection
                            data={data}
                            setData={setData}
                            imagePreview={imagePreview}
                            handleImageChange={handleImageChange}
                            errors={errors}
                        />

                        {/* Vision & Mission Section */}
                        <VisionMissionSection
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>

                    {/* Right Column - Contact Info */}
                    <div className="space-y-8">
                        {/* Contact Detail Section */}
                        <ContactDetailSection
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            submit={submit}
                        />
                    </div>
                </form>

                {/* Moodboard Section */}
                <div className="mt-16 sm:mt-24 space-y-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">Moodboard Gallery</h2>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Koleksi inspirasi dan referensi gaya fotografi.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* List Moodboards */}
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <MoodboardListSection
                                moodboards={moodboards}
                                openDeleteMoodboardModal={openDeleteMoodboardModal}
                            />
                        </div>

                        {/* Add Moodboard Form */}
                        <div className="order-1 lg:order-2">
                            <MoodboardFormSection
                                mData={mData}
                                setMData={setMData}
                                mImagePreview={mImagePreview}
                                setMImagePreview={setMImagePreview}
                                handleMoodboardImageChange={handleMoodboardImageChange}
                                handleMoodboardSubmit={handleMoodboardSubmit}
                                mProcessing={mProcessing}
                            />
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    isOpen={deleteMoodboardModal}
                    onClose={() => setDeleteMoodboardModal(false)}
                    onConfirm={confirmDeleteMoodboard}
                    title="Hapus Moodboard"
                    message="Apakah Anda yakin ingin menghapus moodboard ini?"
                    variant="danger"
                />

                {/* Success Notification */}
                <EditNotif
                    show={showSuccessNotif}
                    onClose={() => setShowSuccessNotif(false)}
                    message={successMessage}
                    type="success"
                    duration={2000}
                />
            </div>
        </AdminLayout>
    );
}
