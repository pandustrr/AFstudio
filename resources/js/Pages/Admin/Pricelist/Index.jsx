import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, BanknotesIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

export default function Index({ pricelists }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        price: '',
        discount_price: '',
        description: '',
        features_text: '', // Helper for textarea input, will be converted to array
        is_popular: false,
        is_active: true,
    });

    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingItem(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setIsEditMode(true);
        setEditingItem(item);
        setData({
            name: item.name,
            price: item.price,
            discount_price: item.discount_price || '',
            description: item.description || '',
            features_text: (item.features || []).join('\n'),
            is_popular: Boolean(item.is_popular),
            is_active: Boolean(item.is_active),
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Transform text area features to array
        const featuresArray = data.features_text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const payload = {
            ...data,
            features: featuresArray
        };

        if (isEditMode) {
            router.put(`/admin/pricelist/${editingItem.id}`, payload, {
                onSuccess: () => closeModal(),
            });
        } else {
            router.post('/admin/pricelist', payload, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        if (deleteItem) {
            router.delete(`/admin/pricelist/${deleteItem.id}`, {
                onSuccess: () => setDeleteItem(null),
            });
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };


    return (
        <AdminLayout>
            <Head title="Pricelist" />

            <div className="pt-12 lg:pt-20 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-2">Pricelist</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">Atur paket harga dan layanan.</p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-black rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-gold/10"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Tambah Paket</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pricelists.map((item) => (
                        <div key={item.id} className="group relative bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden hover:border-brand-gold transition-colors">
                            {/* Popular Badge */}
                            {item.is_popular && (
                                <div className="absolute top-4 right-4 bg-brand-gold text-brand-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    Popular
                                </div>
                            )}

                            <div className="p-6 md:p-8">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-brand-black dark:text-brand-white mb-2">{item.name}</h3>
                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold mb-6 line-clamp-2 min-h-[32px]">
                                    {item.description || 'Tidak ada deskripsi'}
                                </p>

                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-3xl font-black text-brand-black dark:text-brand-white">
                                        {formatCurrency(item.price)}
                                    </span>
                                    {item.discount_price && (
                                        <span className="text-sm font-bold text-brand-black/40 dark:text-brand-white/40 line-through decoration-brand-red">
                                            {formatCurrency(item.discount_price)}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3 mb-8 min-h-[120px]">
                                    {(item.features || []).slice(0, 4).map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckBadgeIcon className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                                            <span className="text-xs font-bold text-brand-black/60 dark:text-brand-white/60">{feature}</span>
                                        </div>
                                    ))}
                                    {(item.features || []).length > 4 && (
                                        <p className="text-[10px] font-bold text-brand-black/40 dark:text-brand-white/40 pl-7">
                                            + {(item.features || []).length - 4} fitur lainnya
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-6 border-t border-black/5 dark:border-white/5">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="flex-1 py-3 flex justify-center items-center gap-2 bg-black/5 dark:bg-white/5 rounded-xl hover:bg-black hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-black transition-all group-hover/btn"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => setDeleteItem(item)}
                                        className="py-3 px-4 flex justify-center items-center bg-black/5 dark:bg-white/5 text-brand-red rounded-xl hover:bg-brand-red hover:text-white transition-all"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="relative bg-white dark:bg-brand-black p-8 rounded-2xl overflow-hidden">
                    <button onClick={closeModal} className="absolute top-6 right-6 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                        <XMarkIcon className="w-6 h-6 text-brand-black dark:text-brand-white" />
                    </button>

                    <div className="mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">
                            {isEditMode ? 'Edit Paket' : 'Tambah Paket Baru'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <InputLabel value="Nama Paket" />
                                <TextInput
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full mt-1"
                                    placeholder="Contoh: Basic Package"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <InputLabel value="Harga Normal (IDR)" />
                                <TextInput
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full mt-1"
                                    placeholder="0"
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <InputLabel value="Harga Diskon (Opsional)" />
                                <TextInput
                                    type="number"
                                    value={data.discount_price}
                                    onChange={(e) => setData('discount_price', e.target.value)}
                                    className="w-full mt-1"
                                    placeholder="0"
                                />
                                {errors.discount_price && <p className="text-red-500 text-xs mt-1">{errors.discount_price}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Deskripsi Singkat" />
                                <TextArea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full mt-1 h-20"
                                    placeholder="Deskripsi singkat paket..."
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-1">
                                    <InputLabel value="Fitur Paket" />
                                    <span className="text-[10px] text-brand-black/40 dark:text-brand-white/40">*Satu fitur per baris</span>
                                </div>
                                <TextArea
                                    value={data.features_text}
                                    onChange={(e) => setData('features_text', e.target.value)}
                                    className="w-full mt-1 h-32 font-mono text-sm"
                                    placeholder="- 5 Foto Editor&#10;- Revisi 2x&#10;- File HD"
                                />
                                {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features}</p>}
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_popular}
                                        onChange={(e) => setData('is_popular', e.target.checked)}
                                        className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                                    />
                                    <span className="text-sm font-bold text-brand-black dark:text-brand-white">Set as Popular</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                                    />
                                    <span className="text-sm font-bold text-brand-black dark:text-brand-white">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Batal
                            </button>
                            <PrimaryButton disabled={processing} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            <DeleteConfirmModal
                isOpen={!!deleteItem}
                onClose={() => setDeleteItem(null)}
                onConfirm={handleDelete}
                title="Hapus Paket"
                message={`Apakah Anda yakin ingin menghapus paket "${deleteItem?.name}"?`}
            />
        </AdminLayout>
    );
}
