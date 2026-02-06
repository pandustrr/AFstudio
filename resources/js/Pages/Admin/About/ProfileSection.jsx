import React from 'react';
import { BuildingOfficeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function ProfileSection({ data, setData, imagePreview, handleImageChange, errors, currentSubmitting }) {
    const isSubmitting = currentSubmitting === 'profile_submit';
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                    <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Pengaturan Profil</h2>
                </div>
                <button
                    type="submit"
                    name="profile_submit"
                    disabled={isSubmitting}
                    className="py-2 px-6 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-brand-gold/10"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <InputLabel value="Hero Image" className="mb-2" />
                    <div className="relative group w-full aspect-square md:aspect-video lg:aspect-square bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-colors cursor-pointer">
                        {imagePreview ? (
                            <img src={imagePreview} alt="About Hero" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-brand-black/20 dark:text-brand-white/20">
                                <PhotoIcon className="w-8 h-8" />
                            </div>
                        )}
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <InputLabel value="Subtitle Narasi" />
                            <TextInput
                                value={data.story_subtitle}
                                onChange={(e) => setData('story_subtitle', e.target.value)}
                                className="w-full mt-1"
                                placeholder="Contoh: Kisah Utama Kami"
                            />
                            {errors.story_subtitle && <p className="text-red-500 text-xs mt-1">{errors.story_subtitle}</p>}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Judul Narasi (Story Title)" />
                        <TextInput
                            value={data.story_title}
                            onChange={(e) => setData('story_title', e.target.value)}
                            className="w-full mt-1"
                            placeholder="Contoh: MENGABADIKAN MAHAKARYA"
                        />
                        {errors.story_title && <p className="text-red-500 text-xs mt-1">{errors.story_title}</p>}
                    </div>

                    <div>
                        <InputLabel value="Deskripsi Utama" />
                        <TextArea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full mt-1 h-24 sm:h-28"
                            placeholder="Deskripsi singkat tentang perusahaan..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
