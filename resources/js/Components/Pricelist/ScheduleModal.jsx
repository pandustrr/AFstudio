import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon, HomeIcon, ExclamationTriangleIcon, UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';
import SuccessModal from './Modals/SuccessModal';

export default function ScheduleModal({ isOpen, onClose, packageData, rooms: initialRooms = [], mode = 'cart', canBook = true, onLanjutBooking }) {
    const { flash } = usePage().props;
    const [date, setDate] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [roomId, setRoomId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');

    // Modal controls
    const [showSuccessUID, setShowSuccessUID] = useState(false);
    const [currentUID, setCurrentUID] = useState('');
    const [sessionGrid, setSessionGrid] = useState([]);
    const [isLoadingGrid, setIsLoadingGrid] = useState(false);

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
    const [selectedSplitTimes, setSelectedSplitTimes] = useState([]);
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
            setSelectedRoom('');
            setAvailabilityStatus(null);
            setError(null);
            setSessionGrid([]);
            setSelectedSplitTimes([]);
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

    // Fetch photographer availability when date and room changes
    useEffect(() => {
        if (date && packageData && selectedRoom) {
            fetchPhotographerAvailability();
            fetchSessionGrid();
        }
        // Reset selection when date or room changes
        setStartTime('');
        setSelectedSplitTimes([]);
        setAvailabilityStatus(null);
        setError(null);
    }, [date, selectedRoom]);

    // Fetch rooms when date changes
    useEffect(() => {
        if (date && packageData) {
            fetchRooms();
        }
    }, [date]);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/schedule/available-rooms', {
                params: {
                    date: date,
                    package_id: packageData.id
                }
            });
            setAvailableRooms(response.data.rooms || []);
        } catch (err) {
            console.error("Failed to fetch rooms", err);
        }
    };

    const fetchSessionGrid = async () => {
        setIsLoadingGrid(true);
        try {
            const response = await axios.get('/schedule/room-session-grid', {
                params: {
                    date: date,
                    room_name: selectedRoom,
                    package_id: packageData.id
                }
            });
            setSessionGrid(response.data.grid || []);
        } catch (err) {
            console.error("Failed to fetch session grid", err);
        } finally {
            setIsLoadingGrid(false);
        }
    };

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
                    package_id: packageData.id,
                    room_name: selectedRoom
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

    const checkTimeAvailability = async (startTimeStr, endTimeStr, customTimes = null) => {
        if ((!startTimeStr && !customTimes) || !date) return;

        setAvailabilityStatus('checking');
        setError(null);

        try {
            const response = await axios.post('/schedule/check-time-availability', {
                date: date,
                start_time: startTimeStr || '',
                end_time: endTimeStr || '',
                package_id: packageData.id,
                room_name: selectedRoom,
                cart_uid: localStorage.getItem('afstudio_cart_uid'),
                selected_times: customTimes
            });

            if (response.data.available) {
                setAvailabilityStatus('available');
                setPhotographerId(response.data.photographer_id);
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

    const toggleSplitSession = (time) => {
        if (!packageData?.allow_split_session) return;
        let newSelected;
        if (selectedSplitTimes.includes(time)) {
            newSelected = selectedSplitTimes.filter(t => t !== time);
        } else {
            if (selectedSplitTimes.length >= maxSessions) {
                // Remove first more and add new? Or just block?
                // User said "Customer can select sessions 1 by 1", let's block if max reached
                return;
            }
            newSelected = [...selectedSplitTimes, time];
        }

        setSelectedSplitTimes(newSelected);
        setAvailabilityStatus(null);
        setStartTime(newSelected.length > 0 ? newSelected[0] : ''); // Use first selected as start_time anchor

        // Automatically check availability if selection is complete
        if (newSelected.length === maxSessions) {
            checkTimeAvailability(null, null, newSelected);
        }
    };

    const handleSubmit = () => {
        if (!date) return;

        if (packageData?.allow_split_session) {
            if (selectedSplitTimes.length < maxSessions) {
                setError(`Pilih ${maxSessions} sesi.`);
                return;
            }
            if (availabilityStatus !== 'available') {
                setError('Tunggu sebentar, sedang memastikan ketersediaan fotografer...');
                // Re-trigger if somehow stuck
                if (!loading && availabilityStatus !== 'checking') {
                    checkTimeAvailability(null, null, selectedSplitTimes);
                }
                return;
            }
        } else {
            if (!startTime) {
                setError('Pilih jam mulai.');
                return;
            }
            if (availabilityStatus !== 'available') {
                setError('Cek ketersediaan fotografer terlebih dahulu.');
                return;
            }
        }

        if (!photographerId) {
            setError('Fotografer belum ditentukan atau tidak tersedia di room ini.');
            return;
        }

        if (!selectedRoom) {
            setError('Pilih room terlebih dahulu.');
            return;
        }

        setError(null);

        const uid = getOrCreateUID();

        const payload = {
            pricelist_package_id: packageData.id,
            quantity: 1,
            scheduled_date: date,
            start_time: startTime,
            sessions_needed: maxSessions,
            photographer_id: photographerId,
            room_name: selectedRoom,
            cart_uid: uid,
            selected_times: packageData?.allow_split_session
                ? selectedSplitTimes
                : Array.from({ length: maxSessions }, (_, i) => {
                    const [h, m] = startTime.split(':').map(Number);
                    const totalMin = h * 60 + m + (i * 30);
                    return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
                })
        };

        if (mode === 'direct') {
            router.post('/cart', payload, {
                headers: { 'X-Cart-UID': uid },
                onSuccess: (page) => {
                    const itemId = page.props.flash?.last_added_id;
                    if (itemId) {
                        router.visit(`/checkout?uid=${uid}&cart_item_id=${itemId}`);
                    } else {
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
            processCart(uid, payload);
        }
    };

    const processCart = (uid, payload) => {
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
                                            </div>

                                            {/* Room Selection */}
                                            {date && availableRooms.length > 0 && (
                                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                        <HomeIcon className="w-4 h-4" /> Pilih Room
                                                    </label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {availableRooms.map((room) => (
                                                            <button
                                                                key={room}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedRoom(room);
                                                                    setAvailabilityStatus(null);
                                                                    setPhotographerId(null);
                                                                    setSlots([]);
                                                                }}
                                                                className={`px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${selectedRoom === room
                                                                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold shadow-lg shadow-brand-gold/10 scale-[1.02]'
                                                                    : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40 hover:border-brand-gold/30'
                                                                    }`}
                                                            >
                                                                {room}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {date && availableRooms.length === 0 && !loading && (
                                                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl animate-in zoom-in duration-300">
                                                    <p className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 tracking-widest text-center">
                                                        Maaf, tidak ada room tersedia untuk tanggal ini.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Session List */}
                                            {date && selectedRoom && (
                                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4" /> Pilih Sesi
                                                    </label>

                                                    <div className="flex flex-col gap-4">
                                                        {isLoadingGrid ? (
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                                    <div key={i} className="h-20 w-full animate-pulse bg-black/5 dark:bg-white/5 rounded-xl" />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
                                                                {sessionGrid.map((item, index) => {
                                                                    const isBooked = item.status === 'booked';
                                                                    const isOff = item.status === 'off';
                                                                    const isOpen = item.status === 'open';
                                                                    const isSplitActive = packageData?.allow_split_session;

                                                                    // Helper to check if this slot is selected
                                                                    const isSelected = isSplitActive
                                                                        ? selectedSplitTimes.includes(item.time)
                                                                        : startTime === item.time;

                                                                    // End time calculation for the 30min slot
                                                                    const slotEndTime = (() => {
                                                                        const [h, m] = item.time.split(':').map(Number);
                                                                        const totalMin = h * 60 + m + 30;
                                                                        const endH = Math.floor(totalMin / 60);
                                                                        const endM = totalMin % 60;
                                                                        return `${String(endH).padStart(2, '0')}.${String(endM).padStart(2, '0')}`;
                                                                    })();

                                                                    // Helper to check if this slot is part of a consecutive selection (traditional)
                                                                    const isPartOfConsecutive = (() => {
                                                                        if (isSplitActive || !startTime) return false;
                                                                        const startIdx = sessionGrid.findIndex(s => s.time === startTime);
                                                                        const currentIdx = index;
                                                                        return currentIdx >= startIdx && currentIdx < startIdx + maxSessions;
                                                                    })();

                                                                    const isHighlighted = isSplitActive ? isSelected : isPartOfConsecutive;
                                                                    const isStartSelection = startTime === item.time;

                                                                    return (
                                                                        <button
                                                                            key={index}
                                                                            type="button"
                                                                            disabled={isBooked || isOff}
                                                                            onClick={() => {
                                                                                if (isSplitActive) {
                                                                                    toggleSplitSession(item.time);
                                                                                } else {
                                                                                    if (isStartSelection) {
                                                                                        setStartTime('');
                                                                                        setAvailabilityStatus(null);
                                                                                    } else {
                                                                                        setStartTime(item.time);
                                                                                        const endTimeStr = (() => {
                                                                                            const [h, m] = item.time.split(':').map(Number);
                                                                                            const totalMin = h * 60 + m + maxSessions * 30;
                                                                                            const endH = Math.floor(totalMin / 60);
                                                                                            const endM = totalMin % 60;
                                                                                            return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
                                                                                        })();
                                                                                        checkTimeAvailability(item.time, endTimeStr);
                                                                                    }
                                                                                }
                                                                            }}
                                                                            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center group
                                                                                ${isHighlighted
                                                                                    ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-lg shadow-brand-gold/10 scale-[1.05] z-10'
                                                                                    : isOpen
                                                                                        ? 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-brand-gold/30 hover:scale-[1.02]'
                                                                                        : 'bg-black/2 dark:bg-white/2 border-transparent opacity-40 grayscale cursor-not-allowed'
                                                                                }`}
                                                                        >
                                                                            <span className={`text-[8px] font-black uppercase tracking-tighter opacity-40 block mb-1
                                                                                ${isHighlighted ? 'text-brand-gold opacity-100' : ''}
                                                                            `}>
                                                                                Sesi {index + 1}
                                                                            </span>

                                                                            <h3 className={`text-[11px] font-black tracking-tighter uppercase mb-0.5
                                                                                ${isHighlighted ? 'text-brand-gold' : 'text-brand-black dark:text-brand-white'}
                                                                            `}>
                                                                                {item.time.replace(':', '.')}-{slotEndTime}
                                                                            </h3>

                                                                            <div className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border mt-1
                                                                                ${isBooked ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                                    isOff ? 'bg-black/10 text-brand-black/40 border-black/20' :
                                                                                        isHighlighted ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'}
                                                                            `}>
                                                                                {isBooked ? 'TERISI' : isOff ? 'LIBUR' : isHighlighted ? 'FIXED' : 'OPEN'}
                                                                            </div>

                                                                            {isHighlighted && isSplitActive && (
                                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold rounded-full flex items-center justify-center text-brand-black shadow-md border border-white dark:border-brand-black shadow-brand-gold/20 text-[10px] font-black">
                                                                                    {selectedSplitTimes.indexOf(item.time) + 1}
                                                                                </div>
                                                                            )}

                                                                            {!isSplitActive && isStartSelection && (
                                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold rounded-full flex items-center justify-center text-brand-black shadow-md border border-white dark:border-brand-black shadow-brand-gold/20">
                                                                                    <div className="w-1.5 h-1.5 bg-brand-black rounded-full animate-pulse" />
                                                                                </div>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Rincian Sesi Terpilih */}
                                                    {(packageData?.allow_split_session ? selectedSplitTimes.length > 0 : startTime) && (
                                                        <div className="bg-brand-gold/5 border border-brand-gold/10 rounded-2xl p-4 space-y-3 mt-4 animate-in slide-in-from-bottom-2 duration-300">
                                                            <div className="flex items-center justify-between border-b border-brand-gold/10 pb-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Rincian Jadwal</span>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold/60">
                                                                    {packageData?.allow_split_session
                                                                        ? `${selectedSplitTimes.length} / ${maxSessions} Sesi`
                                                                        : `${maxSessions} Sesi Terangkai`}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-2">
                                                                {packageData?.allow_split_session ? (
                                                                    selectedSplitTimes.sort().map((t, i) => {
                                                                        const [h, m] = t.split(':').map(Number);
                                                                        const totalMin = h * 60 + m + 30;
                                                                        const endT = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
                                                                        return (
                                                                            <div key={i} className="flex items-center justify-between text-xs font-bold text-brand-black dark:text-brand-white bg-white/50 dark:bg-black/20 px-3 py-2 rounded-xl">
                                                                                <span>Sesi {i + 1}</span>
                                                                                <span className="font-black italic">{t.replace(':', '.')}-{endT}</span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    Array.from({ length: maxSessions }).map((_, i) => {
                                                                        const [h, m] = startTime.split(':').map(Number);
                                                                        const startMin = h * 60 + m + (i * 30);
                                                                        const endMin = startMin + 30;
                                                                        const startT = `${String(Math.floor(startMin / 60)).padStart(2, '0')}.${String(startMin % 60).padStart(2, '0')}`;
                                                                        const endT = `${String(Math.floor(endMin / 60)).padStart(2, '0')}.${String(endMin % 60).padStart(2, '0')}`;
                                                                        return (
                                                                            <div key={i} className="flex items-center justify-between text-xs font-bold text-brand-black dark:text-brand-white bg-white/50 dark:bg-black/20 px-3 py-2 rounded-xl">
                                                                                <span>Sesi {i + 1}</span>
                                                                                <span className="font-black italic">{startT}-{endT}</span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {availabilityStatus === 'available' && (
                                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in zoom-in duration-300">
                                                            <div className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                                Fotografer tersedia untuk {maxSessions} sesi
                                                            </div>
                                                        </div>
                                                    )}
                                                    {error && (
                                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-in shake duration-500">
                                                            <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">{error}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {!canBook ? (
                                                <a
                                                    href={`https://wa.me/6282232586727?text=Halo%20Admin%2C%20saya%20tertarik%20dengan%20paket%20${packageData?.name}.%20Bisa%20bantu%20booking?`}
                                                    className="w-full py-5 bg-brand-gold text-brand-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl block text-center mt-4"
                                                >
                                                    Hubungi Admin untuk Booking
                                                </a>
                                            ) : (
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={
                                                        !date ||
                                                        (packageData?.allow_split_session
                                                            ? (selectedSplitTimes.length < maxSessions)
                                                            : (!startTime || availabilityStatus !== 'available')) ||
                                                        loading
                                                    }
                                                    className="w-full py-5 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-4"
                                                >
                                                    {(packageData?.allow_split_session && mode === 'direct') ? 'Selesaikan Pilihan Sesi' : (mode === 'direct' ? 'Lanjut ke Booking' : 'Tambah ke Keranjang')}
                                                </button>
                                            )}
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
