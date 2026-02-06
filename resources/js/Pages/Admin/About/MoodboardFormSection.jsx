import React from 'react';
import { PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function MoodboardFormSection({ mData, setMData, mImagePreview, setMImagePreview, handleMoodboardImageChange, handleMoodboardSubmit, mProcessing }) {
    return (
        <form onSubmit={handleMoodboardSubmit} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-24">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <PlusIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Tambah Moodboard</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <InputLabel value="Moodboard Image" className="mb-2" />
                    <div className="relative group w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-colors cursor-pointer">
                        {mImagePreview ? (
                            <img src={mImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-brand-black/20 dark:text-brand-white/20">
                                <PhotoIcon className="w-8 h-8 mb-2" />
                                <span className="text-[10px] uppercase font-black tracking-widest leading-none">Pilih Gambar</span>
                            </div>
                        )}
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleMoodboardImageChange}
                            accept="image/*"
                            required
                        />
                    </div>
                </div>

                <div>
                    <InputLabel value="Title (Optional)" />
                    <TextInput
                        value={mData.title}
                        onChange={(e) => setMData('title', e.target.value)}
                        className="w-full mt-1"
                        placeholder="Contoh: Warm Tone Style"
                    />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center py-4 text-[10px] tracking-widest uppercase font-black" disabled={mProcessing}>
                        {mProcessing ? 'Mengunggah...' : 'Upload Gambar'}
                    </PrimaryButton>
                </div>
            </div>
        </form>
    );
}
