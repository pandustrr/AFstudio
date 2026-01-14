import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PhotoIcon, BuildingOfficeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';

export default function Index({ about }) {
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

    const [imagePreview, setImagePreview] = React.useState(about.image_path ? `/storage/${about.image_path}` : null);

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
        });
    };

    return (
        <AdminLayout>
            <Head title="About Settings" />

            <div className="pt-12 lg:pt-20 pb-20 px-6 max-w-5xl mx-auto">
                <div className="flex flex-col gap-2 mb-10">
                    <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">About Company</h1>
                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">Atur konten halaman About, Visi Misi, dan Kontak.</p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info & Image */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Section */}
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <BuildingOfficeIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Profile Perusahaan</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel value="Hero Image" className="mb-2" />
                                    <div className="relative group w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-colors">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="About Hero" className="w-full h-full object-cover" />
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
                                    <p className="mt-2 text-[10px] uppercase font-bold text-brand-black/40 dark:text-brand-white/40">Klik area gambar untuk mengubah. Max 2MB.</p>
                                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Judul Halaman" />
                                    <TextInput
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full mt-1"
                                        placeholder="Contoh: Tentang AF Studio"
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <InputLabel value="Deskripsi Singkat" />
                                    <TextArea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full mt-1 h-32"
                                        placeholder="Deskripsi singkat tentang perusahaan..."
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Vision & Mission */}
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <GlobeAltIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Visi & Misi</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel value="Visi" />
                                    <TextArea
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                        className="w-full mt-1 h-40"
                                        placeholder="Visi perusahaan..."
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Misi" />
                                    <TextArea
                                        value={data.mission}
                                        onChange={(e) => setData('mission', e.target.value)}
                                        className="w-full mt-1 h-40"
                                        placeholder="Misi perusahaan..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-24">
                            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Kontak Detail</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel value="Email" />
                                    <TextInput
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full mt-1"
                                        type="email"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Nomor Telepon / WA" />
                                    <TextInput
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full mt-1"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Instagram Link" />
                                    <TextInput
                                        value={data.instagram}
                                        onChange={(e) => setData('instagram', e.target.value)}
                                        className="w-full mt-1"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Alamat Lengkap" />
                                    <TextArea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full mt-1 h-24"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Google Maps Link" />
                                    <TextInput
                                        value={data.maps_link}
                                        onChange={(e) => setData('maps_link', e.target.value)}
                                        className="w-full mt-1"
                                        placeholder="Iframe URL or Share Link"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <PrimaryButton className="w-full justify-center py-4 text-xs tracking-widest uppercase font-black" disabled={processing}>
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
