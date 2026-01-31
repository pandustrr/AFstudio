import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';

export default function Index({ homePage }) {
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
        hero_image: null,
    });

    // State for Dynamic Running Text List
    const [runningTextItems, setRunningTextItems] = useState(
        homePage?.running_text
            ? homePage.running_text.split('|').map(t => t.trim()).filter(Boolean)
            : ['Visi Artistik', 'Jiwa Sinematik', 'Bingkai Abadi']
    );

    const [imagePreview, setImagePreview] = React.useState(homePage?.hero_image_path ? `/storage/${homePage.hero_image_path}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('hero_image', file);
            setImagePreview(URL.createObjectURL(file));
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

        // Ensure data is synced before submit (React state to Form data)
        data.running_text = runningTextItems.join('|');

        post('/admin/home', {
            preserveScroll: true,
        });
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
                                <PrimaryButton className="w-full justify-center py-3 text-[10px] tracking-widest uppercase font-black" disabled={processing}>
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
