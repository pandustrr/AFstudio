import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function IdentityPromptModal({ isOpen, onClose, onConfirm }) {
    const [tempName, setTempName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(tempName);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-brand-black border border-white/10 p-8 text-left shadow-[0_0_50px_0_rgba(0,0,0,0.3)] transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-xl font-black uppercase tracking-tighter italic text-brand-black dark:text-brand-white">
                                        Identitas Sesi
                                    </Dialog.Title>
                                    <button onClick={onClose} className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                        <XMarkIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                            Nama Anda
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            placeholder="Contoh: PANDU"
                                            className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-brand-gold focus:ring-0 rounded-2xl px-5 py-4 text-brand-black dark:text-brand-white font-black tracking-widest uppercase placeholder:text-black/20 dark:placeholder:text-white/20 transition-all font-mono"
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-brand-red text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl"
                                    >
                                        Simpan & Lanjut
                                    </button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
