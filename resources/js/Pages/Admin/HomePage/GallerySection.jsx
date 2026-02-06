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
    setDisplayGalleries
}) {
    const displayGalleries = galleries || [];
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [editingImagePreview, setEditingImagePreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

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
                            <div key={gallery.id}>
                                <div className="group relative overflow-hidden rounded-xl border border-black/5 dark:border-white/5 hover:border-brand-gold transition-all duration-300">
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
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (editingId === gallery.id) {
                                                            setEditingId(null);
                                                        } else {
                                                            setEditingId(gallery.id);
                                                            setEditingData({
                                                                title: gallery.title || '',
                                                                order: gallery.order || ''
                                                            });
                                                        }
                                                    }}
                                                    className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilSquareIcon className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteGallery(gallery.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Hapus Gambar"
                                                >
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Form */}
                                {editingId === gallery.id && (
                                    <div className="mt-2 p-4 bg-brand-gold/5 dark:bg-brand-gold/10 rounded-xl border border-brand-gold/20 space-y-3">
                                        <h3 className="text-sm font-bold text-brand-black dark:text-brand-white">Edit Gambar</h3>

                                        <div>
                                            <InputLabel value="Gambar Gallery (Opsional)" className="mb-2" />
                                            <div className="relative group w-full aspect-video bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-gold transition-colors cursor-pointer">
                                                {editingImagePreview ? (
                                                    <img src={editingImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <img src={`/storage/${gallery.image_path}`} alt="Current" className="w-full h-full object-cover" />
                                                )}
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setEditingData({...editingData, image: file});
                                                            setEditingImagePreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    accept="image/*"
                                                />
                                            </div>
                                            <p className="mt-2 text-[9px] uppercase font-bold text-brand-black/40 dark:text-brand-white/40">Klik untuk ganti gambar (opsional)</p>
                                        </div>

                                        <div>
                                            <InputLabel value="Judul Gambar" className="mb-2" />
                                            <TextInput
                                                value={editingData.title || ''}
                                                onChange={(e) => setEditingData({...editingData, title: e.target.value})}
                                                className="w-full py-2 text-xs"
                                                placeholder="Nama atau judul karya"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Urutan" className="mb-2" />
                                            <TextInput
                                                type="number"
                                                value={editingData.order || ''}
                                                onChange={(e) => setEditingData({...editingData, order: parseInt(e.target.value) || ''})}
                                                className="w-full py-2 text-xs"
                                                placeholder="1, 2, 3..."
                                                min="1"
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setIsSaving(true);
                                                    try {
                                                        const formData = new FormData();
                                                        if (editingData.image instanceof File) {
                                                            formData.append('image', editingData.image);
                                                        }
                                                        formData.append('title', editingData.title || '');
                                                        formData.append('order', editingData.order || '');

                                                        const response = await fetch(`/admin/home/gallery/${gallery.id}`, {
                                                            method: 'PATCH',
                                                            headers: {
                                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                                                            },
                                                            body: formData
                                                        });
                                                        let data;
                                                        try {
                                                            data = await response.json();
                                                        } catch (parseError) {
                                                            throw new Error('Invalid response format: ' + parseError.message);
                                                        }
                                                        if (response.ok) {
                                                            // Update displayGalleries directly with edited item
                                                            const updatedGalleries = displayGalleries.map(g =>
                                                                g.id === gallery.id
                                                                    ? {
                                                                        ...g,
                                                                        title: editingData.title || g.title,
                                                                        order: editingData.order || g.order,
                                                                        image_path: data.gallery?.image_path || g.image_path
                                                                    }
                                                                    : g
                                                            );
                                                            setDisplayGalleries(updatedGalleries);
                                                            setEditingId(null);
                                                            setEditingImagePreview(null);
                                                        } else {
                                                            alert(data.message || 'Gagal menyimpan perubahan');
                                                        }
                                                    } catch (error) {
                                                        alert('Terjadi kesalahan: ' + error.message);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="flex-1 py-2 px-3 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
                                            >
                                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditingImagePreview(null);
                                                }}
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
                    <div className="text-center py-8 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                        <PhotoIcon className="w-8 h-8 text-brand-black/20 dark:text-brand-white/20 mx-auto mb-2" />
                        <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 uppercase font-black tracking-widest">Belum ada gambar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
