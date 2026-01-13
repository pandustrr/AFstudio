import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import EditModal from './EditModal';

export default function Index({ sessions }) {
    const [viewSession, setViewSession] = useState(null);
    const [editSession, setEditSession] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus request ini?')) {
            router.delete(`/admin/photo-editing/${id}`);
        }
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
                                                onClick={() => handleDelete(session.id)}
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
            {viewSession && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0" onClick={() => setViewSession(null)}></div>
                    <div className="relative bg-white dark:bg-brand-black border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] animate-fade-in">
                        <div className="sticky top-0 bg-white/80 dark:bg-brand-black/80 backdrop-blur-md px-8 py-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">Edit Requests: {viewSession.uid}</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">{viewSession.customer_name}</p>
                            </div>
                            <button onClick={() => setViewSession(null)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {(viewSession.edit_requests || []).length > 0 ? (
                                viewSession.edit_requests.map((request, idx) => {
                                    const photos = request.selected_photos || [];
                                    return (
                                        <div key={idx} className="bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Request #{idx + 1}</div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[9px] font-bold text-brand-black/40 dark:text-brand-white/40">{new Date(request.created_at).toLocaleString()}</span>
                                                    <button
                                                        onClick={() => {
                                                            const text = (photos).map(p => typeof p === 'object' ? (p.name || p.filename || 'No Name') : p).join('\n');
                                                            navigator.clipboard.writeText(text);
                                                            alert('Berhasil disalin!');
                                                        }}
                                                        className="px-3 py-1 bg-brand-gold text-brand-black rounded-lg text-[8px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                                                    >
                                                        Copy List
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {photos.map((photo, pIdx) => (
                                                    <div key={pIdx} className="bg-white/50 dark:bg-white/5 p-2 rounded-lg border border-black/5 dark:border-white/5">
                                                        <p className="text-[8px] font-mono font-bold text-brand-black/60 dark:text-brand-white/60 truncate">
                                                            {typeof photo === 'object' ? (photo.name || photo.filename || 'Unnamed') : photo}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl">
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">Belum ada request edit.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal Component */}
            {editSession && (
                <EditModal
                    session={editSession}
                    onClose={() => setEditSession(null)}
                />
            )}
        </AdminLayout>
    );
}
