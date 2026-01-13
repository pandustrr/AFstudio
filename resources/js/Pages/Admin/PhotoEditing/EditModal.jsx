import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function EditModal({ session, onClose }) {
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        customer_name: session.customer_name,
        raw_folder_id: session.raw_folder_id,
        edited_folder_id: session.edited_folder_id || '',
        max_edit_requests: session.max_edit_requests,
        status: session.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/photo-editing/${session.id}`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-brand-black border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] animate-fade-in">
                <div className="sticky top-0 bg-white/80 dark:bg-brand-black/80 backdrop-blur-md px-8 py-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">Edit Session</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-red">{session.uid}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 ml-2">Customer Name</label>
                        <div className="w-full bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 font-bold text-sm text-brand-black/40 dark:text-brand-white/40 cursor-not-allowed">
                            {data.customer_name}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 ml-2">Status</label>
                            <div className="relative group">
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/10 rounded-xl px-6 py-4 font-bold text-sm focus:outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer pr-12 group-hover:bg-black/5 dark:group-hover:bg-white/5"
                                >
                                    <option value="pending" className="bg-white dark:bg-brand-black">Pending</option>
                                    <option value="processing" className="bg-white dark:bg-brand-black">Processing</option>
                                    <option value="done" className="bg-white dark:bg-brand-black">Done</option>
                                    <option value="cancelled" className="bg-white dark:bg-brand-black">Cancelled</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-black/20 dark:text-brand-white/20 group-hover:text-brand-gold transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.status && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.status}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 ml-2">Max Requests</label>
                            <input
                                type="number"
                                value={data.max_edit_requests}
                                onChange={e => setData('max_edit_requests', e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:border-brand-gold transition-all"
                                required
                            />
                            {errors.max_edit_requests && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.max_edit_requests}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 ml-2">Raw Folder (GDrive Link)</label>
                        <input
                            type="text"
                            value={data.raw_folder_id}
                            onChange={e => setData('raw_folder_id', e.target.value)}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:border-brand-gold transition-all"
                            placeholder="Paste full Google Drive folder link"
                            required
                        />
                        {errors.raw_folder_id && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.raw_folder_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 ml-2">Result Folder (GDrive Link)</label>
                        <input
                            type="text"
                            value={data.edited_folder_id}
                            onChange={e => setData('edited_folder_id', e.target.value)}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:border-brand-gold transition-all"
                            placeholder="Paste full Google Drive folder link"
                        />
                        {errors.edited_folder_id && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.edited_folder_id}</p>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-brand-gold hover:bg-black hover:text-white text-brand-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs transition-all shadow-xl shadow-brand-gold/10 disabled:opacity-50"
                        >
                            {processing ? 'Simpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
