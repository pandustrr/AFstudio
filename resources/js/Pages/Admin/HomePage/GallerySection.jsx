import React from 'react';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

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

export default function GallerySection({
    galleries,
    galleryData,
    setGalleryData,
    galleryProcessing,
    galleryImagePreview,
    setGalleryImagePreview,
    resetGallery,
    onDeleteGallery
}) {
    const displayGalleries = galleries || [];

    return (
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
                                            onClick={() => onDeleteGallery(gallery.id)}
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
    );
}
