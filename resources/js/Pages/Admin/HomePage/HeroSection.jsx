import React from 'react';
import { PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function HeroSection({
    data,
    setData,
    errors,
    imagePreview,
    setImagePreview,
    runningTextItems,
    setRunningTextItems,
    handleImageChange,
    handleRunningTextChange,
    addRunningTextItem,
    removeRunningTextItem,
    currentSubmitting
}) {
    const isSubmitting = currentSubmitting === 'hero_submit';
    return (
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

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <button
                    type="submit"
                    name="hero_submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Hero Section'}
                </button>
            </div>
        </div>
    );
}
