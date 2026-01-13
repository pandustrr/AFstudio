import React, { useState } from 'react';
import GuestLayout from '../Layouts/GuestLayout';
import { Head, router } from '@inertiajs/react';

export default function SelectorPhoto() {
    const [step, setStep] = useState(1);
    const [uid, setUid] = useState('');
    const [driveType, setDriveType] = useState(''); // 'Mentahan' or 'Result'
    const [selectedPhotos, setSelectedPhotos] = useState([]); // Array of objects {id, name}
    const [review, setReview] = useState('');
    const [showGallery, setShowGallery] = useState(false);
    const [drivePhotos, setDrivePhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(null); // Index of photo being previewed

    // Configuration for Google Drive folders
    const driveFolders = {
        Mentahan: '19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI',
        Result: '' // Add Result folder ID when available
    };

    // Fetch photos from Google Drive
    const fetchPhotosFromDrive = async (folderType) => {
        const folderId = driveFolders[folderType];

        if (!folderId) {
            setError('Folder ID belum dikonfigurasi untuk ' + folderType);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/google-drive/photos?folderId=${folderId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gagal mengambil foto dari Google Drive');
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

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

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

    const handleSend = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/google-drive/selections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    uid,
                    driveType,
                    selectedPhotos,
                    review,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gagal mengirim pilihan foto');
            }

            alert('Pilihan foto berhasil dikirim ke Admin!');

            // Reset flow to UID step
            setStep(1);
            setUid('');
            setDriveType('');
            setSelectedPhotos([]);
            setReview('');
        } catch (err) {
            console.error('Error sending selections:', err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDriveSelection = (folderType) => {
        setDriveType(folderType);
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

    // Keyboard navigation for preview
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
                <div className={`mx-auto transition-all duration-500 ${step === 3 ? 'max-w-2xl' : 'max-w-md'}`}>
                    {/* Stepper */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center relative px-2">
                            {/* Connector Line */}
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
                    <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-500 overflow-hidden">
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
                                        placeholder="Contoh: AF-2024-XXXX"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-mono"
                                    />
                                    <button
                                        onClick={() => uid && setStep(2)}
                                        disabled={!uid}
                                        className="w-full bg-brand-red hover:bg-red-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition-all disabled:opacity-20 shadow-xl shadow-brand-red/20"
                                    >
                                        Lanjutkan
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-2">Pilih Drive</h2>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-medium">Silakan pilih folder foto yang ingin Anda akses.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => handleDriveSelection('Mentahan')}
                                        className="group relative h-32 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-gold hover:scale-[1.02]"
                                    >
                                        <div className="relative z-10 h-full flex flex-col justify-between items-start text-left">
                                            <span className="text-xl group-hover:scale-110 transition-transform">📂</span>
                                            <div>
                                                <h3 className="text-brand-black dark:text-brand-white font-black uppercase text-xs tracking-widest">Drive Mentahan</h3>
                                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-bold">Koleksi foto asli/original.</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-5xl italic group-hover:opacity-10 transition-opacity">01</div>
                                    </button>
                                    <button
                                        onClick={() => handleDriveSelection('Result')}
                                        className="group relative h-32 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-red hover:scale-[1.02]"
                                    >
                                        <div className="relative z-10 h-full flex flex-col justify-between items-start text-left">
                                            <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
                                            <div>
                                                <h3 className="text-brand-black dark:text-brand-white font-black uppercase text-xs tracking-widest">Drive Result</h3>
                                                <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-bold">Hasil foto yang sudah diedit.</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-5xl italic group-hover:opacity-10 transition-opacity">02</div>
                                    </button>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full text-brand-black/40 dark:text-brand-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-brand-red transition-colors"
                                >
                                    Kembali ke UID
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center">
                                    <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase mb-2">Pilih Foto</h2>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-medium">Klik untuk memilih. Bisa lebih dari satu.</p>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                        <div className="w-8 h-8 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin"></div>
                                        <p className="text-brand-black/50 dark:text-brand-white/50 text-[10px] font-bold uppercase tracking-widest">Menghubungkan dengan drive</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-10">
                                        <p className="text-red-400 text-xs mb-4 font-bold">{error}</p>
                                        <button onClick={() => fetchPhotosFromDrive(driveType)} className="text-brand-gold text-[10px] font-black uppercase tracking-widest hover:underline">Coba Lagi</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-2 px-1">
                                            <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 uppercase font-bold tracking-widest">
                                                {drivePhotos.length} Foto
                                            </p>
                                            <p className="text-[9px] text-brand-gold uppercase font-bold tracking-widest">
                                                {selectedPhotos.length} Terpilih
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 mb-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10">
                                            {drivePhotos.map((photo, index) => {
                                                const isSelected = selectedPhotos.some(p => p.id === photo.id);
                                                return (
                                                    <div key={photo.id} className="group relative aspect-square">
                                                        <div
                                                            onClick={() => togglePhoto(photo)}
                                                            className={`w-full h-full rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${isSelected ? 'border-brand-red ring-2 ring-brand-red/20' : 'border-transparent hover:border-black/20 dark:hover:border-white/20'}`}
                                                        >
                                                            <img
                                                                src={photo.thumbnail || `https://via.placeholder.com/200?text=${photo.name}`}
                                                                alt={photo.name}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                            {isSelected && (
                                                                <div className="absolute top-2 right-2 w-5 h-5 bg-brand-red rounded-full flex items-center justify-center shadow-lg border border-white/20 z-10">
                                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <p className="text-[8px] text-white truncate font-mono font-bold">{photo.name}</p>
                                                            </div>
                                                            {/* Full Dark Overlay on Hover for Button contrast */}
                                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                        </div>
                                                        {/* Preview Button Overlay */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setPreviewIndex(index); }}
                                                            className="absolute inset-0 m-auto w-10 h-10 bg-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all scale-75 group-hover:scale-100 z-10"
                                                        >
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="flex-1 text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest hover:text-brand-red transition-colors border border-black/10 dark:border-white/10 rounded-xl"
                                            >
                                                Kembali
                                            </button>
                                            <button
                                                onClick={() => setStep(4)}
                                                disabled={selectedPhotos.length === 0}
                                                className="flex-2 bg-brand-gold hover:bg-yellow-600 text-brand-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all disabled:opacity-20 shadow-xl"
                                            >
                                                Konfirmasi ({selectedPhotos.length})
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-2">Finalisasi</h2>
                                    <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-medium">Berikan ulasan Anda dan kirim pilihan foto.</p>
                                </div>

                                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Ringkasan Pilihan</h3>
                                        <span className="text-[10px] font-bold text-brand-red">{selectedPhotos.length} Foto</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 max-h-24 overflow-y-auto pr-2 scrollbar-none">
                                        {selectedPhotos.map((photo, i) => (
                                            <div key={i} className="aspect-square bg-black/20 rounded-md overflow-hidden opacity-50">
                                                <img src={drivePhotos.find(p => p.id === photo.id)?.thumbnail} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60">Pesan / Ulasan untuk Admin</label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Tuliskan catatan tambahan di sini..."
                                        rows="4"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-gold transition-all text-sm font-medium"
                                    />
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(3)}
                                            className="flex-1 text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest hover:text-brand-red transition-colors border border-black/10 dark:border-white/10 rounded-xl"
                                        >
                                            Ubah Pilihan
                                        </button>
                                        <button
                                            onClick={handleSend}
                                            disabled={loading}
                                            className="flex-2 bg-brand-gold hover:bg-brand-red hover:text-white text-brand-black font-black py-4 uppercase tracking-widest transition-all rounded-xl disabled:opacity-50 text-xs shadow-xl shadow-brand-gold/20"
                                        >
                                            {loading ? 'Mengirim...' : 'Kirim Pilihan'}
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

            {/* Photo Preview Modal */}
            {previewIndex !== null && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
                    onClick={closePreview}
                >
                    <button
                        onClick={closePreview}
                        className="fixed top-6 right-6 p-4 text-white hover:text-brand-red transition-colors z-110"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button
                        onClick={handlePrev}
                        className="fixed left-6 p-4 text-white hover:text-brand-gold transition-colors z-110 bg-white/5 rounded-full backdrop-blur-md"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="w-full h-full flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center group">
                            <img
                                src={drivePhotos[previewIndex].url || drivePhotos[previewIndex].thumbnail.replace('s220', 's0')}
                                alt={drivePhotos[previewIndex].name}
                                className="w-full h-full object-contain rounded-lg shadow-2xl animate-scale-in"
                            />
                        </div>

                        <div className="mt-8 text-center bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                            <p className="text-white font-mono text-xs mb-1 uppercase tracking-widest">{drivePhotos[previewIndex].name}</p>
                            <p className="text-white/40 text-[10px] font-bold">
                                {previewIndex + 1} / {drivePhotos.length}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className="fixed right-6 p-4 text-white hover:text-brand-gold transition-colors z-110 bg-white/5 rounded-full backdrop-blur-md"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </GuestLayout>
    );
}
