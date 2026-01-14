import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CategoryModal({ isOpen, onClose, category }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
    });

    useEffect(() => {
        if (category) {
            setData('name', category.name);
        } else {
            reset();
        }
    }, [category]);

    const submit = (e) => {
        e.preventDefault();
        if (category) {
            put(`/admin/pricelist/category/${category.id}`, {
                onSuccess: () => onClose(),
            });
        } else {
            post('/admin/pricelist/category', {
                onSuccess: () => onClose(),
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-black/60" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-brand-black w-full max-w-md rounded-3xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/5">
                <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                    <h3 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                        {category ? 'Edit Kategori' : 'Tambah Kategori'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">Nama Kategori</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-sm font-bold text-brand-black dark:text-brand-white focus:ring-2 focus:ring-brand-gold transition-all"
                            placeholder="Contoh: Wedding, Graduation, dsb"
                            required
                        />
                        {errors.name && <p className="mt-1 text-[10px] text-brand-red font-bold uppercase tracking-widest">{errors.name}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                    </button>
                </form>
            </div>
        </div>
    );
}
