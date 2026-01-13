import React, { useState } from 'react';
import GuestLayout from '../Layouts/GuestLayout';
import { Head, router } from '@inertiajs/react';

export default function SelectorPhoto() {
    const [step, setStep] = useState(1);
    const [uid, setUid] = useState('');
    const [driveType, setDriveType] = useState(''); // 'Mentahan', 'Result', or 'RequestEdit'
    const [selectedPhotos, setSelectedPhotos] = useState([]); // Array of objects {id, name}
    const [review, setReview] = useState('');
    const [drivePhotos, setDrivePhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

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
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch photos from drive
    const fetchPhotosFromDrive = async (folderType) => {
        setLoading(true);
        setError(null);

        // Map folderType to backend type
        const type = (folderType === 'Mentahan' || folderType === 'RequestEdit') ? 'raw' : 'edited';

        try {
            const response = await fetch(`/api/photo-selector/sessions/${uid}/photos?type=${type}`);
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
                if (prev.length >= (sessionData?.max_edit_requests || 20)) {
                    alert(`Maksimal pilihan foto adalah ${sessionData?.max_edit_requests || 20}`);
                    return prev;
                }
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
                    selectedPhotos: selectedPhotos.map(p => p.name), // Send filenames
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Gagal mengirim pilihan');

            alert(data.message || 'Pilihan foto berhasil dikirim!');
            resetFlow();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendReview = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/photo-selector/sessions/${uid}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    reviewText: review,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Gagal mengirim ulasan');

            alert(data.message || 'Terima kasih atas ulasan Anda!');
            resetFlow();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setUid('');
        setDriveType('');
        setSelectedPhotos([]);
        setReview('');
        setReview('');
        setSessionData(null);
        setIsSelectionMode(false);
    };

    const handleDownloadAll = () => {
        const folderId = driveType === 'Mentahan' ? sessionData?.raw_folder_id : sessionData?.edited_folder_id;
        if (folderId) {
            window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank');
        }
    };

    const handleDownloadSelected = () => {
        if (selectedPhotos.length === 0) return;

        let count = 0;
        const maxBatch = 5; // Prevent browser blocking too many popups

        const processBatch = () => {
            const batch = selectedPhotos.slice(count, count + maxBatch);
            batch.forEach(photo => {
                const photoData = drivePhotos.find(p => p.id === photo.id);
                if (photoData) window.open(photoData.downloadLink, '_blank');
            });

            count += maxBatch;
            if (count < selectedPhotos.length) {
                setTimeout(processBatch, 1000); // Delay between batches
            }
        };

        processBatch();
        alert(`Sedang mendownload ${selectedPhotos.length} foto... Jika popup terblokir, izinkan situs ini.`);
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

            <div className="pt-32 pb-20 px-6 min-h-screen transition-colors">
                <div className={`mx-auto transition-all duration-500 ${step >= 3 ? 'max-w-2xl' : 'max-w-md'}`}>
                    {/* Stepper */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center relative px-2">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/5 dark:bg-white/5 -translate-y-1/2 z-0"></div>
                            <div
                                className="absolute top-1/2 left-0 h-0.5 bg-brand-red -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${((step - 1) / 3) * 100}%` }}
                            ></div>

                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= i
                                        ? 'bg-brand-red text-white scale-110 shadow-lg shadow-brand-red/20'
                                        : 'bg-white dark:bg-brand-black border-2 border-black/10 dark:border-white/10 text-brand-black/40 dark:text-brand-white/40'
                                        }`}>
                                        {i}
                                    </div>
                                    <span className={`absolute -bottom-6 text-[7px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${step >= i ? 'text-brand-red' : 'text-brand-black/20 dark:text-brand-white/20'
                                        }`}>
                                        {['UID', 'Akses', 'Galeri', 'Pesan'][i - 1]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-500">
                        {step === 1 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-2">Identitas Anda</h2>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-medium">Masukkan UID untuk mengakses koleksi foto Anda.</p>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60">User ID (UID)</label>
                                    <input
                                        type="text"
                                        value={uid}
                                        onChange={(e) => setUid(e.target.value)}
                                        placeholder="Contoh: AF-TEST-001"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-mono"
                                    />
                                    {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">{error}</p>}
                                    <button
                                        onClick={validateUid}
                                        disabled={!uid || loading}
                                        className="w-full bg-brand-red hover:brightness-90 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-all disabled:opacity-20 shadow-xl shadow-brand-red/20"
                                    >
                                        {loading ? 'Memvalidasi...' : 'Lanjutkan'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-2">Pilih Aksi</h2>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-medium">Silakan pilih folder atau layanan yang ingin Anda akses.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => handleDriveSelection('Mentahan')}
                                        className="group relative h-28 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-gold hover:scale-[1.02]"
                                    >
                                        <div className="relative z-10 h-full flex items-center space-x-6 text-left">
                                            <span className="text-3xl group-hover:scale-110 transition-transform">📂</span>
                                            <div>
                                                <h3 className="text-brand-black dark:text-brand-white font-black uppercase text-xs tracking-widest">Foto Mentahan</h3>
                                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-bold">Lihat & Download foto original.</p>
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
                                <div className="text-center">
                                    <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase mb-2">
                                        {driveType === 'Mentahan' ? 'Galeri Mentahan' : `Galeri ${driveType}`}
                                    </h2>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-medium">
                                        <div className="flex justify-center gap-2 mt-2">
                                            {driveType === 'Mentahan' && (
                                                <button
                                                    onClick={() => setIsSelectionMode(!isSelectionMode)}
                                                    className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest text-[9px] transition-all border ${isSelectionMode ? 'bg-brand-red text-white border-brand-red' : 'bg-transparent text-brand-black dark:text-brand-white border-black/10 dark:border-white/10 hover:bg-black/5'}`}
                                                >
                                                    {isSelectionMode ? 'Selesai Memilih' : 'Pilih Foto'}
                                                </button>
                                            )}
                                            <button
                                                onClick={handleDownloadAll}
                                                className="px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest text-[9px] transition-all border border-black/10 dark:border-white/10 hover:bg-black/5 text-brand-black dark:text-brand-white"
                                            >
                                                Download Folder
                                            </button>
                                        </div>
                                    </p>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                        <div className="w-8 h-8 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin"></div>
                                        <p className="text-brand-black/50 dark:text-brand-white/50 text-[10px] font-bold uppercase tracking-widest">Memuat Galeri...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-2 px-1">
                                            <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 uppercase font-bold tracking-widest">{drivePhotos.length} Foto</p>
                                            {isSelectionMode && (
                                                <p className="text-[9px] text-brand-gold uppercase font-bold tracking-widest">{selectedPhotos.length} / {sessionData?.max_edit_requests || 20} Terpilih</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 mb-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                            {drivePhotos.map((photo, index) => {
                                                const isSelected = selectedPhotos.some(p => p.id === photo.id);
                                                return (
                                                    <div key={photo.id} className="group relative aspect-square">
                                                        <div
                                                            onClick={() => isSelectionMode ? togglePhoto(photo) : window.open(photo.downloadLink, '_blank')}
                                                            className={`w-full h-full rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${isSelected ? 'border-brand-red ring-2 ring-brand-red/20' : 'border-transparent hover:border-black/20 dark:hover:border-white/20'}`}
                                                        >
                                                            <img src={photo.thumbnail} alt={photo.name} className="w-full h-full object-cover" />
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
                                        <div className="flex gap-4">
                                            <button onClick={() => setStep(2)} className="flex-1 text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5">Kembali</button>

                                            {isSelectionMode && selectedPhotos.length > 0 && (
                                                <button
                                                    onClick={handleDownloadSelected}
                                                    className="flex-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-brand-black dark:text-brand-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] shadow-sm border border-black/5"
                                                >
                                                    Download ({selectedPhotos.length})
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setStep(4)}
                                                disabled={driveType === 'Mentahan' && (!isSelectionMode || selectedPhotos.length === 0)}
                                                className={`flex-2 bg-brand-gold hover:bg-yellow-600 text-brand-black font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-xl disabled:opacity-50 ${driveType === 'Mentahan' && !isSelectionMode ? 'hidden' : ''}`}
                                            >
                                                {driveType === 'Mentahan'
                                                    ? `Lanjut Request (${selectedPhotos.length})`
                                                    : 'Lanjut ke Review'}
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
                                        {selectedPhotos.length > 0 ? 'Finalisasi Request' : 'Kirim Ulasan'}
                                    </h2>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-medium">
                                        {selectedPhotos.length > 0 ? 'Cek kembali foto pilihan Anda.' : 'Feedback Anda sangat berarti bagi kami.'}
                                    </p>
                                </div>

                                {selectedPhotos.length > 0 && (
                                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Ringkasan Pilihan</h3>
                                            <span className="text-[10px] font-bold text-brand-red">{selectedPhotos.length} Foto</span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2 max-h-24 overflow-y-auto scrollbar-none">
                                            {selectedPhotos.map((photo, i) => (
                                                <div key={i} className="aspect-square bg-black/20 rounded-md overflow-hidden opacity-50">
                                                    <img src={drivePhotos.find(p => p.id === photo.id)?.thumbnail} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60">
                                        {selectedPhotos.length > 0 ? 'Pesan Tambahan (Opsional)' : 'Ulasan Anda'}
                                    </label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder={selectedPhotos.length > 0 ? "Catatan untuk editor..." : "Tulis pengalaman Anda..."}
                                        rows="4"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-gold transition-all text-sm font-medium"
                                    />
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(3)} className="flex-1 text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest border border-black/10 dark:border-white/10 rounded-xl">Kembali</button>
                                        <button
                                            onClick={selectedPhotos.length > 0 ? handleSendEditRequest : handleSendReview}
                                            disabled={loading || (selectedPhotos.length === 0 && !review)}
                                            className="flex-2 bg-brand-gold hover:bg-brand-red hover:text-white text-brand-black font-black py-4 uppercase tracking-widest transition-all rounded-xl disabled:opacity-50 text-xs shadow-xl shadow-brand-gold/20"
                                        >
                                            {loading ? 'Mengirim...' : 'Kirim'}
                                        </button>
                                    </div>
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
                        <div className="text-center sm:text-right">
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Status Keamanan</p>
                            <div className="flex items-center justify-center sm:justify-end space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-brand-black/60 dark:text-brand-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Encrypted Connection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {previewIndex !== null && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closePreview}>
                    <button onClick={closePreview} className="fixed top-6 right-6 p-4 text-white hover:text-brand-red z-110">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <button onClick={handlePrev} className="fixed left-6 p-4 text-white hover:text-brand-gold z-110 bg-white/5 rounded-full"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                    <div className="w-full h-full flex flex-col items-center justify-center p-4" onClick={e => e.stopPropagation()}>
                        <img
                            src={drivePhotos[previewIndex].thumbnail.replace('s220', 's0')}
                            alt={drivePhotos[previewIndex].name}
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
        </GuestLayout>
    );
}
