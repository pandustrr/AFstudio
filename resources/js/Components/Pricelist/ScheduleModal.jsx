import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon, HomeIcon, ExclamationTriangleIcon, ShoppingCartIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';

export default function ScheduleModal({ isOpen, onClose, packageData }) {
    const { flash } = usePage().props;
    const [date, setDate] = useState('');
    const [roomId, setRoomId] = useState(1); // Default to Room 1
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState(null);
    const [showSuccessUID, setShowSuccessUID] = useState(false);
    const [showNamePrompt, setShowNamePrompt] = useState(false);
    const [tempName, setTempName] = useState('');
    const [currentUID, setCurrentUID] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    // Reset state when modal opens/closes or package changes
    useEffect(() => {
        if (isOpen) {
            setDate('');
            setRoomId(1);
            setSlots([]);
            setSelectedSlot(null);
            setError(null);
        }
    }, [isOpen, packageData]);

    // Direct binding for flash errors
    useEffect(() => {
        if (flash?.error) {
            setError(flash.error);
        }
    }, [flash]);

    // Fetch availability when date or room changes
    useEffect(() => {
        if (date && packageData) {
            fetchAvailability();
        }
    }, [date, roomId]);

    const fetchAvailability = async () => {
        setLoading(true);
        setError(null);
        setSlots([]);
        setSelectedSlot(null);

        try {
            const response = await axios.get('/schedule/check', {
                params: {
                    date: date,
                    package_id: packageData.id,
                    room_id: roomId
                }
            });
            setSlots(response.data.available_slots);
        } catch (err) {
            console.error("Availability check failed", err);
            setError(`Failed to load: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!date || !selectedSlot) return;
        setError(null);

        let uid = localStorage.getItem('afstudio_cart_uid');
        if (!uid) {
            setShowNamePrompt(true);
            return;
        }

        processCart(uid);
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        const baseName = tempName.trim() || 'AF';
        const namePart = baseName.split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
        const randPart = Math.floor(100000 + Math.random() * 899999);
        const uid = `${namePart}-${randPart}`;
        localStorage.setItem('afstudio_cart_uid', uid);
        setCartUidState(uid);
        setShowNamePrompt(false);
        processCart(uid);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const processCart = (uid) => {
        router.post('/cart', {
            pricelist_package_id: packageData.id,
            quantity: 1,
            scheduled_date: date,
            start_time: selectedSlot,
            room_id: roomId,
            cart_uid: uid
        }, {
            headers: {
                'X-Cart-UID': uid
            },
            onSuccess: (page) => {
                if (!page.props.flash?.error) {
                    onClose();
                    if (page.props.flash?.success) {
                        setCurrentUID(uid);
                        setShowSuccessUID(true);
                    }
                } else {
                    setError(page.props.flash.error);
                }
            },
            onError: (errors) => {
                console.error("Cart add failed", errors);
                const firstError = Object.values(errors).join(', ');
                setError(firstError || "Failed to add to cart.");
            }
        });
    };

    const [cartUidState, setCartUidState] = useState(null); // Local state if needed

    const rooms = [
        { id: 1, name: 'Room 1' },
        { id: 2, name: 'Room 2' },
        { id: 3, name: 'Room 3' },
    ];

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white dark:bg-brand-black border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title as="h3" className="text-lg font-black uppercase tracking-wider text-brand-black dark:text-brand-white">
                                            Package Details & Schedule
                                        </Dialog.Title>
                                        <button onClick={onClose} className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                            <XMarkIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Package Info */}
                                        <div className="bg-brand-red/5 rounded-xl p-4 border border-brand-red/10">
                                            <h4 className="font-bold text-brand-red text-sm uppercase tracking-wide mb-1">selected package</h4>
                                            <p className="text-brand-black dark:text-brand-white font-black text-lg">{packageData?.name}</p>
                                            <div className="text-brand-gold font-black italic mb-2">{packageData?.price_display}</div>

                                            <div className="space-y-1.5 mt-3 pt-3 border-t border-brand-red/10">
                                                <p className="text-[10px] font-black uppercase text-brand-black/40 dark:text-brand-white/40 mb-1">Package Includes:</p>
                                                {(packageData?.features || []).map((feature, fIdx) => (
                                                    <div key={fIdx} className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1 shrink-0" />
                                                        <span className="text-[10px] font-bold text-brand-black/70 dark:text-brand-white/70 uppercase tracking-tight">{feature}</span>
                                                    </div>
                                                ))}
                                                <p className="text-brand-black/60 dark:text-brand-white/60 text-[10px] font-bold mt-2 pt-2 border-t border-brand-red/5 uppercase tracking-widest">Duration: {packageData?.duration} Minutes</p>
                                            </div>
                                        </div>

                                        {/* Room Selection */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                <HomeIcon className="w-4 h-4" /> Select Studio Room
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {rooms.map((room) => (
                                                    <button
                                                        key={room.id}
                                                        onClick={() => setRoomId(room.id)}
                                                        className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${roomId === room.id
                                                            ? 'bg-brand-gold border-brand-gold text-brand-black shadow-lg scale-105'
                                                            : 'bg-transparent border-black/10 dark:border-white/10 text-brand-black/40 dark:text-brand-white/40 hover:border-brand-gold/50'
                                                            }`}
                                                    >
                                                        {room.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Date Picker */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" /> Pick a Date
                                            </label>
                                            <input
                                                type="date"
                                                value={date}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full bg-black/5 dark:bg-white/5 border-0 focus:ring-2 focus:ring-brand-gold rounded-xl px-4 py-3 text-brand-black dark:text-brand-white font-bold"
                                            />
                                        </div>

                                        {/* Time Slots */}
                                        {date && (
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                    <ClockIcon className="w-4 h-4" /> Available Slots in Room {roomId}
                                                </label>

                                                {loading ? (
                                                    <div className="text-center py-8">
                                                        <div className="inline-block w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                                                        <p className="text-xs mt-2 text-brand-black/40 dark:text-brand-white/40">Checking slots...</p>
                                                    </div>
                                                ) : error ? (
                                                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-shake">
                                                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                                        <p className="text-xs text-red-700 font-bold leading-relaxed">{error}</p>
                                                    </div>
                                                ) : slots.length === 0 ? (
                                                    <div className="text-center py-8 bg-black/5 dark:bg-white/5 rounded-xl border border-dashed border-black/10 dark:border-white/10">
                                                        <p className="text-xs text-brand-black/40 dark:text-brand-white/40 font-bold uppercase tracking-widest">No slots available for Room {roomId}</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                                                        {slots.map((slot) => (
                                                            <button
                                                                key={slot}
                                                                onClick={() => setSelectedSlot(slot)}
                                                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${selectedSlot === slot
                                                                    ? 'bg-brand-gold text-brand-black shadow-lg scale-105'
                                                                    : 'bg-white dark:bg-white/10 text-brand-black dark:text-brand-white hover:bg-black/5 dark:hover:bg-white/20'
                                                                    }`}
                                                            >
                                                                {slot}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!date || !selectedSlot || loading}
                                            className="w-full py-4 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add to Cart with Room {roomId}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Name Prompt Modal */}
            <Transition appear show={showNamePrompt} as={Fragment}>
                <Dialog as="div" className="relative z-60" onClose={() => setShowNamePrompt(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
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
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-brand-black border border-white/10 p-8 text-left shadow-2xl transition-all">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title as="h3" className="text-xl font-black uppercase tracking-tighter italic text-brand-black dark:text-brand-white">
                                            Identitas Sesi
                                        </Dialog.Title>
                                        <button onClick={() => setShowNamePrompt(false)} className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                            <XMarkIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleNameSubmit} className="space-y-6">
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

            {/* UID Success Modal */}
            <Transition appear show={showSuccessUID} as={Fragment}>
                <Dialog as="div" className="relative z-70" onClose={() => setShowSuccessUID(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
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
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-brand-black border border-white/10 p-8 text-center shadow-2xl transition-all">
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
                                                {currentUID}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(currentUID)}
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
                                        onClick={() => setShowSuccessUID(false)}
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
        </>
    );
}
