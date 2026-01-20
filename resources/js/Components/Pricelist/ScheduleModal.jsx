import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon, HomeIcon, ExclamationTriangleIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';
import IdentityPromptModal from './Modals/IdentityPromptModal';
import SuccessModal from './Modals/SuccessModal';

export default function ScheduleModal({ isOpen, onClose, packageData, rooms: initialRooms = [], canBook = false }) {
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
        if (date && packageData && canBook) {
            if (isPhotographerMode) {
                fetchPhotographerAvailability();
            } else if (roomId) {
                fetchAvailability();
            }
        }
    }, [date, roomId, photographerId, canBook]);

    // Hoisted function to avoid ReferenceError
    function handleIdentityConfirmed(name) {
        const cleanName = name.trim().toUpperCase().replace(/\s+/g, '');
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        const newUid = `${cleanName}-${randomStr}`;

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

    const whatsappLink = `https://wa.me/6281230487469?text=Halo%20Admin%2C%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(packageData?.name || '')}.%20Boleh%20mohon%20info%20lebih%20lanjut%3F`;

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
                                                        {packageData?.price_display ? packageData.price_display : (packageData?.price_numeric ? formatPrice(packageData.price_numeric) : '')}
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
                                            {!canBook ? (
                                                <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
                                                    <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-2">
                                                        <UserIcon className="w-8 h-8 text-brand-gold" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black uppercase text-brand-black dark:text-brand-white mb-2">
                                                            Konsultasi Paket
                                                        </h4>
                                                        <p className="text-xs text-brand-black/60 dark:text-brand-white/60 leading-relaxed max-w-xs mx-auto">
                                                            Untuk pemesanan paket ini, silakan hubungi admin kami terlebih dahulu untuk memastikan ketersediaan dan detail sesi.
                                                        </p>
                                                    </div>

                                                    <a
                                                        href={whatsappLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 hover:scale-105 transition-all shadow-xl"
                                                    >
                                                        <span>Hubungi Admin</span>
                                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.248-.57-.397m-5.473 7.846h-3.021a8.532 8.532 0 01-6.732-4.2l-.721 1.055-3.033.407 1.844-3.565a8.498 8.498 0 01-.734-2.228 8.544 8.544 0 011.536-5.525l.488-.692 3.033.407-1.844 3.565a6.526 6.526 0 00.569 1.636 6.58 6.58 0 004.862 3.864z" /></svg>
                                                    </a>
                                                </div>
                                            ) : (
                                                <>
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
                                                                    {(roomInfos?.length > 0 ? roomInfos : rooms).map((room) => (
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
                                                                    ) : (slots?.length === 0) ? (
                                                                        <p className="text-center py-10 text-xs font-bold uppercase opacity-20">Tidak ada jadwal.</p>
                                                                    ) : (
                                                                        <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
                                                                            {(slots || []).map((slot) => (
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
                                                                    {(photographers || []).map((fg) => (
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
                                                                {(photographers?.length === 0) && !loading && (
                                                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Tidak ada fotografer tersedia pada tanggal ini.</p>
                                                                )}
                                                            </div>

                                                            {/* Session Selection */}
                                                            {photographerId && (
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <label className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 flex items-center gap-2">
                                                                            <ClockIcon className="w-4 h-4" /> Pilih Sesi ({(selectedSessions || []).length}/{maxSessions})
                                                                        </label>
                                                                    </div>

                                                                    {loading ? (
                                                                        <div className="text-center py-10 bg-black/5 rounded-2xl animate-pulse"></div>
                                                                    ) : (
                                                                        <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
                                                                            {(slots || []).map((session) => (
                                                                                <button
                                                                                    key={session.id}
                                                                                    onClick={() => toggleSession(session.id)}
                                                                                    disabled={session.status === 'booked' || (session.status === 'off' && !(selectedSessions || []).includes(session.id))}
                                                                                    className={`py-3 rounded-lg text-[10px] font-black transition-all border-2 ${(selectedSessions || []).includes(session.id)
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
                                                </>
                                            )}
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
