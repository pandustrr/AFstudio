import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon, HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';
import IdentityPromptModal from './Modals/IdentityPromptModal';
import SuccessModal from './Modals/SuccessModal';

export default function ScheduleModal({ isOpen, onClose, packageData, rooms: initialRooms = [] }) {
    const { flash } = usePage().props;
    const [date, setDate] = useState('');
    const [roomId, setRoomId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState(null);
    const [roomInfos, setRoomInfos] = useState([]);

    // Modal controls
    const [showSuccessUID, setShowSuccessUID] = useState(false);
    const [showNamePrompt, setShowNamePrompt] = useState(false);
    const [currentUID, setCurrentUID] = useState('');

    const rooms = initialRooms;

    const getSlotDisplay = (startTime) => {
        if (!packageData?.duration) return startTime;

        // Ensure HH:mm format
        const timePart = startTime.substring(0, 5);
        const [hours, minutes] = timePart.split(':').map(Number);

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        date.setMinutes(date.getMinutes() + parseInt(packageData.duration));

        const endHours = String(date.getHours()).padStart(2, '0');
        const endMinutes = String(date.getMinutes()).padStart(2, '0');

        return `${timePart} - ${endHours}:${endMinutes}`;
    };

    // Reset state when modal opens/closes or package changes
    useEffect(() => {
        if (isOpen) {
            // Default to today (Local Time) to avoid timezone issues with toISOString()
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const today = `${year}-${month}-${day}`;

            setDate(today);

            setRoomId(rooms.length > 0 ? rooms[0].id : null);
            setSlots([]);
            setRoomInfos([]);
            setSelectedSlot(null);
            setError(null);
        }
    }, [isOpen, packageData, rooms]);

    // Direct binding for flash errors
    useEffect(() => {
        if (flash?.error) {
            setError(flash.error);
        }
    }, [flash]);

    // Fetch availability when date or room changes
    useEffect(() => {
        if (date && packageData && roomId) {
            fetchAvailability();
        }
    }, [date, roomId]);

    const fetchAvailability = async () => {
        setLoading(true);
        setError(null);
        setSlots([]);
        setRoomInfos([]);
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
            if (response.data.per_room_info) {
                setRoomInfos(response.data.per_room_info);
            }
        } catch (err) {
            console.error("Availability check failed", err);
            setError(`Gagal memuat: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!date || !selectedSlot) return;
        setError(null);

        let uid = localStorage.getItem('afstudio_cart_uid');

        // Force new format: if no UID OR UID has no dash, show name prompt
        if (!uid || !uid.includes('-')) {
            setShowNamePrompt(true);
            return;
        }

        processCart(uid);
    };

    const handleIdentityConfirmed = (name) => {
        const baseName = name.trim() || 'AF';
        const namePart = baseName.split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
        const randPart = Math.floor(100000 + Math.random() * 899999);
        const uid = `${namePart}-${randPart}`;
        localStorage.setItem('afstudio_cart_uid', uid);
        setShowNamePrompt(false);
        processCart(uid);
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
                setError(firstError || "Gagal menambahkan ke keranjang.");
            }
        });
    };

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
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white dark:bg-brand-black border border-white/10 p-6 md:p-8 text-left align-middle shadow-[0_0_50px_0_rgba(0,0,0,0.3)] transition-all">
                                    <div className="flex justify-between items-center mb-8 border-b border-black/5 dark:border-white/5 pb-4">
                                        <Dialog.Title as="h3" className="text-xl font-black uppercase tracking-wider text-brand-black dark:text-brand-white">
                                            Detail Paket & Jadwal
                                        </Dialog.Title>
                                        <button onClick={onClose} className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                            <XMarkIcon className="w-6 h-6 text-brand-black dark:text-brand-white" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Column: Package Info */}
                                        <div className="space-y-6">
                                            <div className="bg-brand-red/5 rounded-3xl p-6 border border-brand-red/10 h-full flex flex-col">
                                                <div className="mb-6">
                                                    <h4 className="font-bold text-brand-red text-sm uppercase tracking-wide mb-2">Paket Dipilih</h4>
                                                    <p className="text-brand-black dark:text-brand-white font-black text-2xl mb-1 leading-tight">{packageData?.name}</p>
                                                    <div className="text-brand-gold font-black italic text-xl">{packageData?.price_display}</div>
                                                </div>

                                                <div className="space-y-3 pt-6 border-t border-brand-red/10 grow">
                                                    <p className="text-[10px] font-black uppercase text-brand-black/40 dark:text-brand-white/40 mb-2">Termasuk:</p>
                                                    {(packageData?.features || []).map((feature, fIdx) => (
                                                        <div key={fIdx} className="flex items-start gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 shrink-0" />
                                                            <span className="text-xs font-bold text-brand-black/70 dark:text-brand-white/70 uppercase tracking-tight leading-relaxed">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-brand-red/10">
                                                    <p className="text-brand-black/60 dark:text-brand-white/60 text-xs font-bold uppercase tracking-widest">
                                                        Durasi: <span className="text-brand-black dark:text-brand-white">{packageData?.duration} Menit</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Form */}
                                        <div className="space-y-6">
                                            {/* Date Selection */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4" /> Pilih Tanggal Booking
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="date"
                                                        value={date}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        onChange={(e) => setDate(e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent group-hover:border-brand-gold/30 rounded-2xl px-5 py-4 text-brand-black dark:text-brand-white font-bold text-lg capitalize flex items-center justify-between transition-all">
                                                        <span>
                                                            {(() => {
                                                                if (!date) return 'Pilih Tanggal';
                                                                const [y, m, d] = date.split('-').map(Number);
                                                                // Use UTC to avoid shift when displaying
                                                                return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('id-ID', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                    timeZone: 'UTC'
                                                                });
                                                            })()}
                                                        </span>
                                                        <CalendarIcon className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:text-brand-gold transition-all" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Room Selection */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                    <HomeIcon className="w-4 h-4" /> Pilih Ruangan Studio
                                                </label>
                                                {roomInfos.length > 0 ? (
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {roomInfos.map((info) => (
                                                            <button
                                                                key={info.id}
                                                                onClick={() => setRoomId(info.id)}
                                                                className={`flex items-center justify-center py-4 px-2 rounded-2xl transition-all border-2 ${roomId === info.id
                                                                    ? 'bg-brand-gold border-brand-gold text-brand-black shadow-lg scale-105'
                                                                    : 'bg-transparent border-black/5 dark:border-white/5 text-brand-black/60 dark:text-brand-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                                                                    } ${!info.is_open ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                                                disabled={!info.is_open}
                                                            >
                                                                <span className={`text-xs font-black uppercase tracking-widest leading-none ${!info.is_open ? 'text-red-500' : ''}`}>
                                                                    {info.name} {info.is_open ? '' : '(TUTUP)'}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {rooms.map((room) => (
                                                            <button
                                                                key={room.id}
                                                                onClick={() => setRoomId(room.id)}
                                                                className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${roomId === room.id
                                                                    ? 'bg-brand-gold border-brand-gold text-brand-black shadow-lg scale-105'
                                                                    : 'bg-transparent border-black/5 dark:border-white/5 text-brand-black/40 dark:text-brand-white/40 hover:border-brand-gold/50'
                                                                    }`}
                                                            >
                                                                {room.label || room.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Time Slots */}
                                            {date && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                            <ClockIcon className="w-4 h-4" /> Jadwal Tersedia
                                                        </label>
                                                    </div>

                                                    {loading ? (
                                                        <div className="text-center py-10 bg-black/5 dark:bg-white/5 rounded-2xl">
                                                            <div className="inline-block w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                                                            <p className="text-xs mt-3 text-brand-black/40 dark:text-brand-white/40 font-bold uppercase tracking-widest">Memeriksa jadwal...</p>
                                                        </div>
                                                    ) : error ? (
                                                        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-shake">
                                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                                            <p className="text-xs text-red-700 font-bold leading-relaxed">{error}</p>
                                                        </div>
                                                    ) : slots.length === 0 ? (
                                                        <div className="text-center py-10 bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                                                            <p className="text-xs text-brand-black/40 dark:text-brand-white/40 font-bold uppercase tracking-widest">Tidak ada jadwal tersedia untuk Ruangan {roomId}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                                                            {slots.map((slot) => (
                                                                <button
                                                                    key={slot}
                                                                    onClick={() => setSelectedSlot(slot)}
                                                                    className={`flex items-center justify-center py-3 px-2 rounded-xl text-[10px] md:text-xs font-black transition-all border-2 ${selectedSlot === slot
                                                                        ? 'bg-brand-gold border-brand-gold text-brand-black shadow-lg scale-105'
                                                                        : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 text-brand-black dark:text-brand-white hover:border-brand-gold/50 hover:bg-black/5 dark:hover:bg-white/10'
                                                                        }`}
                                                                >
                                                                    {getSlotDisplay(slot)}
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
                                                className="w-full py-5 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                            >
                                                Tambah ke Keranjang
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Name Prompt Modal */}
            <IdentityPromptModal
                isOpen={showNamePrompt}
                onClose={() => setShowNamePrompt(false)}
                onConfirm={handleIdentityConfirmed}
            />

            {/* UID Success Modal */}
            <SuccessModal
                isOpen={showSuccessUID}
                onClose={() => setShowSuccessUID(false)}
                uid={currentUID}
            />
        </>
    );
}
