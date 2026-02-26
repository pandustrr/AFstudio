import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon, HomeIcon, ExclamationTriangleIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';
import SuccessModal from './Modals/SuccessModal';

export default function ScheduleModal({ isOpen, onClose, packageData, rooms: initialRooms = [], mode = 'cart' }) {
    const { flash } = usePage().props;
    const [date, setDate] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [roomId, setRoomId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState(null);
    const [roomInfos, setRoomInfos] = useState([]);

    // Modal controls
    const [showSuccessUID, setShowSuccessUID] = useState(false);
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

    const formatSessionDuration = (maxSessions) => {
        if (!maxSessions) return '';
        // 1 session = 30 menit
        const totalMinutes = maxSessions * 30;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
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
    const [availabilityStatus, setAvailabilityStatus] = useState(null);

    // Reset state when modal opens/closes or package changes
    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

            setDate(today);
            setDateInput(`${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`);
            setPhotographerId(null);
            setPhotographers([]);
            setSlots([]);
            setSelectedSlot(null);
            setSelectedSessions([]);
            setStartTime('');
            setAvailabilityStatus(null);
            setError(null);
            // Set maxSessions from package data
            setMaxSessions(packageData?.max_sessions || 1);
        }
    }, [isOpen, packageData]);

    const handleDateInput = (e) => {
        let val = e.target.value;

        // Limit length and allow only numbers and slashes
        val = val.replace(/[^0-9/]/g, '').substring(0, 10);

        // Auto-slash logic
        if (val.length === 2 && !val.includes('/') && e.nativeEvent.inputType !== 'deleteContentBackward') {
            val += '/';
        } else if (val.length === 5 && val.split('/').length === 2 && e.nativeEvent.inputType !== 'deleteContentBackward') {
            val += '/';
        }

        setDateInput(val);

        // Parse DD/MM/YYYY
        const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = val.match(regex);
        if (match) {
            const d = match[1].padStart(2, '0');
            const m = match[2].padStart(2, '0');
            const y = match[3];
            const newDate = `${y}-${m}-${d}`;
            const dObj = new Date(newDate);

            if (!isNaN(dObj.getTime())) {
                setDate(newDate);
            }
        }
    };

    // Sync text input when date changes from picker
    useEffect(() => {
        if (date) {
            const [y, m, d] = date.split('-');
            if (y && m && d) {
                const formatted = `${d}/${m}/${y}`;
                if (dateInput !== formatted) {
                    setDateInput(formatted);
                }
            }
        }
    }, [date]);

    // Fetch photographer availability when date changes
    useEffect(() => {
        if (date && packageData) {
            fetchPhotographerAvailability();
        }
    }, [date, photographerId]);

    // Hoisted function to avoid ReferenceError
    function getOrCreateUID() {
        // 1. Check current localStorage
        let uid = localStorage.getItem('afstudio_cart_uid');
        if (uid && uid.includes('-')) return uid;

        // 2. Check URL (in case someone shared a checkout link)
        const urlParams = new URLSearchParams(window.location.search);
        const urlUid = urlParams.get('uid');
        if (urlUid && urlUid.includes('-')) {
            localStorage.setItem('afstudio_cart_uid', urlUid);
            return urlUid;
        }

        // 3. Generate new
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        const newUid = `AF-${randomNumber}`;
        localStorage.setItem('afstudio_cart_uid', newUid);
        return newUid;
    }

    const fetchPhotographerAvailability = async () => {
        setLoading(true);
        setError(null);
        setSlots([]);
        setSelectedSlot(null);

        try {
            const response = await axios.get('/schedule/photographer-slots', {
                params: {
                    date: date,
                    package_id: packageData.id
                }
            });
            // getPhotographerTimeSlots returns time_slots array
            setSlots(response.data.time_slots.map((time, idx) => ({
                id: idx,
                start_time: time
            })));
        } catch (err) {
            console.error("Photographer availability check failed", err);
            setError(`Gagal memuat jadwal: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const checkTimeAvailability = async (startT, endT) => {
        if (!startT || !endT || !date) return;

        setAvailabilityStatus('checking');
        setError(null);

        try {
            // Calculate sessions from time range
            const [startHour, startMin] = startT.split(':').map(Number);
            const [endHour, endMin] = endT.split(':').map(Number);

            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            const durationMinutes = endMinutes - startMinutes;
            const sessionsNeeded = Math.ceil(durationMinutes / 30);

            if (sessionsNeeded > maxSessions) {
                setAvailabilityStatus('full');
                setError(`Durasi terlalu lama! Maksimal ${maxSessions} sesi (${formatSessionDuration(maxSessions)}), Anda memerlukan ${sessionsNeeded} sesi.`);
                return;
            }

            if (durationMinutes <= 0) {
                setAvailabilityStatus('full');
                setError('Jam selesai harus lebih besar dari jam mulai.');
                return;
            }

            // Check photographer availability
            const response = await axios.get('/schedule/check-photographer-availability', {
                params: {
                    date: date,
                    start_time: startT,
                    sessions_needed: sessionsNeeded,
                    package_id: packageData.id
                }
            });

            if (response.data.available) {
                setPhotographerId(response.data.photographer_id);
                setAvailabilityStatus('available');
                setSelectedSessions(sessionsNeeded); // Store sessions count
            } else {
                setAvailabilityStatus('full');
                setError('Tidak ada fotografer tersedia untuk waktu tersebut.');
            }
        } catch (err) {
            console.error("Time availability check failed", err);
            setAvailabilityStatus('full');
            setError(`Gagal mengecek ketersediaan: ${err.response?.data?.message || err.message}`);
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
        if (!date) return;
        if (!startTime) {
            setError('Pilih jam mulai.');
            return;
        }
        if (availabilityStatus !== 'available') {
            setError('Cek ketersediaan fotografer terlebih dahulu.');
            return;
        }
        if (!photographerId) {
            setError('Fotografer belum ditentukan.');
            return;
        }

        setError(null);

        // Kembali pakai UID yang sama agar tidak duplikat di database
        const uid = getOrCreateUID();

        const payload = {
            pricelist_package_id: packageData.id,
            quantity: 1,
            scheduled_date: date,
            start_time: startTime,
            sessions_needed: selectedSessions > 0 ? selectedSessions : maxSessions,
            photographer_id: photographerId,
            cart_uid: uid
        };

        if (mode === 'direct') {
            router.post('/cart', payload, {
                headers: { 'X-Cart-UID': uid },
                onSuccess: (page) => {
                    // Ambil ID barang yang baru saja disimpan dari flash message
                    const itemId = page.props.flash?.last_added_id;
                    console.log('Direct Buy Debug:', { uid, itemId });

                    if (itemId) {
                        // Redirect dengan instruksi: "Tampilkan barang ID ini saja"
                        router.visit(`/checkout?uid=${uid}&cart_item_id=${itemId}`);
                    } else {
                        // Fallback jika ID gagal didapat
                        router.visit(`/checkout?uid=${uid}`);
                    }
                    onClose();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors).join(', ');
                    setError(firstError || "Gagal memproses booking.");
                }
            });
        } else {
            // Cart mode
            processCart(uid);
        }
    };

    const processCart = (uid) => {
        const payload = {
            pricelist_package_id: packageData.id,
            quantity: 1,
            scheduled_date: date,
            start_time: startTime,
            sessions_needed: selectedSessions > 0 ? selectedSessions : maxSessions,
            photographer_id: photographerId,
            cart_uid: uid
        };

        router.post('/cart', payload, {
            headers: { 'X-Cart-UID': uid },
            onSuccess: (page) => {
                if (!page.props.flash?.error) {
                    if (page.props.flash?.success) {
                        setCurrentUID(uid);
                        setShowSuccessUID(true);
                    }
                    setTimeout(() => {
                        onClose();
                    }, 500);
                } else {
                    setError(page.props.flash.error);
                }
            },
            onError: (errors) => {
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
                                            Booking Fotografer
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
                                                            {maxSessions} Sesi ({formatSessionDuration(maxSessions)})
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Form */}
                                        <div className="space-y-6">
                                            {/* Date Selection */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4" /> Pilih Tanggal Booking
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        placeholder="DD/MM/YYYY"
                                                        value={dateInput}
                                                        onChange={handleDateInput}
                                                        className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent group-hover:border-brand-gold/30 focus:border-brand-gold focus:outline-none rounded-2xl px-5 py-4 text-brand-black dark:text-brand-white font-bold text-lg transition-all"
                                                    />
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                                        <div className="relative">
                                                            <input
                                                                type="date"
                                                                value={date}
                                                                min={new Date().toISOString().split('T')[0]}
                                                                onChange={(e) => setDate(e.target.value)}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            />
                                                            <CalendarIcon className="w-6 h-6 opacity-20 group-hover:opacity-100 group-hover:text-brand-gold transition-all" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {date && (
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold px-1">
                                                        {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Time Input for Photographer Packages */}
                                            {date && (
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4" /> Waktu Session
                                                    </label>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50 dark:text-brand-white/50 block mb-2">Jam Mulai</label>
                                                            <input
                                                                type="time"
                                                                value={startTime}
                                                                onChange={(e) => {
                                                                    setStartTime(e.target.value);
                                                                    setAvailabilityStatus(null);
                                                                }}
                                                                min="05:00"
                                                                max="20:00"
                                                                className="w-full bg-black/5 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-brand-black dark:text-brand-white font-bold placeholder-brand-black/40 focus:outline-none focus:border-brand-gold"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50 dark:text-brand-white/50 block mb-2">Jam Selesai</label>
                                                            <input
                                                                type="time"
                                                                value={
                                                                    !startTime ? '' :
                                                                        (() => {
                                                                            const [h, m] = startTime.split(':').map(Number);
                                                                            const totalMin = h * 60 + m + maxSessions * 30;
                                                                            const endH = Math.floor(totalMin / 60);
                                                                            const endM = totalMin % 60;
                                                                            return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
                                                                        })()
                                                                }
                                                                onChange={(e) => {
                                                                    setAvailabilityStatus(null);
                                                                }}
                                                                disabled
                                                                className="w-full bg-black/5 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-brand-black dark:text-brand-white font-bold opacity-50 cursor-not-allowed"
                                                            />
                                                        </div>
                                                    </div>

                                                    {startTime && (
                                                        <button
                                                            onClick={() => {
                                                                const [h, m] = startTime.split(':').map(Number);
                                                                const totalMin = h * 60 + m + maxSessions * 30;
                                                                const endH = Math.floor(totalMin / 60);
                                                                const endM = totalMin % 60;
                                                                const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
                                                                checkTimeAvailability(startTime, endTime);
                                                            }}
                                                            disabled={availabilityStatus === 'checking'}
                                                            className="w-full px-6 py-3 bg-brand-gold text-brand-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {availabilityStatus === 'checking' ? 'Mengecek...' : 'Cek Ketersediaan'}
                                                        </button>
                                                    )}

                                                    {availabilityStatus === 'available' && (
                                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                                            <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">
                                                                ✓ Fotografer tersedia untuk {selectedSessions} sesi ({formatSessionDuration(selectedSessions)})
                                                            </p>
                                                        </div>
                                                    )}

                                                    {error && (
                                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                                            <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">{error}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                onClick={handleSubmit}
                                                disabled={!date || loading}
                                                className="w-full py-5 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-4"
                                            >
                                                {mode === 'direct' ? 'Lanjut ke Booking' : 'Tambah ke Keranjang'}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* UID Success Modal */}
            <SuccessModal
                isOpen={showSuccessUID}
                onClose={() => setShowSuccessUID(false)}
                uid={currentUID}
            />
        </>
    );
}
