import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { XMarkIcon, TrashIcon, PlusIcon, CheckIcon, PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

export default function ManageCategoriesModal({ isOpen, onClose, categories, onSuccess }) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);

    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [deleting, setDeleting] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        type: 'photographer',
        background_image: null,
    });

    // Reset edit state when modal closes or categories change
    useEffect(() => {
        if (!isOpen) {
            setEditingId(null);
            setEditName('');
            setEditImage(null);
            setEditImagePreview(null);
            reset();
        }
    }, [isOpen]);

    const handleAdd = (e) => {
        e.preventDefault();

        post('/admin/pricelist/category', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (onSuccess) {
                    onSuccess('Kategori berhasil ditambahkan!', 'success');
                }
            },
            onError: () => {
                if (onSuccess) {
                    onSuccess('Gagal menambahkan kategori!', 'error');
                }
            },
        });
    };

    const handleUpdate = (id, type) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', editName);
        formData.append('type', type);
        if (editImage) {
            formData.append('background_image', editImage);
        }

        router.post(`/admin/pricelist/category/${id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                setEditImage(null);
                setEditImagePreview(null);
                if (onSuccess) {
                    onSuccess('Kategori berhasil diperbarui!', 'success');
                }
            },
            onError: () => {
                if (onSuccess) {
                    onSuccess('Gagal memperbarui kategori!', 'error');
                }
            },
        });
    };

    const handleDelete = (id, name) => {
        setDeleteModal({ show: true, id, name });
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(`/admin/pricelist/category/${deleteModal.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleting(false);
                setDeleteModal({ show: false, id: null, name: '' });
                if (onSuccess) {
                    onSuccess('Kategori berhasil dihapus!', 'success');
                }
            },
            onError: () => {
                setDeleting(false);
                if (onSuccess) {
                    onSuccess('Gagal menghapus kategori!', 'error');
                }
            },
        });
    };

    const startEditing = (category) => {
        setEditingId(category.id);
        setEditName(category.name);
        setEditImage(null);
        setEditImagePreview(category.background_image ? `/storage/${category.background_image}` : null);
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditName('');
        setEditImage(null);
        setEditImagePreview(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-brand-black w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/5 flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
                    <h3 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                        Kelola Kategori
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar grow">
                    {/* List of Categories */}
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Daftar Kategori Utama</label>
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-start gap-3 p-3 bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl group transition-all hover:border-brand-gold/30">
                                {/* Image Preview */}
                                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden shrink-0 border border-black/5 dark:border-white/5">
                                    {editingId === category.id ? (
                                        <div className="relative w-full h-full group/edit-img cursor-pointer">
                                            {editImagePreview ? (
                                                <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <PhotoIcon className="w-5 h-5 opacity-40" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleEditFileChange}
                                                accept="image/*"
                                            />
                                        </div>
                                    ) : (
                                        category.background_image ? (
                                            <img src={`/storage/${category.background_image}`} alt={category.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <PhotoIcon className="w-5 h-5 opacity-40" />
                                            </div>
                                        )
                                    )}
                                </div>

                                {editingId === category.id ? (
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full bg-white dark:bg-white/5 border-0 rounded-xl px-4 py-2 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold"
                                            autoFocus
                                            placeholder="Nama Kategori"
                                        />
                                        <div className="text-[9px] text-brand-black/40 dark:text-brand-white/40 font-bold uppercase tracking-widest">
                                            Klik gambar untuk ubah
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col gap-1 px-2 py-1">
                                        <div className="text-sm font-bold text-brand-black dark:text-brand-white">
                                            {category.name}
                                        </div>
                                        <div className="text-[9px] font-black uppercase text-brand-black/30 dark:text-brand-white/30 tracking-widest">
                                            {category.type}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-1 self-center">
                                    {editingId === category.id ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(category.id, category.type)}
                                                className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                                                title="Simpan"
                                            >
                                                <CheckIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Batal"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEditing(category)}
                                                className="p-2 text-brand-black/40 dark:text-brand-white/40 hover:text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="p-2 text-brand-black/20 dark:text-brand-white/20 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-all"
                                                title="Hapus"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New Category */}
                    <div className="pt-6 border-t border-black/5 dark:border-white/5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-3">Tambah Kategori Baru</label>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden shrink-0 border border-black/5 dark:border-white/5 relative group cursor-pointer hover:border-brand-gold transition-colors">
                                    {data.background_image ? (
                                        <img src={URL.createObjectURL(data.background_image)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <PhotoIcon className="w-5 h-5 opacity-40" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setData('background_image', e.target.files[0])}
                                        accept="image/*"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                                        placeholder="Nama kategori..."
                                        required
                                    />
                                    {errors.name && <p className="text-[10px] text-brand-red font-bold uppercase tracking-widest">{errors.name}</p>}
                                    {errors.background_image && <p className="text-[10px] text-brand-red font-bold uppercase tracking-widest">{errors.background_image}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="p-3 bg-brand-gold text-brand-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-gold/20 disabled:opacity-50 self-start"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="px-8 py-6 bg-black/2 dark:bg-white/2 border-t border-black/5 dark:border-white/5 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-brand-black dark:bg-brand-white/10 text-white dark:text-brand-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
                        >
                            Selesai
                        </button>
                    </div>
                </div>

                <DeleteConfirmModal
                    isOpen={deleteModal.show}
                    onClose={() => setDeleteModal({ show: false, id: null, name: '' })}
                    onConfirm={confirmDelete}
                    title="Hapus Kategori"
                    message={`Yakin ingin menghapus kategori "${deleteModal.name}"? Semua sub-kategori dan paket di dalamnya akan ikut terhapus.`}
                    processing={deleting}
                />
            </div>
        </div>
    );
}
