import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon, HomeIcon, ExclamationTriangleIcon, UserIcon } from '@heroicons/react/24/outline';
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

    const formatPrice = (price) => {
        if (!price) return '';
        const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(numericPrice);
    };

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

    const [photographerId, setPhotographerId] = useState(null);
    const [photographers, setPhotographers] = useState([]);
    const [selectedSessions, setSelectedSessions] = useState([]);
    const [maxSessions, setMaxSessions] = useState(1);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [availabilityStatus, setAvailabilityStatus] = useState(null);

    const isPhotographerMode = packageData?.sub_category?.category?.type === 'photographer';

    // Reset state when modal opens/closes or package changes
    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

            setDate(today);
            setRoomId(rooms.length > 0 ? rooms[0].id : null);
            setPhotographerId(null);
            setPhotographers([]);
            setSlots([]);
            setRoomInfos([]);
            setSelectedSlot(null);
            setSelectedSessions([]);
            setStartTime('');
            setEndTime('');
            setAvailabilityStatus(null);
            setError(null);
        }
    }, [isOpen, packageData, rooms]);

    // Fetch availability when date, room, or photographer changes
    useEffect(() => {
        if (date && packageData) {
            if (isPhotographerMode) {
                fetchPhotographerAvailability();
            } else if (roomId) {
                fetchAvailability();
            }
        }
    }, [date, roomId, photographerId]);

    // Hoisted function to avoid ReferenceError
    function handleIdentityConfirmed(name) {
        // Generate a random 5-digit number
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        const newUid = `AF-${randomNumber}`;

        // Optional: Store the name separately if needed elsewhere, 
        // but the UID itself is now generic as requested.
        localStorage.setItem('afstudio_customer_name', name.trim());
        localStorage.setItem('afstudio_cart_uid', newUid);

        setShowNamePrompt(false);
        processCart(newUid);
    }

    const fetchAvailability = async () => {
        setLoading(true);
        setError(null);
        setSlots([]);
        setSelectedSlot(null);

        try {
            const response = await axios.get('/schedule/check', {
                params: {
                    date: date,
                    room_id: roomId,
                    package_id: packageData.id
                }
            });
            // Fix: API returns available_slots and per_room_info
            setSlots(response.data.available_slots || []);
            setRoomInfos(response.data.per_room_info || []);
        } catch (err) {
            console.error("Availability check failed", err);
            setError("Gagal memuat jadwal.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPhotographerAvailability = async () => {
        setLoading(true);
        setError(null);
        setSlots([]); // reuse as sessions list
        setSelectedSessions([]);

        try {
            const response = await axios.get('/schedule/photographer', {
                params: {
                    date: date,
                    package_id: packageData.id,
                    photographer_id: photographerId
                }
            });
            setPhotographers(response.data.photographers);
            setSlots(response.data.sessions);
            setMaxSessions(response.data.max_sessions);
        } catch (err) {
            console.error("FG Availability check failed", err);
            setError(`Gagal memuat: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const checkTimeAvailability = async (time, endTimeVal = null) => {
        if (!time || !date) return;

        setAvailabilityStatus('checking');
        setError(null);

        try {
            const cartUid = localStorage.getItem('afstudio_cart_uid');
            const params = {
                date: date,
                start_time: time,
                package_id: packageData.id
            };
            if (cartUid) {
                params.cart_uid = cartUid;
            }
            if (endTimeVal && !isPhotographerMode) {
                params.end_time = endTimeVal;
            }
            const response = await axios.get('/schedule/check-time', { params });

            if (response.data.available) {
                setAvailabilityStatus('available');
            } else {
                setAvailabilityStatus('full');
                setError(`Tidak ada yang tersedia pada jam ${time}.`);
            }
        } catch (err) {
            console.error("Time availability check failed", err);
            setAvailabilityStatus('full');
            setError('Gagal mengecek ketersediaan.');
        }
    };

    const toggleSession = (sessionId) => {
        if (selectedSessions.includes(sessionId)) {
            setSelectedSessions(selectedSessions.filter(id => id !== sessionId));
        } else {
            if (selectedSessions.length >= maxSessions) {
                setError(`Maksimal ${maxSessions} sesi untuk paket ini.`);
                return;
            }
            setSelectedSessions([...selectedSessions, sessionId]);
            setError(null);
        }
    };

    const handleSubmit = () => {
        console.log('=== HANDLE SUBMIT ===');
        if (!date) return;
        if (!startTime) {
            setError('Pilih waktu mulai.');
            return;
        }
        if (availabilityStatus !== 'available') {
            setError('Periksa ketersediaan terlebih dahulu.');
            return;
        }

        setError(null);

        let uid = localStorage.getItem('afstudio_cart_uid');
        console.log('UID:', uid);
        if (!uid || !uid.includes('-')) {
            console.log('No UID, showing IdentityPromptModal');
            setShowNamePrompt(true);
            return;
        }

        console.log('Processing cart with UID:', uid);
        processCart(uid);
    };

    const processCart = (uid) => {
        console.log('=== PROCESS CART START ===');
        console.log('Current state - date:', date, 'startTime:', startTime, 'endTime:', endTime);

        const payload = {
            pricelist_package_id: packageData.id,
            quantity: 1,
            scheduled_date: date,
            start_time: startTime,
            cart_uid: uid
        };

        if (isPhotographerMode) {
            // photographer_id will be auto-assigned if needed
        } else {
            // room_id will be auto-assigned by system
            if (endTime) {
                payload.end_time = endTime;
            }
        }

        console.log('Sending payload:', payload);

        router.post('/cart', payload, {
            headers: { 'X-Cart-UID': uid },
            onSuccess: (page) => {
                console.log('=== PROCESS CART SUCCESS ===');
                console.log('Page props:', page.props);
                if (!page.props.flash?.error) {
                    if (page.props.flash?.success) {
                        console.log('Success message found:', page.props.flash.success);
                        setCurrentUID(uid);
                        setShowSuccessUID(true);
                    }
                    // Close modal after showing success (delay for user to see success state)
                    setTimeout(() => {
                        console.log('Closing ScheduleModal');
                        onClose();
                    }, 500);
                } else {
                    console.log('Error from server:', page.props.flash.error);
                    setError(page.props.flash.error);
                }
            },
            onError: (errors) => {
                console.log('=== PROCESS CART ERROR ===');
                console.log('Errors:', errors);
                const firstError = Object.values(errors).join(', ');
                setError(firstError || "Gagal menambahkan ke keranjang.");
            }
        });
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-transparent" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white dark:bg-brand-black border border-white/10 p-6 md:p-8 text-left align-middle shadow-[0_0_50px_0_rgba(0,0,0,0.3)] transition-all">
                                    <div className="flex justify-between items-center mb-8 border-b border-black/5 dark:border-white/5 pb-4">
                                        <Dialog.Title as="h3" className="text-xl font-black uppercase tracking-wider text-brand-black dark:text-brand-white">
                                            {isPhotographerMode ? 'Booking Fotografer' : 'Detail Paket & Jadwal'}
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
                                                    <div className="text-brand-gold font-black italic text-xl">
                                                        {packageData?.price_numeric ? formatPrice(packageData.price_numeric) : packageData?.price_display}
                                                    </div>
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
                                                    <p className="text-brand-black/60 dark:text-brand-white/60 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                                        Durasi: <span className="text-brand-black dark:text-brand-white">
                                                            {isPhotographerMode ? `${maxSessions} Sesi (@30 Min)` : `${packageData?.duration} Menit`}
                                                        </span>
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
                                                            {date ? new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'Pilih Tanggal'}
                                                        </span>
                                                        <CalendarIcon className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:text-brand-gold transition-all" />
                                                    </div>
                                                </div>
                                            </div>

                                            {!isPhotographerMode ? (
                                                <>
                                                    {/* Time Input for Room Packages */}
                                                    {date && (
                                                        <div className="space-y-3">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                                <ClockIcon className="w-4 h-4" /> Jam Mulai - Jam Selesai
                                                            </label>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="time"
                                                                    value={startTime}
                                                                    onChange={(e) => {
                                                                        setStartTime(e.target.value);
                                                                        setAvailabilityStatus(null);
                                                                    }}
                                                                    min="09:00"
                                                                    max="18:00"
                                                                    className="flex-1 bg-black/5 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-brand-black dark:text-brand-white font-bold placeholder-brand-black/40 focus:outline-none focus:border-brand-gold"
                                                                    placeholder="Jam Mulai"
                                                                />
                                                                <span className="flex items-center text-brand-black/40 dark:text-brand-white/40 font-bold">-</span>
                                                                <input
                                                                    type="time"
                                                                    value={endTime}
                                                                    onChange={(e) => {
                                                                        setEndTime(e.target.value);
                                                                        setAvailabilityStatus(null);
                                                                    }}
                                                                    min={startTime || "09:00"}
                                                                    max="20:00"
                                                                    className="flex-1 bg-black/5 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-brand-black dark:text-brand-white font-bold placeholder-brand-black/40 focus:outline-none focus:border-brand-gold"
                                                                    placeholder="Jam Selesai"
                                                                />
                                                                <button
                                                                    onClick={() => checkTimeAvailability(startTime, endTime)}
                                                                    disabled={!startTime || !endTime}
                                                                    className="px-6 py-3 bg-brand-gold text-brand-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    Cek
                                                                </button>
                                                            </div>

                                                            {availabilityStatus === 'checking' && (
                                                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                                                                    <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-widest animate-pulse">Memeriksa ketersediaan ruangan...</p>
                                                                </div>
                                                            )}

                                                            {availabilityStatus === 'available' && (
                                                                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                                                    <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">✓ Ada ruangan kosong pada jam ini</p>
                                                                </div>
                                                            )}

                                                            {availabilityStatus === 'full' && error && (
                                                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                                                    <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">{error}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {/* Time Input for Photographer Packages */}
                                                    {date && (
                                                        <div className="space-y-3">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                                <ClockIcon className="w-4 h-4" /> Waktu Mulai
                                                            </label>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="time"
                                                                    value={startTime}
                                                                    onChange={(e) => {
                                                                        setStartTime(e.target.value);
                                                                        setAvailabilityStatus(null);
                                                                    }}
                                                                    min="05:00"
                                                                    max="20:00"
                                                                    className="flex-1 bg-black/5 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-brand-black dark:text-brand-white font-bold placeholder-brand-black/40 focus:outline-none focus:border-brand-gold"
                                                                />
                                                                <button
                                                                    onClick={() => checkTimeAvailability(startTime)}
                                                                    disabled={!startTime}
                                                                    className="px-6 py-3 bg-brand-gold text-brand-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    Cek
                                                                </button>
                                                            </div>

                                                            {availabilityStatus === 'checking' && (
                                                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                                                                    <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-widest animate-pulse">Memeriksa ketersediaan...</p>
                                                                </div>
                                                            )}

                                                            {availabilityStatus === 'available' && (
                                                                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                                                    <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">✓ Tersedia pada jam ini</p>
                                                                </div>
                                                            )}

                                                            {availabilityStatus === 'full' && error && (
                                                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                                                    <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">{error}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            <button
                                                onClick={handleSubmit}
                                                disabled={!date || loading}
                                                className="w-full py-5 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-4"
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
