import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, Head, router } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

export default function Index({ rooms }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [deleteRoom, setDeleteRoom] = useState(null);
    const [label, setLabel] = useState('');
    const [processing, setProcessing] = useState(false);

    const openModal = (room = null) => {
        setEditingRoom(room);
        setLabel(room ? room.label : '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
        setLabel('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        if (editingRoom) {
            router.put(`/admin/rooms/${editingRoom.id}`, { label }, {
                onSuccess: () => closeModal(),
                onFinish: () => setProcessing(false)
            });
        } else {
            router.post('/admin/rooms', { label }, {
                onSuccess: () => closeModal(),
                onFinish: () => setProcessing(false)
            });
        }
    };

    const handleDelete = () => {
        if (!deleteRoom) return;
        setProcessing(true);
        router.delete(`/admin/rooms/${deleteRoom.id}`, {
            onSuccess: () => setDeleteRoom(null),
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Rooms" />

            <div className="pt-24 pb-20 px-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1 leading-none">Manage Rooms</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-black uppercase tracking-widest leading-none">Tambahkan atau ubah daftar ruangan studio.</p>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="bg-brand-black dark:bg-brand-gold text-brand-white dark:text-brand-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-100"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span className="font-black uppercase text-[9px] tracking-widest">Tambah Room</span>
                    </button>
                </div>

                <div className="grid gap-3">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 dark:bg-black/20 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:border-brand-gold/50 transition-colors">
                                    <span className="font-black text-brand-gold text-sm">{room.id}</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-brand-black dark:text-brand-white uppercase tracking-tighter text-base leading-none mb-1">{room.label}</h3>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-black/20 dark:text-brand-white/20 leading-none">Slug: {room.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <Link
                                    href={`/admin/rooms/${room.id}/schedule`}
                                    className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-lg hover:bg-brand-gold hover:text-brand-black transition-all"
                                    title="Kelola Jadwal"
                                >
                                    <CalendarDaysIcon className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => openModal(room)}
                                    className="p-2.5 bg-black/5 dark:bg-white/5 text-brand-black dark:text-brand-white rounded-lg hover:bg-brand-gold hover:text-brand-black transition-all"
                                >
                                    <PencilSquareIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeleteRoom(room)}
                                    className="p-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-center"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {rooms.length === 0 && (
                        <div className="py-12 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
                            <p className="text-brand-black/40 dark:text-brand-white/40 font-black uppercase text-[9px] tracking-widest">Belum ada ruangan.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
                    <div className="fixed inset-0 bg-black/60" onClick={closeModal} />
                    <div className="relative bg-white dark:bg-brand-black w-full max-w-md rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden transform transition-all">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                                    {editingRoom ? 'Edit Room' : 'Tambah Room'}
                                </h2>
                                <button onClick={closeModal} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                                    <XMarkIcon className="w-5 h-5 text-brand-black/40" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-1.5 px-1">Nama / Label Ruangan</label>
                                    <input
                                        type="text"
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                        placeholder="Contoh: Room 1, Studio A..."
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border-0 rounded-xl focus:ring-1 focus:ring-brand-gold text-xs font-bold transition-all shadow-inner"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black py-3 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : (editingRoom ? 'Update Room' : 'Simpan Room')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={!!deleteRoom}
                onClose={() => setDeleteRoom(null)}
                onConfirm={handleDelete}
                processing={processing}
                title="Hapus Room"
                message={`Apakah Anda yakin ingin menghapus ${deleteRoom?.label}?`}
            />
        </AdminLayout>
    );
}
