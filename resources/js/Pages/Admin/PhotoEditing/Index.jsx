import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'; // Removed PlusIcon

export default function Index({ sessions }) {
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus request ini?')) {
            router.delete(`/admin/photo-editing/${id}`); // Updated route
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

                <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
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
                                        <div className="font-mono text-brand-red font-black text-sm mb-1">{session.uid}</div>
                                        <div className="text-xs font-bold text-brand-black dark:text-brand-white uppercase tracking-tight">{session.customer_name}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-2 h-2 rounded-full ${session.raw_folder_id ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-[10px] font-bold uppercase text-brand-black/60 dark:text-brand-white/60">Mentahan</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-2 h-2 rounded-full ${session.edited_folder_id ? 'bg-green-500' : 'bg-black/20 dark:bg-white/20'}`}></span>
                                                <span className="text-[10px] font-bold uppercase text-brand-black/60 dark:text-brand-white/60">Result</span>
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
                                            <Link
                                                href={`/admin/photo-editing/${session.id}`}
                                                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-brand-gold hover:text-white rounded-lg transition-all"
                                                title="Lihat Detail"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/photo-editing/${session.id}/edit`}
                                                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-brand-gold hover:text-white rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </Link>
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
        </AdminLayout>
    );
}
