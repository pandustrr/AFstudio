import React, { useState, useEffect } from 'react';
import GuestLayout from '../Layouts/GuestLayout';
import { Head, router } from '@inertiajs/react';
import { StarIcon, XMarkIcon, CameraIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import EditNotif from '@/Components/EditNotif';

export default function SelectorPhoto() {
    const [step, setStep] = useState(1);
    const [uid, setUid] = useState('');

    useEffect(() => {
        const savedUid = localStorage.getItem('afstudio_cart_uid');
        if (savedUid) {
            setUid(savedUid);
        }
    }, []);
    const [driveType, setDriveType] = useState(''); // 'Mentahan', 'Result', or 'RequestEdit'
    const [selectedPhotos, setSelectedPhotos] = useState([]); // Array of objects {id, name}
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewPhoto, setReviewPhoto] = useState(null);
    const [drivePhotos, setDrivePhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [isSelectionMode, setIsSelectionMode] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successType, setSuccessType] = useState('request');
    const [editQuotaRemaining, setEditQuotaRemaining] = useState(0);
    const [maxEditQuota, setMaxEditQuota] = useState(0);
    const [quotaRequest, setQuotaRequest] = useState('');
    const [isRequestingQuota, setIsRequestingQuota] = useState(false);
    const [showQuotaInput, setShowQuotaInput] = useState(false);
    const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

    // Swipe State
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            setPreviewIndex(prev => (prev < drivePhotos.length - 1 ? prev + 1 : 0));
        }
        if (isRightSwipe) {
            setPreviewIndex(prev => (prev > 0 ? prev - 1 : drivePhotos.length - 1));
        }
    };

    // Validate UID
    const validateUid = async () => {
        if (!uid) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/photo-selector/sessions/${uid}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'UID tidak valid');
            }

            setSessionData(data.data);
            // Set max edit quota from package (default 0 if not available)
            setMaxEditQuota(data.data.max_editing_quota || 0);
            setEditQuotaRemaining((data.data.max_editing_quota || 0) - (data.data.requested_count || 0));
            setQuotaRequest(data.data.quota_request || '');
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch photos from drive
    const fetchPhotosFromDrive = async (folderType, isRefresh = false) => {
        setLoading(true);
        setError(null);

        // Map folderType to backend type
        const type = (folderType === 'Mentahan' || folderType === 'RequestEdit') ? 'raw' : 'edited';
        const folderId = (folderType === 'Mentahan' || folderType === 'RequestEdit') ? sessionData?.raw_folder_id : sessionData?.edited_folder_id;

        try {
            const response = await fetch(`/api/photo-selector/sessions/${uid}/photos?type=${type}${isRefresh ? '&refresh=true' : ''}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gagal mengambil foto');
            }

            if (data.success && data.photos) {
                setDrivePhotos(data.photos);
            } else {
                setDrivePhotos([]);
            }
        } catch (err) {
            console.error('Error fetching photos:', err);
            setError(err.message);
            setDrivePhotos([]);
        } finally {
            setLoading(false);
        }
    };

    const togglePhoto = (photo) => {
        setSelectedPhotos(prev => {
            const isSelected = prev.some(p => p.id === photo.id);
            if (isSelected) {
                return prev.filter(p => p.id !== photo.id);
            } else {
                return [...prev, { id: photo.id, name: photo.name }];
            }
        });
    };

    const handleSendEditRequest = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/photo-selector/sessions/${uid}/edit-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    selectedPhotos: selectedPhotos, // Send full objects {id, name}
                }),
            });

            if (response.status === 419) {
                alert('Sesi Anda telah berakhir, halaman akan dimuat ulang.');
                window.location.reload();
                return;
            }

            const data = await response.json();
            if (!response.ok) {
                console.error('API Error:', data);
                throw new Error(data.error || data.message || 'Gagal mengirim pilihan');
            }

            // Sync session data with updated info from server
            if (data.session) {
                setSessionData(prev => ({
                    ...prev,
                    ...data.session
                }));
                // Update remaining quota
                if (data.session.edit_quota_remaining !== undefined) {
                    setEditQuotaRemaining(data.session.edit_quota_remaining);
                }
            }

            setSuccessType('request');
            setShowSuccessModal(true);
        } catch (err) {
            console.error('Submission Catch:', err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendReview = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('reviewText', review);
            formData.append('rating', rating);
            if (reviewPhoto) {
                formData.append('photo', reviewPhoto);
            }

            const response = await fetch(`/api/photo-selector/sessions/${uid}/review`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: formData,
            });

            if (response.status === 419) {
                alert('Sesi Anda telah berakhir, halaman akan dimuat ulang.');
                window.location.reload();
                return;
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Gagal mengirim ulasan');

            // alert(data.message || 'Terima kasih atas ulasan Anda!');
            // resetFlow();
            setSuccessType('review');
            setShowSuccessModal(true);
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendQuotaRequest = async () => {
        if (!quotaRequest || isRequestingQuota) return;
        setIsRequestingQuota(true);
        try {
            const response = await fetch(`/api/photo-selector/sessions/${uid}/quota-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({ quota_request: quotaRequest }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Gagal mengirim permintaan');

            setSessionData(prev => ({ ...prev, quota_request: quotaRequest }));
            setNotif({
                show: true,
                message: 'Permintaan kuota tambahan telah dikirim ke admin.',
                type: 'success'
            });
            setShowQuotaInput(false);
        } catch (err) {
            setNotif({
                show: true,
                message: 'Error: ' + err.message,
                type: 'error'
            });
        } finally {
            setIsRequestingQuota(false);
        }
    };

    const resetFlow = (toStep = 1) => {
        setStep(toStep);
        if (toStep === 1) {
            setUid('');
            setSessionData(null);
        }
        setDriveType('');
        setSelectedPhotos([]);
        setReview('');
        setRating(5);
        setReviewPhoto(null);
        setIsSelectionMode(true);
    };

    const triggerDownload = (id) => {
        const photoData = drivePhotos.find(p => p.id === id);
        if (photoData?.downloadLink) {
            window.open(photoData.downloadLink, '_blank');
        }
    };

    const handleDownloadAll = () => {
        if (drivePhotos.length === 0) return;

        if (confirm(`Download semua ${drivePhotos.length} foto secara individual?`)) {
            let count = 0;
            const maxBatch = 5;

            const processBatch = () => {
                const batch = drivePhotos.slice(count, count + maxBatch);
                batch.forEach(photo => triggerDownload(photo.id));

                count += maxBatch;
                if (count < drivePhotos.length) {
                    setTimeout(processBatch, 1500); // 1.5s delay to avoid browser blocking
                }
            };

            processBatch();
            alert(`Memulai download ${drivePhotos.length} foto... Harap izinkan popup jika diminta browser.`);
        }
    };

    const handleDownloadSelected = () => {
        if (selectedPhotos.length === 0) return;

        let count = 0;
        const maxBatch = 5;

        const processBatch = () => {
            const batch = selectedPhotos.slice(count, count + maxBatch);
            batch.forEach(photo => triggerDownload(photo.id));

            count += maxBatch;
            if (count < selectedPhotos.length) {
                setTimeout(processBatch, 1500);
            }
        };

        processBatch();
        alert(`Mendownload ${selectedPhotos.length} foto... Jika proses terhenti, harap izinkan popup untuk situs ini.`);
    };

    const handleDriveSelection = (folderType) => {
        const hasFolder = (folderType === 'Mentahan' || folderType === 'RequestEdit')
            ? sessionData?.has_raw
            : sessionData?.has_edited;

        if (!hasFolder) {
            alert(`${folderType} belum tersedia untuk UID ini.`);
            return;
        }

        setDriveType(folderType);
        setSelectedPhotos([]); // Clear selections when switching folders
        setStep(3);
        fetchPhotosFromDrive(folderType);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setPreviewIndex(prev => (prev > 0 ? prev - 1 : drivePhotos.length - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setPreviewIndex(prev => (prev < drivePhotos.length - 1 ? prev + 1 : 0));
    };

    const closePreview = () => setPreviewIndex(null);

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (previewIndex === null) return;
            if (e.key === 'ArrowLeft') handlePrev(e);
            if (e.key === 'ArrowRight') handleNext(e);
            if (e.key === 'Escape') closePreview();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [previewIndex]);

    return (
        <GuestLayout>
            <Head title="Selector Photo" />

            <div className="relative z-10 pt-24 md:pt-32 pb-20 px-6 min-h-screen transition-colors">
                <div className={`relative z-10 mx-auto transition-all duration-500 ${step >= 3 ? 'max-w-2xl' : 'max-w-md'}`}>
                    {/* Stepper */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center relative px-2">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/5 dark:bg-white/5 -translate-y-1/2 z-0"></div>
                            <div
                                className="absolute top-1/2 left-0 h-0.5 bg-brand-red -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${((step - 1) / ((driveType === 'Mentahan' ? 3 : 4) - 1)) * 100}%` }}
                            ></div>

                            {[1, 2, 3, 4].slice(0, driveType === 'Mentahan' ? 3 : 4).map((i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= i
                                        ? 'bg-brand-red text-white scale-110 shadow-lg shadow-brand-red/20'
                                        : 'bg-white dark:bg-brand-black border-2 border-black/10 dark:border-white/10 text-brand-black/40 dark:text-brand-white/40'
                                        }`}>
                                        {i}
                                    </div>
                                    <span className={`absolute -bottom-6 text-[7px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${step >= i ? 'text-brand-red' : 'text-brand-black/20 dark:text-brand-white/20'
                                        }`}>
                                        {['UID', 'Akses', 'Galeri', 'Ulasan'][i - 1]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl p-8 sm:p-10 shadow-2xl transition-all duration-500">
                        {step === 1 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <h2 className="text-3xl font-black text-brand-black dark:text-brand-white uppercase mb-2 tracking-tighter">Masukkan UID</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-1">Diberikan setelah Booking</p>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest">Masukkan kode unik untuk mengakses koleksi foto Anda.</p>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60">User ID (UID)</label>
                                    <input
                                        type="text"
                                        value={uid}
                                        onChange={(e) => setUid(e.target.value)}
                                        placeholder="Contoh: nama-angka"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-mono"
                                    />
                                    {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">{error}</p>}
                                    <button
                                        onClick={validateUid}
                                        disabled={!uid || loading}
                                        className="w-full bg-brand-red hover:brightness-90 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-all disabled:opacity-20 shadow-xl shadow-brand-red/20"
                                    >
                                        {loading ? 'Memvalidasi...' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-2">Pilih Aksi</h2>
                                    <div className="flex flex-col items-center gap-1 mb-4">
                                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest leading-none">Silakan pilih folder atau layanan yang ingin Anda akses.</p>

                                        {/* Booking Detail Section */}
                                        {sessionData?.booking && (
                                            <div className="w-full mt-6 mb-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 text-left animate-in fade-in slide-in-from-top-2 duration-500">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="text-[10px] font-black text-brand-red uppercase tracking-widest mb-1">Detail Jadwal</h4>
                                                        <p className="text-xs font-black text-brand-black dark:text-brand-white uppercase truncate">{sessionData.booking.package_name}</p>
                                                    </div>
                                                    <div className="bg-brand-gold/10 px-2 py-1 rounded-md">
                                                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-tighter">Room {sessionData.booking.room_id}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-black/5 dark:bg-white/10 rounded-lg text-brand-black dark:text-brand-white">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-brand-black/60 dark:text-brand-white/60">
                                                            {(() => {
                                                                const [y, m, d] = sessionData.booking.scheduled_date.split('-').map(Number);
                                                                return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    timeZone: 'UTC'
                                                                });
                                                            })()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-black/5 dark:bg-white/10 rounded-lg text-brand-black dark:text-brand-white">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-brand-black/60 dark:text-brand-white/60">
                                                            {sessionData.booking.start_time.substring(0, 5)} - {sessionData.booking.end_time.substring(0, 5)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col items-center gap-2 mt-2 w-full">
                                            <div className="bg-brand-gold/10 border-2 border-brand-gold/40 rounded-full px-6 py-1.5 animate-pulse-subtle">
                                                <p className="text-brand-gold text-[10px] font-black uppercase tracking-widest">
                                                    Kuota Editing: {editQuotaRemaining} / {maxEditQuota} Foto
                                                </p>
                                            </div>

                                            {!showQuotaInput ? (
                                                <button
                                                    onClick={() => setShowQuotaInput(true)}
                                                    className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-gold hover:brightness-110 transition-all"
                                                >
                                                    {sessionData?.quota_request ? 'Update Request Kuota' : '+ Request Tambah Kuota'}
                                                </button>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 w-full animate-in fade-in slide-in-from-top-1 duration-300">
                                                    <input
                                                        type="text"
                                                        value={quotaRequest}
                                                        onChange={(e) => setQuotaRequest(e.target.value)}
                                                        placeholder="Contoh: Tambah 5 foto lagi..."
                                                        className="w-full max-w-[200px] bg-black/5 dark:bg-white/5 border border-brand-gold/20 rounded-lg px-3 py-1.5 text-[10px] text-brand-black dark:text-brand-white font-bold focus:outline-none focus:border-brand-gold"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSendQuotaRequest}
                                                            disabled={isRequestingQuota}
                                                            className="text-[9px] font-black uppercase tracking-widest text-brand-gold hover:underline disabled:opacity-50"
                                                        >
                                                            {isRequestingQuota ? 'Kirim...' : 'Kirim'}
                                                        </button>
                                                        <button
                                                            onClick={() => setShowQuotaInput(false)}
                                                            className="text-[9px] font-black uppercase tracking-widest text-brand-red hover:underline"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => handleDriveSelection('Mentahan')}
                                        disabled={!sessionData?.has_raw}
                                        className={`group relative h-28 border rounded-2xl p-6 overflow-hidden transition-all ${sessionData?.has_raw
                                            ? 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-brand-gold hover:scale-[1.02]'
                                            : 'bg-black/5 dark:bg-white/2 opacity-30 cursor-not-allowed border-transparent'}`}
                                    >
                                        <div className="relative z-10 h-full flex items-center space-x-6 text-left">
                                            <span className="text-3xl group-hover:scale-110 transition-transform">{sessionData?.has_raw ? '📂' : '🔒'}</span>
                                            <div>
                                                <h3 className="text-brand-black dark:text-brand-white font-black uppercase text-xs tracking-widest">Foto Mentahan</h3>
                                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-bold">
                                                    {sessionData?.has_raw ? 'Lihat & Download foto original.' : 'Foto belum di-upload admin.'}
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleDriveSelection('Result')}
                                        disabled={!sessionData?.has_edited}
                                        className={`group relative h-28 border rounded-2xl p-6 overflow-hidden transition-all ${sessionData?.has_edited
                                            ? 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-green-500 hover:scale-[1.02]'
                                            : 'bg-black/5 dark:bg-white/2 opacity-30 cursor-not-allowed border-transparent'}`}
                                    >
                                        <div className="relative z-10 h-full flex items-center space-x-6 text-left">
                                            <span className="text-3xl group-hover:scale-110 transition-transform">{sessionData?.has_edited ? '✨' : '🔒'}</span>
                                            <div>
                                                <h3 className="text-brand-black dark:text-brand-white font-black uppercase text-xs tracking-widest">Foto Hasil Edit</h3>
                                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-bold">
                                                    {sessionData?.has_edited ? 'Hasil foto siap di-download.' : 'Sedang diproses editor.'}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <button onClick={() => setStep(1)} className="w-full text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-brand-red transition-colors text-center">Kembali ke UID</button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex flex-col items-center gap-1 mb-4">
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-xs sm:text-sm font-black uppercase tracking-widest leading-none">
                                        {driveType === 'Mentahan' ? 'Galeri Mentahan' : `Galeri ${driveType}`}
                                    </p>
                                    {driveType === 'Mentahan' && (
                                        <div className="bg-brand-gold/10 border-2 border-brand-gold/40 rounded-full px-5 py-1 mt-1 mb-3">
                                            <p className="text-brand-gold text-[9px] font-black uppercase tracking-widest leading-tight">
                                                Kuota Editing: {sessionData?.requested_count || 0} / {maxEditQuota} Foto
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                        <div className="w-8 h-8 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin"></div>
                                        <p className="text-brand-black/50 dark:text-brand-white/50 text-[10px] font-bold uppercase tracking-widest">Memuat Galeri...</p>
                                    </div>
                                ) : drivePhotos.length === 0 ? (
                                    <div className="py-20 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl animate-fade-in">
                                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">Foto masih belum di upload oleh admin</p>
                                        <button onClick={() => setStep(2)} className="mt-4 text-[10px] font-black uppercase tracking-widest text-brand-red hover:underline">Kembali</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-2 px-1">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 uppercase font-bold tracking-widest">{drivePhotos.length} Foto</p>
                                                <button
                                                    onClick={() => fetchPhotosFromDrive(driveType, true)}
                                                    className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all text-brand-black/20 hover:text-brand-gold"
                                                    title="Refresh dari Drive"
                                                >
                                                    <svg className={`w-3 h-3 ${loading ? 'animate-spin text-brand-gold' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                            {drivePhotos.map((photo, index) => {
                                                const isSelected = selectedPhotos.some(p => p.id === photo.id);
                                                return (
                                                    <div key={photo.id} className="group relative aspect-square">
                                                        <div
                                                            onClick={() => togglePhoto(photo)}
                                                            className={`w-full h-full rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${isSelected ? 'border-brand-red ring-2 ring-brand-red/20' : 'border-transparent hover:border-black/20 dark:hover:border-white/20'}`}
                                                        >
                                                            <img src={photo.thumbnail?.replace('=s220', '=s300')} alt={photo.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                                            {isSelected && (
                                                                <div className="absolute top-2 right-2 w-5 h-5 bg-brand-red rounded-full flex items-center justify-center z-10">
                                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
                                                                <p className="text-[8px] text-white truncate font-mono font-bold">{photo.name}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setPreviewIndex(index); }}
                                                            className="absolute top-2 left-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10 hover:bg-brand-red"
                                                        >
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="w-full sm:w-11 h-11 flex items-center justify-center text-brand-black/40 dark:text-brand-white/40 border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 transition-all"
                                                title="Kembali"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <div className="flex gap-2 sm:gap-3 flex-1">
                                                <button
                                                    onClick={handleDownloadAll}
                                                    className="flex-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-brand-black dark:text-brand-white font-black py-2.5 rounded-xl uppercase tracking-widest text-[8px] sm:text-[9px] shadow-sm border border-black/5"
                                                >
                                                    Download Semua
                                                </button>

                                                {selectedPhotos.length > 0 && (
                                                    <button
                                                        onClick={handleDownloadSelected}
                                                        className="flex-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-brand-black dark:text-brand-white font-black py-2.5 rounded-xl uppercase tracking-widest text-[8px] sm:text-[9px] shadow-sm border border-black/5"
                                                    >
                                                        Download yang dipilih ({selectedPhotos.length})
                                                    </button>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => driveType === 'Mentahan' ? handleSendEditRequest() : setStep(4)}
                                                disabled={driveType === 'Mentahan' && (selectedPhotos.length === 0 || selectedPhotos.length > (maxEditQuota - (sessionData?.requested_count || 0)))}
                                                className="w-full sm:flex-1 bg-brand-gold hover:brightness-90 text-brand-black font-black py-3 sm:py-2.5 rounded-xl uppercase tracking-widest text-[10px] shadow-xl disabled:opacity-50 transition-all font-black px-6"
                                            >
                                                {driveType === 'Mentahan' ? (
                                                    selectedPhotos.length > 0 ? (
                                                        (selectedPhotos.length > (maxEditQuota - (sessionData?.requested_count || 0)))
                                                            ? `Kelebihan (${(sessionData?.requested_count || 0) + selectedPhotos.length} / ${maxEditQuota})`
                                                            : `Request Editing (${(sessionData?.requested_count || 0) + selectedPhotos.length} / ${maxEditQuota})`
                                                    ) : `Pilih Foto`
                                                ) : `Lanjut Review`}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-2">
                                        {driveType === 'Result' ? 'Kirim Ulasan' : (selectedPhotos.length > 0 ? 'Finalisasi Request' : 'Kirim Ulasan')}
                                    </h2>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-medium">
                                        {driveType === 'Result' ? 'Berikan ulasan untuk sesi foto Anda.' : (selectedPhotos.length > 0 ? 'Cek kembali foto pilihan Anda.' : 'Feedback Anda sangat berarti bagi kami.')}
                                    </p>
                                </div>

                                {selectedPhotos.length > 0 && driveType === 'Mentahan' && (
                                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Ringkasan Pilihan</h3>
                                            <span className="text-[10px] font-bold text-brand-red">{selectedPhotos.length} Foto</span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2 max-h-24 overflow-y-auto scrollbar-none">
                                            {selectedPhotos.map((photo, i) => (
                                                <div key={i} className="aspect-square bg-black/20 rounded-md overflow-hidden opacity-50">
                                                    <img src={drivePhotos.find(p => p.id === photo.id)?.thumbnail} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!(driveType === 'Mentahan' && selectedPhotos.length > 0) && (
                                    <div className="space-y-6">
                                        {/* Star Rating */}
                                        <div className="flex flex-col items-center space-y-3">
                                            <label className="text-[10px] uppercase font-black tracking-widest text-brand-black/40 dark:text-brand-white/40">Berikan Bintang</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className="transition-all hover:scale-110 active:scale-90"
                                                    >
                                                        {rating >= star ? (
                                                            <StarIcon className="w-8 h-8 text-brand-gold" />
                                                        ) : (
                                                            <StarOutlineIcon className="w-8 h-8 text-black/10 dark:text-white/10" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Photo Upload */}
                                        <div className="space-y-3">
                                            <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60">Upload Foto Kenangan (Opsional)</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setReviewPhoto(e.target.files[0])}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                />
                                                <div className={`w-full bg-black/5 dark:bg-white/5 border-2 border-dashed ${reviewPhoto ? 'border-brand-gold bg-brand-gold/5' : 'border-black/10 dark:border-white/10 group-hover:border-brand-gold/40'} rounded-2xl p-4 transition-all overflow-hidden`}>
                                                    {reviewPhoto ? (
                                                        <div className="space-y-4">
                                                            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-brand-gold/20">
                                                                <img
                                                                    src={URL.createObjectURL(reviewPhoto)}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReviewPhoto(null); }}
                                                                    className="absolute top-2 right-2 p-2 bg-brand-red text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all z-30"
                                                                >
                                                                    <XMarkIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <span
                                                                    className="
                                                                        text-[9px] font-black uppercase tracking-widest
                                                                        text-brand-gold truncate max-w-[150px]
                                                                    "
                                                                >
                                                                    {reviewPhoto.name}
                                                                </span>
                                                                <span className="text-[8px] font-bold text-brand-black/20 dark:text-brand-white/20">{(reviewPhoto.size / 1024 / 1024).toFixed(2)} MB</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="py-8 text-center">
                                                            <CameraIcon className="w-8 h-8 mx-auto mb-2 text-brand-black/20 dark:text-brand-white/20" />
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Ambil Foto / Pilih File</p>
                                                            <p className="text-[8px] font-bold text-brand-black/20 dark:text-brand-white/20 uppercase tracking-widest mt-1">Maksimal 5MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60">
                                                {driveType === 'Result' ? 'Ulasan Anda' : (selectedPhotos.length > 0 ? 'Pesan Tambahan (Opsional)' : 'Ulasan Anda')}
                                            </label>
                                            <textarea
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                placeholder={selectedPhotos.length > 0 ? "Catatan untuk editor..." : "Tulis pengalaman Anda..."}
                                                rows="4"
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-gold transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(3)} className="flex-1 text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest border border-black/10 dark:border-white/10 rounded-xl">Kembali</button>
                                    <button
                                        onClick={driveType === 'Mentahan' && selectedPhotos.length > 0 ? handleSendEditRequest : handleSendReview}
                                        disabled={loading || (driveType === 'Result' && !review) || (driveType === 'Mentahan' && selectedPhotos.length === 0 && !review)}
                                        className="flex-2 bg-brand-gold hover:bg-brand-red hover:text-white text-brand-black font-black py-4 uppercase tracking-widest transition-all rounded-xl disabled:opacity-50 text-xs shadow-xl shadow-brand-gold/20"
                                    >
                                        {loading ? 'Mengirim...' : 'Kirim'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 px-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center">
                                <span className="text-brand-red text-xs">📞</span>
                            </div>
                            <div>
                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[8px] font-black uppercase tracking-widest">Butuh Bantuan?</p>
                                <p className="text-brand-black dark:text-brand-white text-[10px] font-black">WhatsApp Admin: +62 812-3456-7890</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {previewIndex !== null && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/95"
                    onClick={closePreview}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    style={{ touchAction: 'none' }}
                >
                    <button onClick={closePreview} className="fixed top-6 right-6 p-4 text-white hover:text-brand-red z-110">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <button onClick={handlePrev} className="fixed left-6 p-4 text-white hover:text-brand-gold z-110 bg-white/5 rounded-full"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                    <div className="w-full h-full flex flex-col items-center justify-center p-4" onClick={e => e.stopPropagation()}>
                        <img
                            src={drivePhotos[previewIndex].thumbnail.replace('s220', 's0')}
                            alt={drivePhotos[previewIndex].name}
                            referrerPolicy="no-referrer"
                            className="max-w-5xl max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="mt-8 text-center bg-black/40 px-6 py-3 rounded-full border border-white/10">
                            <p className="text-white font-mono text-xs mb-1 uppercase tracking-widest">{drivePhotos[previewIndex].name}</p>
                            <p className="text-white/40 text-[10px] font-bold">{previewIndex + 1} / {drivePhotos.length}</p>
                        </div>
                    </div>
                    <button onClick={handleNext} className="fixed right-6 p-4 text-white hover:text-brand-gold z-110 bg-white/5 rounded-full"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
                </div>
            )}
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 animate-fade-in">
                    <div className="bg-white dark:bg-brand-black border border-black/10 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl space-y-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-3xl">✅</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-brand-black dark:text-brand-white uppercase mb-2">
                                {successType === 'request' ? 'Permintaan Terkirim!' : 'Ulasan Terkirim!'}
                            </h3>
                            <p className="text-brand-black/60 dark:text-brand-white/60 text-xs font-medium leading-relaxed">
                                {successType === 'request' ? (
                                    <>
                                        Mohon tunggu proses editing sekitar 7-14 hari.<br />
                                        Silakan cek lagi dengan memasukkan UID yang sama nanti.
                                    </>
                                ) : (
                                    <>
                                        Terima kasih telah memberikan ulasan Anda.<br />
                                        Review Anda sangat berarti bagi kami!
                                    </>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={() => { setShowSuccessModal(false); resetFlow(2); }}
                            className="w-full bg-brand-gold hover:brightness-90 text-brand-black font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-xl transition-all"
                        >
                            Oke, Mengerti
                        </button>
                    </div>
                </div>
            )}

            <EditNotif
                show={notif.show}
                onClose={() => setNotif({ ...notif, show: false })}
                message={notif.message}
                type={notif.type}
            />
        </GuestLayout>
    );
}
