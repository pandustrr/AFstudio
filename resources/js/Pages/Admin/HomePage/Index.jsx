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
import {
    SparklesIcon,
    PhotoIcon,
    MapIcon,
    Square3Stack3DIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

// Helper function to safely parse JSON response
const parseResponse = async (res) => {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await res.json();
    } else if (contentType && contentType.includes('text/html')) {
        throw new Error('Server mengembalikan halaman error HTML. Silakan hubungi tim IT.');
    } else {
        return await res.text().then(text => {
            try {
                return JSON.parse(text);
            } catch {
                throw new Error('Respons server bukan JSON yang valid');
            }
        });
    }
};

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
    // Manage journey steps state for real-time updates
    const [displayJourneySteps, setDisplayJourneySteps] = useState(journeySteps || []);
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
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
            }
        }).then(async (res) => {
            try {
                const data = await parseResponse(res);
                if (res.ok) {
                    setShowDeleteModal(false);
                    setSuccessMessage('Gambar berhasil dihapus');
                    setShowSuccessNotif(true);
                    // Remove from displayGalleries without reload
                    setDisplayGalleries(displayGalleries.filter(g => g.id !== deleteTarget));
                } else {
                    alert(data.message || 'Gagal menghapus gambar');
                }
            } catch (error) {
                alert('Terjadi kesalahan: ' + error.message);
            }
        }).catch((error) => {
            alert('Terjadi kesalahan network: ' + error.message);
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
                // Real-time update: Remove from displayJourneySteps
                setDisplayJourneySteps(displayJourneySteps.filter(s => s.id !== deleteTarget));
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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
            },
            body: JSON.stringify(newJourneyFormData),
        }).then(async (res) => {
            setCreatingJourney(false);
            try {
                const data = await parseResponse(res);
                if (res.ok) {
                    setIsAddingNewJourney(false);
                    setNewJourneyFormData({ step_number: '', title: '', description: '', order: '' });
                    setSuccessMessage('Langkah perjalanan berhasil ditambahkan');
                    setShowSuccessNotif(true);
                    // Add newly created journey directly to state for real-time update
                    if (data.journey) {
                        setDisplayJourneySteps([...displayJourneySteps, data.journey]);
                    }
                } else {
                    alert(data.message || 'Gagal menambahkan langkah');
                }
            } catch (error) {
                alert('Terjadi kesalahan: ' + error.message);
            }
        }).catch((error) => {
            setCreatingJourney(false);
            alert('Terjadi kesalahan network: ' + error.message);
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
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: formData
            }).then(async (res) => {
                try {
                    const data = await parseResponse(res);
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
                    alert('Terjadi kesalahan: ' + error.message);
                    setCurrentSubmitting(null);
                }
            }).catch((error) => {
                alert('Terjadi kesalahan network: ' + error.message);
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
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: formData
            }).then(async (res) => {
                try {
                    const responseData = await parseResponse(res);
                    if (res.ok) {
                        setSuccessMessage('Hero Section berhasil disimpan');
                        setShowSuccessNotif(true);
                        setCurrentSubmitting(null);
                    } else {
                        alert(responseData.message || 'Gagal menyimpan');
                        setCurrentSubmitting(null);
                    }
                } catch (error) {
                    alert('Terjadi kesalahan: ' + error.message);
                    setCurrentSubmitting(null);
                }
            }).catch((error) => {
                alert('Terjadi kesalahan network: ' + error.message);
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
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: formData
            }).then(async (res) => {
                try {
                    const responseData = await parseResponse(res);
                    if (res.ok) {
                        setSuccessMessage('Services Section berhasil disimpan');
                        setShowSuccessNotif(true);
                        setCurrentSubmitting(null);
                    } else {
                        alert(responseData.message || 'Gagal menyimpan');
                        setCurrentSubmitting(null);
                    }
                } catch (error) {
                    alert('Terjadi kesalahan: ' + error.message);
                    setCurrentSubmitting(null);
                }
            }).catch((error) => {
                alert('Terjadi kesalahan network: ' + error.message);
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
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: formData
            }).then(async (res) => {
                try {
                    const responseData = await parseResponse(res);
                    if (res.ok) {
                        setSuccessMessage('Contact Section berhasil disimpan');
                        setShowSuccessNotif(true);
                        setCurrentSubmitting(null);
                    } else {
                        alert(responseData.message || 'Gagal menyimpan');
                        setCurrentSubmitting(null);
                    }
                } catch (error) {
                    alert('Terjadi kesalahan: ' + error.message);
                    setCurrentSubmitting(null);
                }
            }).catch((error) => {
                alert('Terjadi kesalahan network: ' + error.message);
                setCurrentSubmitting(null);
            });
        }
    };

    const [activeTab, setActiveTab] = useState('hero');

    const tabs = [
        { id: 'hero', label: 'Hero', icon: SparklesIcon },
        { id: 'gallery', label: 'Galeri', icon: PhotoIcon },
        { id: 'journey', label: 'Alur Proses', icon: MapIcon },
        { id: 'services', label: 'Layanan', icon: Square3Stack3DIcon },
        { id: 'contact', label: 'Kontak', icon: EnvelopeIcon },
    ];

    return (
        <AdminLayout>
            <Head title="Pengaturan Beranda" />

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

            <div className="pt-6 lg:pt-8 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-tight">Halaman Beranda</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed">Atur konten halaman Home Anda dengan mudah</p>
                    </div>
                    {/* Compact Tab Switcher */}
                    <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                                        : 'text-brand-black/40 dark:text-brand-white/40 hover:text-brand-black dark:hover:text-brand-white'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-brand-gold'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={submit} className="relative">
                    {/* Active Section Content */}
                    <div className="transition-all duration-300">
                        {activeTab === 'hero' && (
                            <div className="animate-fade-in">
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
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="animate-fade-in">
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
                                    onSuccessNotification={(message) => {
                                        setSuccessMessage(message);
                                        setShowSuccessNotif(true);
                                    }}
                                />
                            </div>
                        )}

                        {activeTab === 'journey' && (
                            <div className="animate-fade-in">
                                <JourneySection
                                    journeySteps={displayJourneySteps}
                                    setJourneySteps={setDisplayJourneySteps}
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
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div className="animate-fade-in">
                                <ServicesSection
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    currentSubmitting={currentSubmitting}
                                />
                            </div>
                        )}

                        {activeTab === 'contact' && (
                            <div className="animate-fade-in">
                                <ContactSection
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    currentSubmitting={currentSubmitting}
                                />
                            </div>
                        )}
                    </div>
                </form>

                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </AdminLayout>
    );
}
