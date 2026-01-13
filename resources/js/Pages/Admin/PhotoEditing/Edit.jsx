import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ session }) {
    const { data, setData, put, processing, errors } = useForm({
        customer_name: session.customer_name,
        raw_folder_id: session.raw_folder_id,
        edited_folder_id: session.edited_folder_id || '',
        max_edit_requests: session.max_edit_requests,
        status: session.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/photo-editing/${session.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${session.uid}`} />

            <div className="pt-12 lg:pt-20 pb-20 px-6 max-w-4xl mx-auto">
                <div className="mb-12">
                    <Link href="/admin/photo-editing" className="text-brand-red text-[10px] font-black uppercase tracking-widest hover:underline mb-4 inline-block">← Kembali ke Daftar</Link>
                    <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">Edit Request: {session.uid}</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-10 shadow-2xl space-y-8 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Nama Pelanggan</label>
                            <input
                                type="text"
                                value={data.customer_name}
                                onChange={e => setData('customer_name', e.target.value)}
                                className="w-full bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-bold uppercase tracking-tight"
                            />
                            {errors.customer_name && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.customer_name}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Status Request</label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="w-full bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-black uppercase tracking-widest text-[10px]"
                            >
                                <option value="pending">PENDING</option>
                                <option value="processing">PROCESSING</option>
                                <option value="done">DONE</option>
                                <option value="cancelled">CANCELLED</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.status}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Raw Folder (Google Drive ID)</label>
                            <input
                                type="text"
                                value={data.raw_folder_id}
                                onChange={e => setData('raw_folder_id', e.target.value)}
                                className="w-full bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-mono"
                            />
                            {errors.raw_folder_id && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.raw_folder_id}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Result Folder (Google Drive ID)</label>
                            <input
                                type="text"
                                value={data.edited_folder_id}
                                onChange={e => setData('edited_folder_id', e.target.value)}
                                className="w-full bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-mono"
                                placeholder="Link folder hasil edit"
                            />
                            {errors.edited_folder_id && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.edited_folder_id}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Max Edit Requests</label>
                            <input
                                type="number"
                                value={data.max_edit_requests}
                                onChange={e => setData('max_edit_requests', e.target.value)}
                                className="w-full bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-bold"
                            />
                            {errors.max_edit_requests && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.max_edit_requests}</p>}
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-brand-red hover:bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl shadow-brand-red/20 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Perbarui Request'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
