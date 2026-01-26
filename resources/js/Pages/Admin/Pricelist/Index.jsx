import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PencilSquareIcon, TrashIcon, PlusIcon, ChevronRightIcon, ChevronDownIcon, StarIcon, ShareIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import ManageCategoriesModal from './Partials/ManageCategoriesModal';
import SubCategoryModal from './Partials/SubCategoryModal';
import PackageModal from './Partials/PackageModal';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import EditNotif from '@/Components/EditNotif';

export default function Index({ categories }) {
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || null);

    // Modal States
    const [manageCategoriesModal, setManageCategoriesModal] = useState(false);
    const [subCategoryModal, setSubCategoryModal] = useState({ show: false, subCategory: null, categoryId: null });
    const [packageModal, setPackageModal] = useState({ show: false, pkg: null, subCategoryId: null });
    const [deleteModal, setDeleteModal] = useState({ show: false, type: '', id: null, title: '', message: '' });

    // Notification State
    const [showNotif, setShowNotif] = useState(false);
    const [notifMessage, setNotifMessage] = useState('');
    const [notifType, setNotifType] = useState('success');

    const handleNotification = (message, type = 'success') => {
        setNotifMessage(message);
        setNotifType(type);
        setShowNotif(true);
    };

    const handleDelete = () => {
        const { type, id } = deleteModal;
        let url = '';
        if (type === 'sub-category') url = `/admin/pricelist/sub-category/${id}`;
        if (type === 'package') url = `/admin/pricelist/package/${id}`;

        router.delete(url, {
            onSuccess: () => setDeleteModal({ ...deleteModal, show: false }),
        });
    };

    const formatPrice = (price) => {
        if (!price) return '';
        const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(numericPrice);
    };

    const formatSessionDuration = (maxSessions) => {
        if (!maxSessions) return '';
        // 1 session = 30 menit
        const totalMinutes = maxSessions * 30;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            handleNotification('Tautan berhasil disalin!', 'success');
        } catch (err) {
            console.error('Failed to copy: ', err);
            handleNotification('Gagal menyalin tautan!', 'error');
        }
    };

    const getShareLink = (type, slug) => {
        const baseUrl = window.location.origin;
        if (type === 'all') return `${baseUrl}/share/SemuaKategori`;
        if (type === 'category') return `${baseUrl}/share/c/${slug}`;
        if (type === 'sub-category') return `${baseUrl}/share/s/${slug}`;
        if (type === 'package') return `${baseUrl}/share/p/${slug}`;
        return baseUrl;
    };

    // ...

    // IN RENDER:

    // ...

    return (
        <AdminLayout>
            <Head title="Kelola Pricelist" />

            <div className="pt-12 lg:pt-20 pb-20 px-6 max-w-7xl mx-auto">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-2 italic">Pricelist</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">Kelola kategori, sub-kategori, dan paket harga AFstudio.</p>
                    </div>
                    <button
                        onClick={() => copyToClipboard(getShareLink('all'))}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                        <ShareIcon className="w-4 h-4" />
                        Bagikan Semua
                    </button>
                </div>

                {/* Tabs for Categories & Category/Sub-Category Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-wrap gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl w-fit">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategoryId(category.id)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategoryId === category.id
                                        ? 'bg-white dark:bg-white/10 text-brand-black dark:text-brand-white shadow-sm'
                                        : 'text-brand-black/40 dark:text-brand-white/40 hover:text-brand-black dark:hover:text-brand-white'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setManageCategoriesModal(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Kelola Kategori
                        </button>
                    </div>

                    {activeCategoryId && (
                        <button
                            onClick={() => setSubCategoryModal({ show: true, subCategory: null, categoryId: activeCategoryId })}
                            className="flex items-center gap-2 px-5 py-3 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Tambah Sub-Kategori
                        </button>
                    )}
                </div>

                {/* Category Content */}
                {categories.filter(c => c.id === activeCategoryId).map(category => (
                    <div key={category.id} className="space-y-8">
                        {/* CATEGORY SHARE BUTTON HEADER */}
                        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                            <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter italic">
                                {category.name}
                            </h2>
                            <button
                                onClick={() => copyToClipboard(getShareLink('category', category.slug))}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all"
                            >
                                <ShareIcon className="w-4 h-4" />
                                Bagikan
                            </button>
                        </div>


                        <div className="grid grid-cols-1 gap-8">
                            {category.sub_categories.map(subCategory => (
                                <div key={subCategory.id} className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                                    <div className="px-8 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-black/2 dark:bg-white/2">
                                        <div>
                                            <h3 className="text-base font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">{subCategory.name}</h3>
                                            <p className="text-[9px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest">{subCategory.packages.length} Paket</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 border-r border-black/10 dark:border-white/10 pr-4 mr-2">
                                                <button
                                                    onClick={() => copyToClipboard(getShareLink('sub-category', subCategory.slug))}
                                                    className="p-1.5 bg-brand-gold/10 text-brand-gold rounded-lg hover:bg-brand-gold hover:text-brand-black transition-all"
                                                    title="Bagikan Sub-Kategori"
                                                >
                                                    <ShareIcon className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => setSubCategoryModal({ show: true, subCategory, categoryId: category.id })} className="p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-brand-gold rounded-lg transition-all"><PencilSquareIcon className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => setDeleteModal({
                                                    show: true,
                                                    type: 'sub-category',
                                                    id: subCategory.id,
                                                    title: 'Hapus Sub-Kategori',
                                                    message: `Hapus sub-kategori ${subCategory.name}? Semua paket di dalamnya akan ikut terhapus.`
                                                })} className="p-1.5 bg-black/5 dark:bg-white/5 hover:bg-brand-red hover:text-white rounded-lg transition-all"><TrashIcon className="w-3.5 h-3.5" /></button>
                                            </div>
                                            <button
                                                onClick={() => setPackageModal({ show: true, pkg: null, subCategoryId: subCategory.id })}
                                                className="flex items-center gap-2 px-4 py-2 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                            >
                                                <PlusIcon className="w-3 h-3" />
                                                Tambah Paket
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                            {subCategory.packages.map(pkg => (
                                                <div key={pkg.id} className={`relative p-4 rounded-2xl border transition-all group ${pkg.is_popular
                                                    ? 'bg-brand-black dark:bg-brand-gold border-transparent shadow-xl ring-4 ring-brand-gold/10'
                                                    : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-brand-gold/50'
                                                    }`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className={`text-xs font-black uppercase tracking-tighter line-clamp-1 ${pkg.is_popular ? 'text-white dark:text-brand-black' : 'text-brand-black dark:text-brand-white'}`}>
                                                                {pkg.name}
                                                            </h4>
                                                            <div className={`text-lg font-black mt-0.5 ${pkg.is_popular ? 'text-brand-gold dark:text-brand-black' : 'text-brand-gold'}`}>
                                                                {pkg.price_display ? pkg.price_display : (pkg.price_numeric ? formatPrice(pkg.price_numeric) : '')}
                                                            </div>
                                                            {pkg.max_sessions && (
                                                                <div className={`text-[8px] font-bold mt-1 ${pkg.is_popular ? 'text-white/70 dark:text-brand-black/70' : 'text-brand-black/50 dark:text-brand-white/50'}`}>
                                                                    {formatSessionDuration(pkg.max_sessions)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {pkg.is_popular && <StarIconSolid className="w-3.5 h-3.5 text-brand-gold dark:text-brand-black" />}
                                                    </div>

                                                    <ul
                                                        className="
                                                            space-y-1.5 mb-6
                                                            min-h-[60px]
                                                        "
                                                    >
                                                        {(pkg.features || []).slice(0, 4).map((feature, idx) => (
                                                            <li key={idx} className="flex items-start gap-1.5">
                                                                <ChevronRightIcon className={`w-2.5 h-2.5 mt-0.5 shrink-0 ${pkg.is_popular ? 'text-white/60 dark:text-brand-black/60' : 'text-brand-black/20 dark:text-brand-white/20'}`} />
                                                                <span className={`text-[9px] font-bold uppercase tracking-wide leading-tight line-clamp-1 ${pkg.is_popular ? 'text-white/80 dark:text-brand-black/80' : 'text-brand-black/60 dark:text-brand-white/60'}`}>
                                                                    {feature}
                                                                </span>
                                                            </li>
                                                        ))}
                                                        {(pkg.features || []).length > 4 && (
                                                            <li className={`text-[8px] font-black uppercase tracking-widest pl-4 ${pkg.is_popular ? 'text-white/40 dark:text-brand-black/40' : 'text-brand-black/30 dark:text-brand-white/30'}`}>
                                                                + {(pkg.features || []).length - 4} More
                                                            </li>
                                                        )}
                                                    </ul>

                                                    <div className="flex items-center gap-1.5 justify-end pt-3 border-t border-black/5 dark:border-white/5">



                                                        <button
                                                            onClick={() => setPackageModal({ show: true, pkg, subCategoryId: subCategory.id })}
                                                            className={`p-1.5 rounded-lg transition-all ${pkg.is_popular ? 'bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white dark:text-brand-black' : 'bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-brand-gold'}`}
                                                        >
                                                            <PencilSquareIcon className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteModal({
                                                                show: true,
                                                                type: 'package',
                                                                id: pkg.id,
                                                                title: 'Hapus Paket',
                                                                message: `Hapus paket ${pkg.name}?`
                                                            })}
                                                            className={`p-1.5 rounded-lg transition-all ${pkg.is_popular ? 'bg-white/10 dark:bg-black/10 hover:bg-brand-red text-white dark:text-brand-black' : 'bg-black/5 dark:bg-white/5 hover:bg-brand-red hover:text-white'}`}
                                                        >
                                                            <TrashIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {subCategory.packages.length === 0 && (
                                                <div className="col-span-full py-12 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl">
                                                    <p className="text-[10px] font-black text-brand-black/20 dark:text-brand-white/20 uppercase tracking-widest">Belum ada paket.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <EditNotif
                show={showNotif}
                onClose={() => setShowNotif(false)}
                message={notifMessage}
                type={notifType}
            />

            <ManageCategoriesModal
                isOpen={manageCategoriesModal}
                onClose={() => setManageCategoriesModal(false)}
                categories={categories}
                onSuccess={handleNotification}
            />
            <SubCategoryModal
                isOpen={subCategoryModal.show}
                onClose={() => setSubCategoryModal({ show: false, subCategory: null, categoryId: null })}
                subCategory={subCategoryModal.subCategory}
                categoryId={subCategoryModal.categoryId}
                onSuccess={handleNotification}
            />
            <PackageModal
                isOpen={packageModal.show}
                onClose={() => setPackageModal({ show: false, pkg: null, subCategoryId: null })}
                pkg={packageModal.pkg}
                subCategoryId={packageModal.subCategoryId}
                onSuccess={handleNotification}
            />
            <DeleteConfirmModal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ ...deleteModal, show: false })}
                onConfirm={handleDelete}
                title={deleteModal.title}
                message={deleteModal.message}
            />
        </AdminLayout >
    );
}
