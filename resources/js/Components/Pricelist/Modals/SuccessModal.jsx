import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon, CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function SuccessModal({ isOpen, onClose, uid }) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-70" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-brand-black border border-white/10 p-8 text-center shadow-[0_0_50px_0_rgba(0,0,0,0.3)] transition-all">
                                <div className="mb-6">
                                    <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-green/20">
                                        <ShoppingCartIcon className="w-10 h-10 text-brand-green" />
                                    </div>
                                    <Dialog.Title as="h3" className="text-xl font-black uppercase tracking-tighter italic text-brand-black dark:text-brand-white">
                                        Berhasil Ditambahkan!
                                    </Dialog.Title>
                                    <p className="text-xs font-bold text-brand-black/60 dark:text-brand-white/60 mt-2">
                                        Paket Anda telah masuk ke keranjang.
                                    </p>
                                </div>

                                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 mb-8 border border-dashed border-black/10 dark:border-white/20 relative group">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2">UID Keranjang Anda:</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="text-3xl font-black text-brand-red tracking-widest select-all font-mono">
                                            {uid}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(uid)}
                                            className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all active:scale-90"
                                            title="Copy to clipboard"
                                        >
                                            {isCopied ? <CheckIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-[9px] font-bold text-brand-gold mt-3 uppercase tracking-tighter">
                                        *Simpan UID ini untuk melihat keranjang Anda nanti
                                    </p>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl"
                                >
                                    Selesai
                                </button>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
