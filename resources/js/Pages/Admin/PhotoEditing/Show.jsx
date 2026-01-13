import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default function Show({ session }) {
    return (
        <AdminLayout>
            <Head title={`Detail ${session.uid}`} />

            <div className="pt-12 lg:pt-20 pb-20 px-6 max-w-7xl mx-auto">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <Link href="/admin/photo-editing" className="text-brand-red text-[10px] font-black uppercase tracking-widest hover:underline mb-4 inline-block">← Daftar Request</Link>
                        <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">Request Edit: {session.uid}</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">{session.customer_name}</p>
                    </div>
                    <Link
                        href={`/admin/photo-editing/${session.id}/edit`}
                        className="bg-brand-gold hover:bg-black text-brand-black hover:text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-brand-gold/10"
                    >
                        Edit Request
                    </Link>
                </div>

                <div className="space-y-6">
                    {/* Edit Requests */}
                    <div className="flex items-center space-x-4 mb-2">
                        <PencilSquareIcon className="w-6 h-6 text-brand-red" />
                        <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">Edit Requests</h2>
                    </div>

                    {session.edit_requests?.length > 0 ? (
                        session.edit_requests.map((request, idx) => (
                            <div key={idx} className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Request #{idx + 1}</div>
                                    <div className="text-[10px] font-bold text-brand-black/40 dark:text-brand-white/40">{new Date(request.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {Array.isArray(request.selected_photos) && request.selected_photos.map((photo, pIdx) => (
                                        <div key={pIdx} className="bg-black/5 dark:bg-white/5 p-2 rounded-lg text-center truncate border border-black/5 dark:border-white/5">
                                            <p className="text-[9px] font-mono font-bold text-brand-black/60 dark:text-brand-white/60">{photo}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-black/2 dark:bg-white/2 rounded-3xl p-12 text-center border border-dashed border-black/10 dark:border-white/10">
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">Belum ada request edit.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
