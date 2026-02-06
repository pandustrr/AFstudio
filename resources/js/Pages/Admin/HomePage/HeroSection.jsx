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
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <PhotoIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                    <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Pengaturan Hero</h2>
                </div>
                <button
                    type="submit"
                    name="hero_submit"
                    disabled={isSubmitting}
                    className="py-2 px-6 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-brand-gold/10"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Column: Image and Runing Text */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                    <div>
                        <InputLabel value="Gambar Latar Hero" className="mb-2" />
                        <div className="relative group w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-all duration-300">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-brand-black/20 dark:text-brand-white/20">
                                    <PhotoIcon className="w-10 h-10" />
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] text-white font-black uppercase tracking-widest">Ganti Gambar</span>
                            </div>
                        </div>
                        <p className="mt-2 text-[8px] uppercase font-bold text-brand-black/30 dark:text-brand-white/30 tracking-wider">Format: JPG, PNG, WEBP. Maks 5MB.</p>
                        {errors.hero_image && <p className="text-red-500 text-xs mt-1">{errors.hero_image}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <InputLabel value="Teks Banner (Berjalan)" />
                            <button
                                type="button"
                                onClick={addRunningTextItem}
                                className="text-[9px] font-black uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 flex items-center gap-1 transition-colors"
                            >
                                <PlusIcon className="w-3 h-3" /> Tambah Item
                            </button>
                        </div>

                        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 border border-black/5 dark:border-white/5 space-y-2">
                            {runningTextItems.map((item, index) => (
                                <div key={index} className="flex gap-2 group">
                                    <div className="flex-1">
                                        <TextInput
                                            value={item}
                                            onChange={(e) => handleRunningTextChange(index, e.target.value)}
                                            className="w-full py-1.5 text-[11px] bg-white dark:bg-white/5"
                                            placeholder={`Teks item #${index + 1}`}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeRunningTextItem(index)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-40 group-hover:opacity-100"
                                        title="Hapus"
                                    >
                                        <TrashIcon className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            {runningTextItems.length === 0 && (
                                <div className="text-center py-4">
                                    <p className="text-[9px] text-brand-black/30 dark:text-brand-white/30 uppercase font-black tracking-widest italic">Belum ada teks banner</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Title and Descriptions */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-4">
                    <div>
                        <InputLabel value="Judul Utama (H1)" />
                        <TextInput
                            value={data.hero_title}
                            onChange={(e) => setData('hero_title', e.target.value)}
                            className="w-full mt-1.5 py-2.5 text-xs font-bold"
                            placeholder="MELAMPAUI MOMEN."
                        />
                        {errors.hero_title && <p className="text-red-500 text-[10px] mt-1">{errors.hero_title}</p>}
                    </div>

                    <div>
                        <InputLabel value="Sub-judul / Slogan" />
                        <TextInput
                            value={data.hero_subtitle}
                            onChange={(e) => setData('hero_subtitle', e.target.value)}
                            className="w-full mt-1.5 py-2 text-xs"
                            placeholder="keanggunan ARTISTIK"
                        />
                        {errors.hero_subtitle && <p className="text-red-500 text-[10px] mt-1">{errors.hero_subtitle}</p>}
                    </div>

                    <div>
                        <InputLabel value="Deskripsi Hero" />
                        <TextArea
                            value={data.hero_description}
                            onChange={(e) => setData('hero_description', e.target.value)}
                            className="w-full mt-1.5 h-32 text-xs leading-relaxed"
                            placeholder="Mari abadikan setiap penggalan cerita Anda..."
                        />
                        {errors.hero_description && <p className="text-red-500 text-[10px] mt-1">{errors.hero_description}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
