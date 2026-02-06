import React from 'react';
import { BuildingOfficeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function ProfileSection({ data, setData, imagePreview, handleImageChange, errors }) {
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <BuildingOfficeIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Profile Perusahaan</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <InputLabel value="Hero Image" className="mb-2" />
                    <div className="relative group w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-colors cursor-pointer">
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
    );
}
