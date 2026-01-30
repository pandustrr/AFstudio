import React from 'react';
import { XMarkIcon, ChatBubbleLeftRightIcon, PhoneIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function ViewModal({ session, onClose }) {
    if (!session) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-brand-black border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] animate-fade-in">
                <div className="sticky top-0 bg-white/80 dark:bg-brand-black/80 backdrop-blur-md px-8 py-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">Requests Customer : {session.uid}</h2>
                        <div className="flex flex-col gap-1 mt-1">
                            <p className="text-xs font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">{session.customer_name}</p>
                            {session.booking?.phone && (
                                <a
                                    href={`https://wa.me/${session.booking.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-500 hover:underline w-fit"
                                >
                                    <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                                    {session.booking.phone}
                                </a>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {session.quota_request && (
                    <div className="mx-8 mt-6 p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-gold/20 rounded-full flex items-center justify-center shrink-0">
                                <ChartBarIcon className="w-6 h-6 text-brand-gold" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-0.5">Permintaan Tambah Kuota</h4>
                                <p className="text-xs font-bold text-brand-black dark:text-brand-white">"{session.quota_request}"</p>
                            </div>
                        </div>
                        <div className="bg-brand-gold text-brand-black px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
                            New Request
                        </div>
                    </div>
                )}

                <div className="p-8 space-y-6">
                    {(session.edit_requests || []).length > 0 ? (
                        session.edit_requests.map((request, idx) => {
                            const photos = request.selected_photos || [];
                            return (
                                <div key={idx} className="bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                        <div className="text-xs font-black uppercase tracking-widest text-brand-gold">Request #{idx + 1}</div>
                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                                            <span className="text-[10px] sm:text-[11px] font-bold text-brand-black/40 dark:text-brand-white/40">
                                                {new Date(request.created_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })} - {new Date(request.created_at).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }).replace('.', ':')}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    const text = (photos).map(p => typeof p === 'object' ? (p.name || p.filename || 'No Name') : p).join('\n');
                                                    navigator.clipboard.writeText(text);
                                                    alert('Berhasil disalin!');
                                                }}
                                                className="px-3 py-1 bg-brand-gold text-brand-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {photos.map((photo, pIdx) => (
                                            <div key={pIdx} className="bg-white/50 dark:bg-white/5 p-2 rounded-lg border border-black/5 dark:border-white/5">
                                                <p className="text-xs font-mono font-bold text-brand-black/60 dark:text-brand-white/60 truncate">
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
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-black uppercase tracking-widest">Belum ada request edit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
