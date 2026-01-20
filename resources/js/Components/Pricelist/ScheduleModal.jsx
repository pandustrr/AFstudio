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
        if (!isPhotographerMode && !selectedSlot) return;
        if (isPhotographerMode && selectedSessions.length === 0) {
            setError('Pilih minimal 1 sesi.');
            return;
        }

        setError(null);

        let uid = localStorage.getItem('afstudio_cart_uid');
        if (!uid || !uid.includes('-')) {
            setShowNamePrompt(true);
            return;
        }

        processCart(uid);
    };

    const processCart = (uid) => {
        const payload = {
            pricelist_package_id: packageData.id,
            quantity: 1,
            scheduled_date: date,
            cart_uid: uid
        };

        if (isPhotographerMode) {
            payload.photographer_id = photographerId;
            payload.session_ids = selectedSessions;
        } else {
            payload.start_time = selectedSlot;
            payload.room_id = roomId;
        }

        router.post('/cart', payload, {
            headers: { 'X-Cart-UID': uid },
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
                                                    {/* Room Selection */}
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                            <HomeIcon className="w-4 h-4" /> Pilih Ruangan Studio
                                                        </label>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {(roomInfos.length > 0 ? roomInfos : rooms).map((room) => (
                                                                <button
                                                                    key={room.id}
                                                                    onClick={() => setRoomId(room.id)}
                                                                    disabled={room.is_open === false}
                                                                    className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${roomId === room.id
                                                                        ? 'bg-brand-gold border-brand-gold text-brand-black shadow-lg scale-105'
                                                                        : 'bg-transparent border-black/5 dark:border-white/5 text-brand-black/40 dark:text-brand-white/40 hover:border-brand-gold/50 hover:bg-black/5'
                                                                        } ${room.is_open === false ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                                                                >
                                                                    {room.label || room.name} {room.is_open === false ? '(TUTUP)' : ''}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Time Slots */}
                                                    {date && (
                                                        <div className="space-y-3">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                                <ClockIcon className="w-4 h-4" /> Jadwal Tersedia
                                                            </label>

                                                            {loading ? (
                                                                <div className="text-center py-10 bg-black/5 rounded-2xl animate-pulse"><p className="text-xs font-bold uppercase tracking-widest opacity-20">Memeriksa...</p></div>
                                                            ) : error ? (
                                                                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs font-bold">{error}</div>
                                                            ) : slots.length === 0 ? (
                                                                <p className="text-center py-10 text-xs font-bold uppercase opacity-20">Tidak ada jadwal.</p>
                                                            ) : (
                                                                <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
                                                                    {slots.map((slot) => (
                                                                        <button
                                                                            key={slot}
                                                                            onClick={() => setSelectedSlot(slot)}
                                                                            className={`py-3 rounded-xl text-xs font-black transition-all border-2 ${selectedSlot === slot ? 'bg-brand-gold border-brand-gold text-brand-black' : 'bg-white dark:bg-white/5 border-black/5 hover:border-brand-gold/50'}`}
                                                                        >
                                                                            {getSlotDisplay(slot)}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {/* Photographer Selection */}
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                            <UserIcon className="w-4 h-4" /> Pilih Fotografer
                                                        </label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {photographers.map((fg) => (
                                                                <button
                                                                    key={fg.id}
                                                                    onClick={() => setPhotographerId(fg.id)}
                                                                    className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${photographerId === fg.id
                                                                        ? 'bg-brand-gold border-brand-gold text-brand-black shadow-lg'
                                                                        : 'bg-transparent border-black/5 dark:border-white/5 text-brand-black/40 dark:text-brand-white/40 hover:border-brand-gold/50 hover:bg-black/5'
                                                                        }`}
                                                                >
                                                                    {fg.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {photographers.length === 0 && !loading && (
                                                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Tidak ada fotografer tersedia pada tanggal ini.</p>
                                                        )}
                                                    </div>

                                                    {/* Session Selection */}
                                                    {photographerId && (
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                                    <ClockIcon className="w-4 h-4" /> Pilih Sesi ({selectedSessions.length}/{maxSessions})
                                                                </label>
                                                            </div>

                                                            {loading ? (
                                                                <div className="text-center py-10 bg-black/5 rounded-2xl animate-pulse"></div>
                                                            ) : (
                                                                <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
                                                                    {slots.map((session) => (
                                                                        <button
                                                                            key={session.id}
                                                                            onClick={() => toggleSession(session.id)}
                                                                            disabled={session.status === 'booked' || (session.status === 'off' && !selectedSessions.includes(session.id))}
                                                                            className={`py-3 rounded-lg text-[10px] font-black transition-all border-2 ${selectedSessions.includes(session.id)
                                                                                ? 'bg-green-500 border-green-500 text-white shadow-lg'
                                                                                : session.status === 'open'
                                                                                    ? 'bg-white dark:bg-white/5 border-brand-gold/30 text-brand-black dark:text-brand-white'
                                                                                    : 'bg-black/5 border-transparent opacity-20 cursor-not-allowed'
                                                                                }`}
                                                                        >
                                                                            {session.time}
                                                                            {session.block && <div className="text-[6px] opacity-60">{session.block}</div>}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {error && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest animate-shake">{error}</p>}
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
