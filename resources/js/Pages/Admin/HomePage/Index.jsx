import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

import HeroSection from './HeroSection';
import GallerySection from './GallerySection';
import JourneySection from './JourneySection';
import ServicesSection from './ServicesSection';
import ContactSection from './ContactSection';
import ButtonsSection from './ButtonsSection';

import ConfirmModal from '@/Components/ConfirmModal';
import EditNotif from '@/Components/EditNotif';

export default function Index({ homePage, galleries, journeySteps }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',
        hero_title: homePage?.hero_title || '',
        hero_subtitle: homePage?.hero_subtitle || '',
        hero_description: homePage?.hero_description || '',
        cta_button_text: homePage?.cta_button_text || 'Mulai Cerita Anda',
        about_button_text: homePage?.about_button_text || 'Mengenal Kami',
        running_text: homePage?.running_text || '',
        services_title: homePage?.services_title || 'LAYANAN YANG MENGINSPIRASI.',
        services_subtitle: homePage?.services_subtitle || 'Layanan Pilihan',
        services_description: homePage?.services_description || '',
        contact_label: homePage?.contact_label || 'Hubungi Kami',
        contact_title: homePage?.contact_title || 'HADIRKAN VISI ANDA.',
        contact_description: homePage?.contact_description || '',
        operation_title: homePage?.operation_title || 'Waktu Operasional',
        operation_days: homePage?.operation_days || 'Senin — Minggu',
        operation_hours: homePage?.operation_hours || '09:00 — 21:00 WIB',
        response_title: homePage?.response_title || 'Respon Cepat',
        response_method: homePage?.response_method || 'WhatsApp Priority',
        response_time: homePage?.response_time || 'Rata-rata < 15 Menit',
        contact_form_title: homePage?.contact_form_title || 'Pesan Anda',
        contact_form_placeholder: homePage?.contact_form_placeholder || 'Ceritakan sedikit tentang visi Anda...',
        contact_button_text: homePage?.contact_button_text || 'Kirim Pesan Sekarang',
        admin_whatsapp: homePage?.admin_whatsapp || '6281230487469',
        hero_image: null,
    });

    // Gallery form state
    const { data: galleryData, setData: setGalleryData, post: postGallery, processing: galleryProcessing, reset: resetGallery } = useForm({
        image: null,
        title: '',
    });

    // State for Dynamic Running Text List
    const [runningTextItems, setRunningTextItems] = useState(
        homePage?.running_text
            ? homePage.running_text.split('|').map(t => t.trim()).filter(Boolean)
            : ['Visi Artistik', 'Jiwa Sinematik', 'Bingkai Abadi']
    );

    const [imagePreview, setImagePreview] = React.useState(homePage?.hero_image_path ? `/storage/${homePage.hero_image_path}` : null);

    // Gallery Management
    const [galleryImagePreview, setGalleryImagePreview] = useState(null);
    const displayGalleries = galleries || [];

    // Journey Steps Management
    const displayJourneySteps = journeySteps || [];
    const [editingJourneyId, setEditingJourneyId] = useState(null);
    const [journeyFormData, setJourneyFormData] = useState({ step_number: '', title: '', description: '', order: '' });

    // Notification States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'gallery' atau 'journey'
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessNotif, setShowSuccessNotif] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { delete: destroy } = useForm();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('hero_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDeleteGallery = (galleryId) => {
        setDeleteTarget(galleryId);
        setDeleteType('gallery');
        setShowDeleteModal(true);
    };

    const confirmDeleteGallery = () => {
        destroy(`/admin/home/gallery/${deleteTarget}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSuccessMessage('Gambar berhasil dihapus');
                setShowSuccessNotif(true);
            },
        });
    };

    const handleDeleteJourney = (journeyId) => {
        setDeleteTarget(journeyId);
        setDeleteType('journey');
        setShowDeleteModal(true);
    };

    const confirmDeleteJourney = () => {
        destroy(`/admin/home/journey/${deleteTarget}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSuccessMessage('Langkah perjalanan berhasil dihapus');
                setShowSuccessNotif(true);
            },
        });
    };

    const handleRunningTextChange = (index, value) => {
        const newItems = [...runningTextItems];
        newItems[index] = value;
        setRunningTextItems(newItems);
        setData('running_text', newItems.join('|'));
    };

    const addRunningTextItem = () => {
        const newItems = [...runningTextItems, ''];
        setRunningTextItems(newItems);
        setData('running_text', newItems.join('|'));
    };

    const removeRunningTextItem = (index) => {
        const newItems = runningTextItems.filter((_, i) => i !== index);
        setRunningTextItems(newItems);
        setData('running_text', newItems.join('|'));
    };

    const handleSaveJourney = (journeyId) => {
        setShowEditModal(true);
        fetch(`/admin/home/journey/${journeyId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            body: JSON.stringify(journeyFormData),
        }).then((res) => {
            if (res.ok) {
                setEditingJourneyId(null);
                setSuccessMessage('Langkah perjalanan berhasil diperbarui');
                setShowSuccessNotif(true);
                setTimeout(() => window.location.reload(), 1500);
            }
        });
    };

    const submit = (e) => {
        e.preventDefault();

        const submitterName = e.nativeEvent.submitter?.name;

        if (submitterName === 'gallery_submit') {
            // Handle gallery upload
            if (!galleryData.image) {
                alert('Silakan pilih gambar terlebih dahulu');
                return;
            }
            postGallery('/admin/home/gallery', {
                preserveScroll: true,
                onSuccess: () => {
                    setGalleryImagePreview(null);
                    resetGallery();
                    setSuccessMessage('Gambar berhasil diupload');
                    setShowSuccessNotif(true);
                },
            });
        } else {
            // Handle home page update (home_submit or default)
            data.running_text = runningTextItems.join('|');
            post('/admin/home', {
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('Perubahan berhasil disimpan');
                    setShowSuccessNotif(true);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Home Page Settings" />

            <EditNotif
                show={showSuccessNotif}
                onClose={() => setShowSuccessNotif(false)}
                message={successMessage}
                type="success"
                duration={2000}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteType === 'gallery' ? confirmDeleteGallery : confirmDeleteJourney}
                title="Hapus Data"
                message={deleteType === 'gallery'
                    ? 'Gambar akan dihapus dari galeri. Apakah Anda yakin?'
                    : 'Langkah perjalanan akan dihapus. Apakah Anda yakin?'}
                variant="danger"
            />

            <div className="pt-8 lg:pt-12 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-tight">Home Page</h1>
                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed">Atur konten Hero Section dan tombol CTA halaman Home.</p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info & Image */}
                    <div className="lg:col-span-2 space-y-6">
                        <HeroSection
                            data={data}
                            setData={setData}
                            errors={errors}
                            imagePreview={imagePreview}
                            setImagePreview={setImagePreview}
                            runningTextItems={runningTextItems}
                            setRunningTextItems={setRunningTextItems}
                            handleImageChange={handleImageChange}
                            handleRunningTextChange={handleRunningTextChange}
                            addRunningTextItem={addRunningTextItem}
                            removeRunningTextItem={removeRunningTextItem}
                        />

                        <GallerySection
                            galleries={displayGalleries}
                            galleryData={galleryData}
                            setGalleryData={setGalleryData}
                            galleryProcessing={galleryProcessing}
                            galleryImagePreview={galleryImagePreview}
                            setGalleryImagePreview={setGalleryImagePreview}
                            resetGallery={resetGallery}
                            onDeleteGallery={handleDeleteGallery}
                        />

                        <JourneySection
                            journeySteps={displayJourneySteps}
                            onDeleteJourney={handleDeleteJourney}
                            editingJourneyId={editingJourneyId}
                            setEditingJourneyId={setEditingJourneyId}
                            journeyFormData={journeyFormData}
                            setJourneyFormData={setJourneyFormData}
                            onSaveJourney={handleSaveJourney}
                        />

                        <ServicesSection
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        <ContactSection
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>

                    {/* Right Column - Button Texts */}
                    <ButtonsSection
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                    />
                </form>
            </div>
        </AdminLayout>
    );
}
