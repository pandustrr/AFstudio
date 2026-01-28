import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, Head, router } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TrashIcon, CalendarDaysIcon, UserIcon } from '@heroicons/react/24/outline';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import Edit from './Edit';

export default function Index({ photographers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFG, setEditingFG] = useState(null);
    const [deleteFG, setDeleteFG] = useState(null);
    const [processing, setProcessing] = useState(false);

    const openModal = (fg = null) => {
        setEditingFG(fg);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFG(null);
    };

    const handleDelete = () => {
        if (!deleteFG) return;
        setProcessing(true);
        router.delete(`/admin/photographers/${deleteFG.id}`, {
            onSuccess: () => setDeleteFG(null),
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Photographers" />

            <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1 leading-none">Manage Photographer</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-black uppercase tracking-widest leading-none">Kelola akun dan daftar fotografer aktif.</p>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="bg-brand-black dark:bg-brand-gold text-brand-white dark:text-brand-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-100"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span className="font-black uppercase text-[9px] tracking-widest">Tambah Fotografer</span>
                    </button>
                </div>

                <div className="grid gap-3">
                    {photographers.map((fg) => (
                        <div
                            key={fg.id}
                            className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-black/20 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:border-brand-gold/50 transition-colors">
                                    <UserIcon className="w-6 h-6 text-brand-gold" />
                                </div>
                                <div>
                                    <h3 className="font-black text-brand-black dark:text-brand-white uppercase tracking-tighter text-base leading-none mb-1.5">{fg.name}</h3>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 leading-none">
                                            Username: <span className="text-brand-gold font-mono uppercase">{fg.username}</span>
                                        </p>
                                        {fg.phone && (
                                            <a
                                                href={`https://wa.me/${fg.phone.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[9px] font-black uppercase tracking-widest text-brand-black/30 dark:text-brand-white/30 hover:text-green-500 transition-colors flex items-center gap-1"
                                            >
                                                WA: <span className="font-mono">{fg.phone}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/photographer-sessions?photographer_id=${fg.id}`}
                                    className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl hover:bg-brand-gold hover:text-brand-black transition-all group/btn"
                                    title="Kelola Jadwal Sesi"
                                >
                                    <CalendarDaysIcon className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => openModal(fg)}
                                    className="p-3 bg-black/5 dark:bg-white/5 text-brand-black dark:text-brand-white rounded-xl hover:bg-brand-gold hover:text-brand-black transition-all"
                                >
                                    <PencilSquareIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setDeleteFG(fg)}
                                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-center"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {photographers.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
                            <UserIcon className="w-12 h-12 mx-auto text-brand-black/10 mb-4" />
                            <p className="text-brand-black/40 dark:text-brand-white/40 font-black uppercase text-[10px] tracking-widest">Belum ada akun fotografer.</p>
                        </div>
                    )}
                </div>
            </div>

            <Edit
                isOpen={isModalOpen}
                onClose={closeModal}
                photographer={editingFG}
            />

            <DeleteConfirmModal
                isOpen={!!deleteFG}
                onClose={() => setDeleteFG(null)}
                onConfirm={handleDelete}
                processing={processing}
                title="Hapus Fotografer"
                message={`Apakah Anda yakin ingin menghapus akun ${deleteFG?.name}? Semua data sesi mereka akan tetap tersimpan namun akun tidak bisa digunakan.`}
            />
        </AdminLayout>
    );
}
