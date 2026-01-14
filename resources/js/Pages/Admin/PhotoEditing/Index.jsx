import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import EditModal from './EditModal';
import ViewModal from './ViewModal';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';


export default function Index({ sessions }) {
    const [viewSession, setViewSession] = useState(null);
    const [editSession, setEditSession] = useState(null);
    const [deleteSession, setDeleteSession] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteSession) return;

        setIsDeleting(true);
        router.delete(`/admin/photo-editing/${deleteSession.id}`, {
            onSuccess: () => {
                setDeleteSession(null);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Requests" />

            <div className="pt-12 lg:pt-20 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-2">Daftar Request</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">Kelola akses gallery dan request user.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">UID / Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Drive Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Progress</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr key={session.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1">{session.customer_name}</div>
                                        <div className="text-[10px] font-mono text-brand-red font-black tracking-widest opacity-80">{session.uid}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${session.raw_folder_id ? 'bg-green-500' : 'bg-black/10 dark:bg-white/10'}`}></span>
                                                {session.raw_folder_id ? (
                                                    <a
                                                        href={session.raw_folder_id.startsWith('http') ? session.raw_folder_id : `https://drive.google.com/drive/folders/${session.raw_folder_id}`}
                                                        target="_blank"
                                                        className="text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white hover:text-brand-gold transition-all"
                                                    >
                                                        Mentahan: OPEN LINK
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/20 dark:text-brand-white/20">Mentahan: Belum diset</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${session.edited_folder_id ? 'bg-blue-500' : 'bg-black/10 dark:bg-white/10'}`}></span>
                                                {session.edited_folder_id ? (
                                                    <a
                                                        href={session.edited_folder_id.startsWith('http') ? session.edited_folder_id : `https://drive.google.com/drive/folders/${session.edited_folder_id}`}
                                                        target="_blank"
                                                        className="text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white hover:text-brand-gold transition-all"
                                                    >
                                                        Editing: OPEN LINK
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/20 dark:text-brand-white/20">Editing: Belum diset</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-block px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${session.status === 'done' ? 'bg-green-100 text-green-700' :
                                            session.status === 'processing' ? 'bg-brand-gold/20 text-brand-gold' :
                                                'bg-black/5 dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40'
                                            }`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setViewSession(session)}
                                                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-brand-gold rounded-lg transition-all"
                                                title="Lihat Detail"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditSession(session)}
                                                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-brand-gold rounded-lg transition-all"
                                                title="Edit Request"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteSession(session)}
                                                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-brand-red hover:text-white rounded-lg transition-all"
                                                title="Hapus"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {sessions.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest">Tidak ada request ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            <ViewModal
                session={viewSession}
                onClose={() => setViewSession(null)}
            />

            {/* Modal Edit Section */}
            {editSession && (
                <EditModal
                    session={editSession}
                    onClose={() => setEditSession(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={!!deleteSession}
                onClose={() => setDeleteSession(null)}
                onConfirm={handleDelete}
                processing={isDeleting}
                title="Hapus Request"
                message={`Apakah Anda yakin ingin menghapus request dari ${deleteSession?.customer_name}? Data foto dan seleksi akan ikut terhapus.`}
            />
        </AdminLayout>
    );
}
