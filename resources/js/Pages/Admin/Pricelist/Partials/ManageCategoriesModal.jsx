import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { XMarkIcon, TrashIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function ManageCategoriesModal({ isOpen, onClose, categories }) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
    });

    const handleAdd = (e) => {
        e.preventDefault();
        post('/admin/pricelist/category', {
            onSuccess: () => reset(),
        });
    };

    const handleUpdate = (id) => {
        if (!editName.trim()) return;
        router.put(`/admin/pricelist/category/${id}`, { name: editName }, {
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus kategori ${name}? Semua sub-kategori dan paket di dalamnya akan ikut terhapus.`)) {
            router.delete(`/admin/pricelist/category/${id}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-black/60" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-brand-black w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/5">
                <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                    <h3 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                        Kelola Kategori
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* List of Categories */}
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Daftar Kategori Utama</label>
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center gap-3 p-3 bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl group transition-all hover:border-brand-gold/30">
                                {editingId === category.id ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="flex-1 bg-white dark:bg-white/5 border-0 rounded-xl px-4 py-2 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold"
                                        autoFocus
                                        onBlur={() => handleUpdate(category.id)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(category.id)}
                                    />
                                ) : (
                                    <div
                                        className="flex-1 text-sm font-bold text-brand-black dark:text-brand-white px-4 cursor-pointer"
                                        onClick={() => {
                                            setEditingId(category.id);
                                            setEditName(category.name);
                                        }}
                                    >
                                        {category.name}
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    {editingId === category.id ? (
                                        <button
                                            onClick={() => handleUpdate(category.id)}
                                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
                                            className="p-2 text-brand-black/20 dark:text-brand-white/20 hover:text-brand-red rounded-lg transition-all"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New Category */}
                    <div className="pt-6 border-t border-black/5 dark:border-white/5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-3">Tambah Kategori Baru</label>
                        <form onSubmit={handleAdd} className="flex gap-2">
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="flex-1 bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                                placeholder="Nama kategori..."
                                required
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="p-3 bg-brand-gold text-brand-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-gold/20 disabled:opacity-50"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </form>
                        {errors.name && <p className="mt-1 text-[10px] text-brand-red font-bold uppercase tracking-widest">{errors.name}</p>}
                    </div>
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
        </div>
    );
}
