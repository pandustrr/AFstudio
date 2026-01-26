import React, { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function PackageModal({ isOpen, onClose, pkg, subCategoryId, onSuccess }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        price_display: '',
        price_numeric: '',
        features: [],
        sub_category_id: '',
        is_popular: false,
        max_sessions: 1,
        max_editing_quota: 0,
    });

    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        if (pkg) {
            setData({
                name: pkg.name || '',
                price_display: pkg.price_display || '',
                price_numeric: pkg.price_numeric || '',
                features: pkg.features || [],
                sub_category_id: pkg.sub_category_id || '',
                is_popular: pkg.is_popular || false,
                max_sessions: pkg.max_sessions || 1,
                max_editing_quota: pkg.max_editing_quota || 0,
            });
        } else {
            reset();
            setData('sub_category_id', subCategoryId || '');
        }
    }, [pkg, subCategoryId]);

    const addFeature = () => {
        if (newFeature.trim()) {
            setData('features', [...data.features, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const removeFeature = (index) => {
        const updated = [...data.features];
        updated.splice(index, 1);
        setData('features', updated);
    };

    const submit = (e) => {
        e.preventDefault();

        // Convert to proper types before submission
        const submitData = {
            ...data,
            max_sessions: parseInt(data.max_sessions) || 1,
            max_editing_quota: parseInt(data.max_editing_quota) || 0,
            price_numeric: data.price_numeric ? parseFloat(data.price_numeric) : null,
            is_popular: Boolean(data.is_popular),
        };

        if (pkg) {
            router.put(`/admin/pricelist/package/${pkg.id}`, submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    if (onSuccess) {
                        onSuccess('Paket berhasil diperbarui!', 'success');
                    }
                    onClose();
                },
                onError: (errors) => {
                    if (onSuccess) {
                        onSuccess('Gagal memperbarui paket!', 'error');
                    }
                },
            });
        } else {
            router.post('/admin/pricelist/package', submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    if (onSuccess) {
                        onSuccess('Paket berhasil ditambahkan!', 'success');
                    }
                    onClose();
                },
                onError: (errors) => {
                    if (onSuccess) {
                        onSuccess('Gagal menambahkan paket!', 'error');
                    }
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-black/60" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-brand-black w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/5">
                <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                    <h3 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                        {pkg ? 'Edit Paket' : 'Tambah Paket'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                    {/* Nama Paket */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">Nama Paket</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                            placeholder="Contoh: Basic, Exclusive"
                            required
                        />
                        {errors.name && <p className="mt-1 text-[10px] text-brand-red font-bold uppercase tracking-widest">{errors.name}</p>}
                    </div>

                    {/* Harga Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">Harga (Angka)</label>
                            <input
                                type="number"
                                value={data.price_numeric}
                                onChange={(e) => setData('price_numeric', e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                                placeholder="Contoh: 500000"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">Label Harga (Display)</label>
                            <input
                                type="text"
                                value={data.price_display}
                                onChange={(e) => setData('price_display', e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                                placeholder="Contoh: 500k atau GRATIS"
                                required
                            />
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">Maks Sesi</label>
                            <input
                                type="number"
                                min="1"
                                value={data.max_sessions}
                                onChange={(e) => setData('max_sessions', e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">Kuota Editing</label>
                            <input
                                type="number"
                                min="0"
                                value={data.max_editing_quota}
                                onChange={(e) => setData('max_editing_quota', e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                                required
                            />
                            <p className="text-[8px] text-brand-black/40 dark:text-brand-white/40 mt-1.5">0 = Tidak bisa edit</p>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">&nbsp;</label>
                            <div className="flex items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl h-[44px]">
                                <input
                                    type="checkbox"
                                    id="is_popular"
                                    checked={data.is_popular}
                                    onChange={(e) => setData('is_popular', e.target.checked)}
                                    className="w-5 h-5 rounded border-0 bg-black/10 dark:bg-white/10 text-brand-gold focus:ring-brand-gold"
                                />
                                <label htmlFor="is_popular" className="text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white cursor-pointer select-none">Populer</label>
                            </div>
                        </div>
                    </div>

                    {/* Fitur / Points */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">Fitur / Points</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                className="flex-1 bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                                placeholder="Tambah poin fitur baru..."
                            />
                            <button
                                type="button"
                                onClick={addFeature}
                                className="p-3 bg-brand-gold text-brand-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-gold/20"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-xl group transition-all hover:border-brand-gold/30">
                                    <span className="text-[10px] font-bold text-brand-black dark:text-brand-white uppercase tracking-wide">{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="p-1 text-brand-black/20 dark:text-brand-white/20 hover:text-brand-red transition-all"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {data.features.length === 0 && (
                                <p className="text-center py-8 text-[10px] font-bold text-brand-black/20 dark:text-brand-white/20 uppercase tracking-widest border-2 border-dashed border-black/5 dark:border-white/5 rounded-xl">Belum ada fitur</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Paket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
