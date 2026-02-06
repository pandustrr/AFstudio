import React, { useState } from 'react';
import { PhotoIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
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
    onDeleteGallery,
    onGalleryUpdate,
    setDisplayGalleries,
    onSuccessNotification
}) {
    const displayGalleries = galleries || [];
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [editingImagePreview, setEditingImagePreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <PhotoIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                    <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Manajemen Galeri</h2>
                </div>
            </div>

            {/* Compact Addition Form */}
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                    <div className="md:col-span-4">
                        <InputLabel value="Unggah Gambar Baru" className="mb-2" />
                        <div className="relative group w-full aspect-video bg-black/10 dark:bg-white/10 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-all duration-300">
                            {galleryImagePreview ? (
                                <img src={galleryImagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-brand-black/20 dark:text-brand-white/20">
                                    <PhotoIcon className="w-8 h-8" />
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setGalleryData('image', file);
                                        setGalleryImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-5 space-y-2">
                        <InputLabel value="Judul Gambar (Opsional)" />
                        <TextInput
                            value={galleryData.title}
                            onChange={(e) => setGalleryData('title', e.target.value)}
                            className="w-full py-2.5 text-xs bg-white dark:bg-white/5"
                            placeholder="Beri nama karya Anda..."
                        />
                    </div>
                    <div className="md:col-span-3">
                        <button
                            type="button"
                            onClick={() => {
                                // Index.jsx handles the main form submit which includes galleryData
                                // But since this is a separate section in my tabbed view, 
                                // I should check how Index.jsx handles this. 
                                // Actually, GallerySection usually has its own submit if it's separate.
                                // In Index.jsx, it's inside a form.
                                if (document.querySelector('button[name="gallery_submit"]')) {
                                    document.querySelector('button[name="gallery_submit"]').click();
                                }
                            }}
                            className="w-full py-2.5 px-4 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-all shadow-lg shadow-brand-gold/10 disabled:opacity-50"
                            disabled={galleryProcessing || !galleryData.image}
                        >
                            {galleryProcessing ? 'Mengunggah...' : 'Unggah Gambar'}
                        </button>
                        {/* Hidden real submit button for Index.jsx form listener if any */}
                        <button type="submit" name="gallery_submit" className="hidden" />
                    </div>
                </div>
            </div>

            {/* Gallery Items Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                        Koleksi Saat Ini ({displayGalleries.length} item)
                    </h3>
                </div>

                {displayGalleries.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {displayGalleries.map((gallery, index) => (
                            <div key={gallery.id} className="space-y-2">
                                <div className="group relative aspect-square rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-brand-gold/50 transition-all duration-300">
                                    <img
                                        src={`/storage/${gallery.image_path}`}
                                        alt={gallery.title || `Gallery ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between gap-2">
                                        <div className="flex gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(editingId === gallery.id ? null : gallery.id);
                                                    setEditingData({ title: gallery.title || '', order: gallery.order || '' });
                                                }}
                                                className="p-1.5 bg-white/10 hover:bg-brand-gold text-white hover:text-black rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <PencilSquareIcon className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteGallery(gallery.id)}
                                                className="p-1.5 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-all"
                                                title="Hapus"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <span className="text-[8px] font-black text-white/60 tracking-tighter uppercase whitespace-nowrap">
                                            #{gallery.order}
                                        </span>
                                    </div>
                                </div>

                                {editingId === gallery.id && (
                                    <div className="p-3 bg-brand-gold/5 dark:bg-brand-gold/10 rounded-xl border border-brand-gold/20 space-y-3 animate-fade-in text-left">
                                        <div>
                                            <InputLabel value="Judul Gambar" />
                                            <TextInput
                                                value={editingData.title || ''}
                                                onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                                                className="w-full py-1.5 text-[10px] mt-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <InputLabel value="Urutan" />
                                                <TextInput
                                                    type="number"
                                                    value={editingData.order || ''}
                                                    onChange={(e) => setEditingData({ ...editingData, order: parseInt(e.target.value) || '' })}
                                                    className="w-full py-1.5 text-[10px] mt-1"
                                                />
                                            </div>
                                            <div className="flex gap-1 items-end mt-5">
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        try {
                                                            const formData = new FormData();
                                                            formData.append('title', editingData.title || '');
                                                            formData.append('order', editingData.order || '');

                                                            const response = await fetch(`/admin/home/gallery/${gallery.id}`, {
                                                                method: 'PATCH',
                                                                headers: {
                                                                    'Accept': 'application/json',
                                                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                                                                },
                                                                body: formData
                                                            });

                                                            if (response.ok) {
                                                                const updatedGalleries = displayGalleries.map(g =>
                                                                    g.id === gallery.id ? { ...g, title: editingData.title, order: editingData.order } : g
                                                                );
                                                                setDisplayGalleries(updatedGalleries);
                                                                setEditingId(null);
                                                                onSuccessNotification?.('Berhasil Diperbarui!');
                                                            }
                                                        } catch (e) {
                                                            alert('Gagal update');
                                                        } finally {
                                                            setIsSaving(false);
                                                        }
                                                    }}
                                                    className="p-2 bg-brand-gold text-black rounded-lg transition-all"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(null)}
                                                    className="p-2 bg-black/5 dark:bg-white/5 rounded-lg transition-all"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                        <PhotoIcon className="w-10 h-10 text-brand-black/10 dark:text-brand-white/10 mx-auto mb-3" />
                        <p className="text-[10px] text-brand-black/30 dark:text-brand-white/30 uppercase font-black tracking-widest">Tidak ada gambar di galeri</p>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
