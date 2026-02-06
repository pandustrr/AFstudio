import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

import HeroSection from './HeroSection';
import GallerySection from './GallerySection';
import JourneySection from './JourneySection';
import ServicesSection from './ServicesSection';
import ContactSection from './ContactSection';

import ConfirmModal from '@/Components/ConfirmModal';
import EditNotif from '@/Components/EditNotif';

export default function Index({ homePage, galleries, journeySteps }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',
        hero_title: homePage?.hero_title || '',
        hero_subtitle: homePage?.hero_subtitle || '',
        hero_description: homePage?.hero_description || '',
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
    const [displayGalleries, setDisplayGalleries] = useState(galleries || []);

    // Function to refresh galleries without page reload
    const refreshGalleries = async () => {
        try {
            // Create a temporary Inertia request to get fresh data
            const response = await fetch(window.location.pathname, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (response.ok) {
                const pageData = await response.json();
                if (pageData.props && pageData.props.galleries) {
                    setDisplayGalleries(pageData.props.galleries);
                }
            }
        } catch (error) {
            console.error('Failed to refresh galleries:', error);
            // Fallback to page reload if fetch fails
            window.location.reload();
        }
    };

    // Journey Steps Management
    const displayJourneySteps = journeySteps || [];
    const [isAddingNewJourney, setIsAddingNewJourney] = useState(false);
    const [newJourneyFormData, setNewJourneyFormData] = useState({ step_number: '', title: '', description: '', order: '' });
    const [creatingJourney, setCreatingJourney] = useState(false);

    // Notification States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteType, setDeleteType] = useState(''); // 'gallery' atau 'journey'
    const [showSuccessNotif, setShowSuccessNotif] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentSubmitting, setCurrentSubmitting] = useState(null); // Track which button is submitting

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
        fetch(`/admin/home/gallery/${deleteTarget}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content }
        }).then(async (res) => {
            if (res.ok) {
                setShowDeleteModal(false);
                setSuccessMessage('Gambar berhasil dihapus');
                setShowSuccessNotif(true);
                // Remove from displayGalleries without reload
                setDisplayGalleries(displayGalleries.filter(g => g.id !== deleteTarget));
            } else {
                alert('Gagal menghapus gambar');
            }
        }).catch((error) => {
            alert('Terjadi kesalahan: ' + error.message);
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

    const handleCreateJourney = () => {
        if (!newJourneyFormData.step_number || !newJourneyFormData.title || !newJourneyFormData.description) {
            alert('Mohon isi semua field');
            return;
        }

        setCreatingJourney(true);
        fetch('/admin/home/journey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            body: JSON.stringify(newJourneyFormData),
        }).then(async (res) => {
            setCreatingJourney(false);
            try {
                const data = await res.json();
                if (res.ok) {
                    setIsAddingNewJourney(false);
                    setNewJourneyFormData({ step_number: '', title: '', description: '', order: '' });
                    setSuccessMessage('Langkah perjalanan berhasil ditambahkan');
                    setShowSuccessNotif(true);
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    alert(data.message || 'Gagal menambahkan langkah');
                }
            } catch (error) {
                alert('Terjadi kesalahan saat memproses respons: ' + error.message);
            }
        }).catch((error) => {
            setCreatingJourney(false);
            alert('Terjadi kesalahan: ' + error.message);
        });
    };

    const submit = (e) => {
        e.preventDefault();

        const submitterName = e.nativeEvent.submitter?.name;
        setCurrentSubmitting(submitterName);

        if (submitterName === 'gallery_submit') {
            // Handle gallery upload with FormData
            if (!galleryData.image) {
                alert('Silakan pilih gambar terlebih dahulu');
                setCurrentSubmitting(null);
                return;
            }
            const formData = new FormData();
            formData.append('image', galleryData.image);
            formData.append('title', galleryData.title || '');

            fetch('/admin/home/gallery', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData
            }).then(async (res) => {
                try {
                    const data = await res.json();
                    if (res.ok) {
                        // Add new gallery to displayGalleries directly
                        setDisplayGalleries([...displayGalleries, data.gallery]);
                        setGalleryImagePreview(null);
                        resetGallery();
                        setSuccessMessage('Gambar berhasil diupload');
                        setShowSuccessNotif(true);
                        setCurrentSubmitting(null);
                    } else {
                        alert(data.message || 'Gagal mengupload gambar');
                        setCurrentSubmitting(null);
                    }
                } catch (error) {
                    alert('Terjadi kesalahan saat memproses respons: ' + error.message);
                    setCurrentSubmitting(null);
                }
            }).catch((error) => {
                alert('Terjadi kesalahan: ' + error.message);
                setCurrentSubmitting(null);
            });
        } else if (submitterName === 'hero_submit') {
            // Handle hero section
            const formData = new FormData();
            formData.append('hero_title', data.hero_title);
            formData.append('hero_subtitle', data.hero_subtitle);
            formData.append('hero_description', data.hero_description);
            formData.append('running_text', runningTextItems.join('|'));
            if (data.hero_image instanceof File) {
                formData.append('hero_image', data.hero_image);
            }

            fetch('/admin/home', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData
            }).then(async (res) => {
                if (res.ok) {
                    setSuccessMessage('Hero Section berhasil disimpan');
                    setShowSuccessNotif(true);
                    setCurrentSubmitting(null);
                } else {
                    const data = await res.json();
                    alert(data.message || 'Gagal menyimpan');
                    setCurrentSubmitting(null);
                }
            }).catch((error) => {
                alert('Terjadi kesalahan: ' + error.message);
                setCurrentSubmitting(null);
            });
        } else if (submitterName === 'services_submit') {
            // Handle services section
            const formData = new FormData();
            formData.append('services_title', data.services_title);
            formData.append('services_subtitle', data.services_subtitle);
            formData.append('services_description', data.services_description);

            fetch('/admin/home', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData
            }).then(async (res) => {
                if (res.ok) {
                    setSuccessMessage('Services Section berhasil disimpan');
                    setShowSuccessNotif(true);
                    setCurrentSubmitting(null);
                } else {
                    const data = await res.json();
                    alert(data.message || 'Gagal menyimpan');
                    setCurrentSubmitting(null);
                }
            }).catch((error) => {
                alert('Terjadi kesalahan: ' + error.message);
                setCurrentSubmitting(null);
            });
        } else if (submitterName === 'contact_submit') {
            // Handle contact section
            const formData = new FormData();
            formData.append('contact_label', data.contact_label);
            formData.append('contact_title', data.contact_title);
            formData.append('contact_description', data.contact_description);
            formData.append('operation_days', data.operation_days);
            formData.append('operation_hours', data.operation_hours);
            formData.append('response_title', data.response_title);
            formData.append('response_method', data.response_method);
            formData.append('response_time', data.response_time);
            formData.append('contact_form_title', data.contact_form_title);
            formData.append('contact_form_placeholder', data.contact_form_placeholder);
            formData.append('contact_button_text', data.contact_button_text);
            formData.append('admin_whatsapp', data.admin_whatsapp);

            fetch('/admin/home', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData
            }).then(async (res) => {
                if (res.ok) {
                    setSuccessMessage('Contact Section berhasil disimpan');
                    setShowSuccessNotif(true);
                    setCurrentSubmitting(null);
                } else {
                    const data = await res.json();
                    alert(data.message || 'Gagal menyimpan');
                    setCurrentSubmitting(null);
                }
            }).catch((error) => {
                alert('Terjadi kesalahan: ' + error.message);
                setCurrentSubmitting(null);
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

            <div className="pt-6 lg:pt-8 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-tight">Home Page</h1>
                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed">Atur konten halaman Home Anda dengan mudah</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Main Content */}
                    <div className="space-y-6">
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
                            currentSubmitting={currentSubmitting}
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
                            onGalleryUpdate={refreshGalleries}
                            setDisplayGalleries={setDisplayGalleries}
                        />

                        <JourneySection
                            journeySteps={displayJourneySteps}
                            onDeleteJourney={handleDeleteJourney}
                            isAddingNewJourney={isAddingNewJourney}
                            setIsAddingNewJourney={setIsAddingNewJourney}
                            newJourneyFormData={newJourneyFormData}
                            setNewJourneyFormData={setNewJourneyFormData}
                            onCreateJourney={handleCreateJourney}
                            creatingJourney={creatingJourney}
                            onSuccessNotification={(message) => {
                                setSuccessMessage(message);
                                setShowSuccessNotif(true);
                            }}
                        />

                        <ServicesSection
                            data={data}
                            setData={setData}
                            errors={errors}
                            currentSubmitting={currentSubmitting}
                        />

                        <ContactSection
                            data={data}
                            setData={setData}
                            errors={errors}
                            currentSubmitting={currentSubmitting}
                        />
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
