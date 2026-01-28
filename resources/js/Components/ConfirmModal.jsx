import React from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, processing, variant = 'danger' }) {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return {
                    icon: <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-500" />,
                    iconBg: 'bg-green-100 dark:bg-green-500/10',
                    button: 'bg-green-600 text-white shadow-green-600/10',
                    confirmText: 'Ya, Konfirmasi'
                };
            case 'warning':
                return {
                    icon: <InformationCircleIcon className="w-5 h-5 text-brand-gold" />,
                    iconBg: 'bg-brand-gold/10',
                    button: 'bg-brand-gold text-brand-black shadow-brand-gold/10',
                    confirmText: 'Ya, Lanjutkan'
                };
            case 'danger':
            default:
                return {
                    icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-500" />,
                    iconBg: 'bg-red-100 dark:bg-red-500/10',
                    button: 'bg-brand-red text-white shadow-brand-red/10',
                    confirmText: 'Ya, Hapus'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Transparent Overlay (No Blur, No Color) */}
            <div
                className="absolute inset-0 bg-transparent transition-opacity animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Compact Modal Container with Strong Shadow */}
            <div className="relative bg-white dark:bg-brand-black border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-scale-in overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-brand-black/20 dark:text-brand-white/20 hover:text-brand-red transition-all"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
                <div className="p-6 pt-8">
                    <div className="flex items-start space-x-4">
                        <div className={`shrink-0 w-12 h-12 ${styles.iconBg} rounded-2xl flex items-center justify-center rotate-3`}>
                            {styles.icon}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter mb-1">
                                {title || 'Konfirmasi'}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 leading-relaxed">
                                {message || 'Apakah Anda yakin ingin melanjutkan tindakan ini?'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3.5 border border-black/10 dark:border-white/10 text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-black/5 transition-all outline-none"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={processing}
                            className={`flex-1 px-4 py-3.5 ${styles.button} font-black uppercase tracking-widest text-[9px] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 outline-none`}
                        >
                            {processing ? '...' : styles.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
