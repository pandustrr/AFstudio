import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, Head, router } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, CalendarDaysIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

export default function Index({ photographers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFG, setEditingFG] = useState(null);
    const [deleteFG, setDeleteFG] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: ''
    });

    const [processing, setProcessing] = useState(false);

    const openModal = (fg = null) => {
        setEditingFG(fg);
        setFormData({
            name: fg ? fg.name : '',
            username: fg ? fg.username : '',
            password: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFG(null);
        setFormData({ name: '', username: '', password: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        if (editingFG) {
            router.put(`/admin/photographers/${editingFG.id}`, formData, {
                onSuccess: () => closeModal(),
                onFinish: () => setProcessing(false)
            });
        } else {
            router.post('/admin/photographers', formData, {
                onSuccess: () => closeModal(),
                onFinish: () => setProcessing(false)
            });
        }
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
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 leading-none">Username: <span className="text-brand-gold font-mono uppercase">{fg.username}</span></p>
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

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="fixed inset-0 bg-black/60" onClick={closeModal} />
                    <div className="relative bg-white dark:bg-brand-black w-full max-w-md rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden transform transition-all">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                                    {editingFG ? 'Edit Fotografer' : 'Tambah Fotografer'}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                                    <XMarkIcon className="w-5 h-5 text-brand-black/40" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2 px-1">Nama Lengkap</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon className="h-4 w-4 text-brand-black/20 transition-colors group-focus-within:text-brand-gold" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Nama Fotografer"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2 px-1">Username (Untuk Login)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <KeyIcon className="h-4 w-4 text-brand-black/20 transition-colors group-focus-within:text-brand-gold" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="username_fg"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-mono font-bold transition-all uppercase"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2 px-1">
                                        {editingFG ? 'Password Baru (Kosongkan jika tetap)' : 'Password'}
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <KeyIcon className="h-4 w-4 text-brand-black/20 transition-colors group-focus-within:text-brand-gold" />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold transition-all"
                                            required={!editingFG}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : (editingFG ? 'Update Fotografer' : 'Daftarkan Fotografer')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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
