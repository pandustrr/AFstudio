import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });

    const phoneNumber = "6285134363956";

    const handleSubmit = (e) => {
        e.preventDefault();

        const text = `Halo AFstudio!

Nama: ${formData.name}
Pesan: ${formData.message}

Saya ingin tanya-tanya lebih lanjut.`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
        // Clear form after delay
        setTimeout(() => setFormData({ name: '', message: '' }), 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-100">
            {/* Form Popup */}
            <Transition
                show={isOpen}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-10"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-10"
            >
                <div className="absolute bottom-20 right-0 w-[320px] sm:w-[380px] bg-white dark:bg-brand-black rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-black/5 dark:border-white/10 overflow-hidden transform origin-bottom-right">
                    {/* Header */}
                    <div className="bg-brand-black dark:bg-white/5 p-6 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 blur-2xl -mr-12 -mt-12"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center shadow-lg shadow-brand-red/20">
                                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-black uppercase tracking-widest italic">Hubungi Kami</h3>
                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">AFstudio Priority Chat</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest ml-1">Nama Anda</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Jhon Doe"
                                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-5 py-3.5 text-sm font-bold placeholder:text-black/20 dark:placeholder:text-white/20 focus:ring-2 focus:ring-brand-gold transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest ml-1">Pesan Singkat</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Halo, saya ingin bertanya tentang..."
                                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-5 py-3.5 text-sm font-bold placeholder:text-black/20 dark:placeholder:text-white/20 focus:ring-2 focus:ring-brand-gold transition-all resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-4 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-gold hover:text-brand-black transition-all duration-500 shadow-xl active:scale-95 group/btn"
                        >
                            <PaperAirplaneIcon className="w-4 h-4 -rotate-45 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            Kirim ke WhatsApp
                        </button>

                    </form>
                </div>
            </Transition>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.4)] transition-all duration-500 hover:scale-110 active:scale-95 z-10"
                aria-label="Toggle WhatsApp Form"
            >
                {/* Ping Animation - Hide when open */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping group-hover:animate-none"></span>
                )}

                {isOpen ? (
                    <XMarkIcon className="w-7 h-7 animate-in fade-in zoom-in duration-300" />
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                )}
            </button>

            {/* Tooltip (Only if closed) */}
            {!isOpen && (
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                    Tanya Admin
                </span>
            )}
        </div>
    );
}
