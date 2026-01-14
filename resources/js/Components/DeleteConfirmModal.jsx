import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message, processing }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Simple Overlay */}
            <div
                className="absolute inset-0 bg-black/40 transition-opacity animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Compact Modal Container */}
            <div className="relative bg-white dark:bg-brand-black border border-black/10 dark:border-white/10 rounded-xl w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-scale-in overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="shrink-0 w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-500" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1">
                                {title || 'Hapus Data'}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 leading-relaxed">
                                {message || 'Yakin ingin menghapus data ini?'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-black/10 dark:border-white/10 text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-widest text-[9px] rounded-lg hover:bg-black/5 transition-all outline-none"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={processing}
                            className="flex-1 px-4 py-3 bg-brand-red text-white font-black uppercase tracking-widest text-[9px] rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-red/10 disabled:opacity-50 outline-none"
                        >
                            {processing ? '...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
