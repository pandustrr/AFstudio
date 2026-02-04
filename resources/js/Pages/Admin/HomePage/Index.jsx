import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PhotoIcon, PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';

function GalleryForm({ imagePreview, setImagePreview, galleryData, setGalleryData, galleryProcessing }) {
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGalleryData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white">Tambah Gambar</h3>

            <div>
                <InputLabel value="Gambar Gallery" className="mb-2" />
                <div className="relative group w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-colors">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Gallery Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-brand-black/20 dark:text-brand-white/20">
                            <PhotoIcon className="w-12 h-12" />
                        </div>
                    )}
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>
                <p className="mt-2 text-[9px] uppercase font-bold text-brand-black/40 dark:text-brand-white/40">Klik untuk upload. Max 5MB.</p>
            </div>

            <div>
                <InputLabel value="Judul Gambar (Opsional)" className="mb-2" />
                <TextInput
                    value={galleryData.title}
                    onChange={(e) => setGalleryData('title', e.target.value)}
                    className="w-full py-2 text-xs"
                    placeholder="Nama atau judul karya"
                />
            </div>

            <button 
                type="submit"
                name="gallery_submit"
                className="w-full justify-center py-2 text-[10px] tracking-widest uppercase font-black bg-brand-gold hover:bg-brand-gold/90 text-black rounded-lg transition-colors disabled:opacity-50 px-3 flex items-center"
                disabled={galleryProcessing || !galleryData.image}
            >
                {galleryProcessing ? 'Mengupload...' : 'Upload Gambar'}
            </button>
        </>
    );
}

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
    const [galleryRefresh, setGalleryRefresh] = useState(0);
    const [galleryImagePreview, setGalleryImagePreview] = useState(null);
    const displayGalleries = galleries || [];
    
    // Journey Steps Management
    const displayJourneySteps = journeySteps || [];
    const [editingJourneyId, setEditingJourneyId] = useState(null);
    const [journeyFormData, setJourneyFormData] = useState({ step_number: '', title: '', description: '', order: '' });
    
    const { delete: destroy } = useForm();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('hero_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const deleteGalleryImage = (galleryId) => {
        if (confirm('Hapus gambar ini dari galeri?')) {
            destroy(`/admin/home/gallery/${galleryId}`, {
                preserveScroll: true,
            });
        }
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
                },
            });
        } else {
            // Handle home page update (home_submit or default)
            data.running_text = runningTextItems.join('|');
            post('/admin/home', {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Home Page Settings" />

            <div className="pt-8 lg:pt-12 pb-12 px-6 max-w-4xl mx-auto">
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-tight">Home Page</h1>
                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed">Atur konten Hero Section dan tombol CTA halaman Home.</p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info & Image */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Section */}
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <PhotoIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Hero Section</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel value="Hero Image" className="mb-2" />
                                    <div className="relative group w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-colors">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Hero" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-brand-black/20 dark:text-brand-white/20">
                                                <PhotoIcon className="w-12 h-12" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    <p className="mt-2 text-[9px] uppercase font-bold text-brand-black/40 dark:text-brand-white/40">Klik area gambar untuk mengubah. Max 5MB.</p>
                                    {errors.hero_image && <p className="text-red-500 text-xs mt-1">{errors.hero_image}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Judul Utama (Hero Title)" />
                                    <TextInput
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="Contoh: MELAMPAUI MOMEN."
                                    />
                                    {errors.hero_title && <p className="text-red-500 text-[10px] mt-1">{errors.hero_title}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Subtitle (Opsional)" />
                                    <TextInput
                                        value={data.hero_subtitle}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="Contoh: keanggunan ARTISTIK"
                                    />
                                    {errors.hero_subtitle && <p className="text-red-500 text-[10px] mt-1">{errors.hero_subtitle}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Deskripsi Hero" />
                                    <TextArea
                                        value={data.hero_description}
                                        onChange={(e) => setData('hero_description', e.target.value)}
                                        className="w-full mt-1 h-32 text-xs"
                                        placeholder="Mari abadikan setiap penggalan cerita Anda..."
                                    />
                                    {errors.hero_description && <p className="text-red-500 text-[10px] mt-1">{errors.hero_description}</p>}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <InputLabel value="Teks Berjalan (Running Text)" />
                                        <button
                                            type="button"
                                            onClick={addRunningTextItem}
                                            className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:underline flex items-center gap-1"
                                        >
                                            <PlusIcon className="w-3 h-3" /> Tambah Teks
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {runningTextItems.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <TextInput
                                                    value={item}
                                                    onChange={(e) => handleRunningTextChange(index, e.target.value)}
                                                    className="w-full py-2 text-xs"
                                                    placeholder={`Teks berjalan #${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeRunningTextItem(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Hapus Teks"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {runningTextItems.length === 0 && (
                                            <div className="text-center py-4 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                                                <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 uppercase font-black tracking-widest">Belum ada teks</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-3 text-[9px] uppercase font-bold text-brand-black/40 dark:text-brand-white/40">Teks ini akan muncul di banner berjalan halaman utama.</p>
                                    {errors.running_text && <p className="text-red-500 text-[10px] mt-1">{errors.running_text}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Gallery Section - Karya Terbaru */}
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <PhotoIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Karya Terbaru Gallery</h2>
                            </div>

                            {/* Add Gallery Image Form */}
                            <div className="space-y-4 p-4 bg-black/2 dark:bg-white/2 rounded-xl border border-black/5 dark:border-white/5">
                                <GalleryForm 
                                    imagePreview={galleryImagePreview}
                                    setImagePreview={setGalleryImagePreview}
                                    galleryData={galleryData}
                                    setGalleryData={setGalleryData}
                                    galleryProcessing={galleryProcessing}
                                />
                            </div>

                            {/* Gallery Items List */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white">Daftar Gambar ({displayGalleries.length})</h3>
                                
                                {displayGalleries.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {displayGalleries.map((gallery, index) => (
                                            <div key={gallery.id} className="group relative overflow-hidden rounded-xl border border-black/5 dark:border-white/5 hover:border-brand-gold transition-all duration-300">
                                                {/* Image */}
                                                <div className="relative w-full aspect-video bg-black/5 dark:bg-white/5 overflow-hidden">
                                                    <img 
                                                        src={`/storage/${gallery.image_path}`} 
                                                        alt={gallery.title || `Gallery ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.png';
                                                        }}
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="p-3 bg-white dark:bg-white/5">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-brand-black/60 dark:text-brand-white/60 truncate mb-2">
                                                        {gallery.title || `Karya ${index + 1}`}
                                                    </p>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-[9px] text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-widest">
                                                            Urutan: {gallery.order}
                                                        </span>
                                                        <button
                                                            onClick={() => deleteGalleryImage(gallery.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Hapus Gambar"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                                        <PhotoIcon className="w-8 h-8 text-brand-black/20 dark:text-brand-white/20 mx-auto mb-2" />
                                        <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 uppercase font-black tracking-widest">Belum ada gambar</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Journey Steps Section */}
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Alur Proses (Journey Steps)</h2>
                            </div>

                            {/* Journey Steps List */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white">Daftar Langkah ({displayJourneySteps.length})</h3>
                                
                                {displayJourneySteps.length > 0 ? (
                                    <div className="space-y-3">
                                        {displayJourneySteps.map((step) => (
                                            <div key={step.id} className="p-4 bg-black/2 dark:bg-white/2 rounded-xl border border-black/5 dark:border-white/5">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-2xl font-black text-brand-gold">{step.step_number}</span>
                                                            <div>
                                                                <p className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white">{step.title}</p>
                                                                <p className="text-[9px] text-brand-black/60 dark:text-brand-white/60 mt-1">{step.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                if (editingJourneyId === step.id) {
                                                                    setEditingJourneyId(null);
                                                                } else {
                                                                    setJourneyFormData({
                                                                        step_number: step.step_number,
                                                                        title: step.title,
                                                                        description: step.description,
                                                                        order: step.order || ''
                                                                    });
                                                                    setEditingJourneyId(step.id);
                                                                }
                                                            }}
                                                            className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors"
                                                            title="Edit Step"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Hapus langkah ini?')) {
                                                                    destroy(`/admin/home/journey/${step.id}`, { preserveScroll: true });
                                                                }
                                                            }}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Hapus Step"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Edit Form */}
                                                {editingJourneyId === step.id && (
                                                    <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
                                                        <div>
                                                            <InputLabel value="Nomor Langkah" className="mb-2" />
                                                            <TextInput
                                                                value={journeyFormData.step_number}
                                                                onChange={(e) => setJourneyFormData({...journeyFormData, step_number: e.target.value})}
                                                                className="w-full py-2 text-xs"
                                                                placeholder="01, 02, 03..."
                                                            />
                                                        </div>
                                                        <div>
                                                            <InputLabel value="Judul Langkah" className="mb-2" />
                                                            <TextInput
                                                                value={journeyFormData.title}
                                                                onChange={(e) => setJourneyFormData({...journeyFormData, title: e.target.value})}
                                                                className="w-full py-2 text-xs"
                                                                placeholder="Konsultasi"
                                                            />
                                                        </div>
                                                        <div>
                                                            <InputLabel value="Deskripsi" className="mb-2" />
                                                            <TextArea
                                                                value={journeyFormData.description}
                                                                onChange={(e) => setJourneyFormData({...journeyFormData, description: e.target.value})}
                                                                className="w-full h-20 text-xs"
                                                                placeholder="Deskripsi langkah..."
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    fetch(`/admin/home/journey/${step.id}`, {
                                                                        method: 'PATCH',
                                                                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                                                                        body: JSON.stringify(journeyFormData),
                                                                    }).then(() => {
                                                                        setEditingJourneyId(null);
                                                                        window.location.reload();
                                                                    });
                                                                }}
                                                                className="flex-1 py-2 px-3 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase hover:bg-brand-gold/90 transition-colors"
                                                            >
                                                                Simpan Perubahan
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditingJourneyId(null)}
                                                                className="flex-1 py-2 px-3 bg-black/10 dark:bg-white/10 rounded-lg text-[10px] font-black uppercase hover:bg-black/20 transition-colors"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                                        <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 uppercase font-black tracking-widest">Belum ada langkah</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Services Section Content */}
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Services Section</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel value="Judul Utama (Services Title)" />
                                    <TextInput
                                        value={data.services_title}
                                        onChange={(e) => setData('services_title', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="Contoh: LAYANAN YANG MENGINSPIRASI"
                                    />
                                    {errors.services_title && <p className="text-red-500 text-[10px] mt-1">{errors.services_title}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Subtitle" />
                                    <TextInput
                                        value={data.services_subtitle}
                                        onChange={(e) => setData('services_subtitle', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="Contoh: Layanan Pilihan"
                                    />
                                    {errors.services_subtitle && <p className="text-red-500 text-[10px] mt-1">{errors.services_subtitle}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Deskripsi Layanan" />
                                    <TextArea
                                        value={data.services_description}
                                        onChange={(e) => setData('services_description', e.target.value)}
                                        className="w-full mt-1 h-24 text-xs"
                                        placeholder="Contoh: Setiap momen memiliki jiwanya sendiri..."
                                    />
                                    {errors.services_description && <p className="text-red-500 text-[10px] mt-1">{errors.services_description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Contact Section Content */}
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Contact Section</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel value="Label (Hubungi Kami)" />
                                    <TextInput
                                        value={data.contact_label}
                                        onChange={(e) => setData('contact_label', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="Hubungi Kami"
                                    />
                                    {errors.contact_label && <p className="text-red-500 text-[10px] mt-1">{errors.contact_label}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Judul Utama (Hadirkan Visi Anda)" />
                                    <TextInput
                                        value={data.contact_title}
                                        onChange={(e) => setData('contact_title', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="HADIRKAN VISI ANDA."
                                    />
                                    {errors.contact_title && <p className="text-red-500 text-[10px] mt-1">{errors.contact_title}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Deskripsi" />
                                    <TextArea
                                        value={data.contact_description}
                                        onChange={(e) => setData('contact_description', e.target.value)}
                                        className="w-full mt-1 h-20 text-xs"
                                        placeholder="Punya pertanyaan atau ide gila untuk sesi Anda?..."
                                    />
                                    {errors.contact_description && <p className="text-red-500 text-[10px] mt-1">{errors.contact_description}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <InputLabel value="Hari Operasional" />
                                        <TextInput
                                            value={data.operation_days}
                                            onChange={(e) => setData('operation_days', e.target.value)}
                                            className="w-full mt-1 py-2 text-xs"
                                            placeholder="Senin — Minggu"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel value="Jam Operasional" />
                                        <TextInput
                                            value={data.operation_hours}
                                            onChange={(e) => setData('operation_hours', e.target.value)}
                                            className="w-full mt-1 py-2 text-xs"
                                            placeholder="09:00 — 21:00 WIB"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <InputLabel value="Metode Respon" />
                                        <TextInput
                                            value={data.response_method}
                                            onChange={(e) => setData('response_method', e.target.value)}
                                            className="w-full mt-1 py-2 text-xs"
                                            placeholder="WhatsApp Priority"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel value="Waktu Respon" />
                                        <TextInput
                                            value={data.response_time}
                                            onChange={(e) => setData('response_time', e.target.value)}
                                            className="w-full mt-1 py-2 text-xs"
                                            placeholder="Rata-rata < 15 Menit"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel value="Teks Tombol Form" />
                                    <TextInput
                                        value={data.contact_button_text}
                                        onChange={(e) => setData('contact_button_text', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="Kirim Pesan Sekarang"
                                    />
                                    {errors.contact_button_text && <p className="text-red-500 text-[10px] mt-1">{errors.contact_button_text}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Button Texts */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5 sticky top-24">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Button Texts</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel value="Teks Tombol CTA" />
                                    <TextInput
                                        value={data.cta_button_text}
                                        onChange={(e) => setData('cta_button_text', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="Mulai Cerita Anda"
                                    />
                                    {errors.cta_button_text && <p className="text-red-500 text-xs mt-1">{errors.cta_button_text}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Teks Tombol About" />
                                    <TextInput
                                        value={data.about_button_text}
                                        onChange={(e) => setData('about_button_text', e.target.value)}
                                        className="w-full mt-1 py-2 text-xs"
                                        placeholder="Mengenal Kami"
                                    />
                                    {errors.about_button_text && <p className="text-red-500 text-xs mt-1">{errors.about_button_text}</p>}
                                </div>
                            </div>

                            <div className="pt-2">
                                <PrimaryButton 
                                    name="home_submit"
                                    className="w-full justify-center py-3 text-[10px] tracking-widest uppercase font-black" 
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
