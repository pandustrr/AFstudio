import React, { useState } from 'react';
import GuestLayout from '../Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function SelectorPhoto() {
    const [step, setStep] = useState(1);
    const [uid, setUid] = useState('');
    const [driveType, setDriveType] = useState(''); // 'Mentahan' or 'Result'
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [review, setReview] = useState('');
    const [showGallery, setShowGallery] = useState(false);
    const [drivePhotos, setDrivePhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Configuration for Google Drive folders
    const driveFolders = {
        Mentahan: '19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI',
        Result: '' // Add Result folder ID when available
    };

    const driveLinks = {
        Mentahan: 'https://drive.google.com/drive/folders/19nSDsv01kEKec8aMTG3rw7NHUtLTxHYI?usp=sharing',
        Result: '#'
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

    const togglePhoto = (photoId) => {
        setSelectedPhotos(prev =>
            prev.includes(photoId)
                ? prev.filter(p => p !== photoId)
                : [...prev, photoId]
        );
    };

    const handleDownloadSelected = () => {
        if (selectedPhotos.length === 0) return;

        // Download each selected photo
        selectedPhotos.forEach(photoId => {
            const photo = drivePhotos.find(p => p.id === photoId);
            if (photo && photo.downloadLink) {
                window.open(photo.downloadLink, '_blank');
            }
        });
    };

    const handleDownloadAll = () => {
        // Open Google Drive folder link in new tab
        window.open(driveLinks[driveType], '_blank');
    };

    const handleSend = () => {
        const data = {
            uid,
            driveType,
            selectedPhotos,
            review,
        };

        if (driveType === 'Mentahan') {
            console.log('Sending to Admin:', data);
            alert('Data berhasil dikirim ke Admin!');
        } else {
            console.log('Review Result finished:', data);
        }

        // Reset flow to UID step
        setStep(1);
        setUid('');
        setDriveType('');
        setSelectedPhotos([]);
        setReview('');
    };

    return (
        <GuestLayout>
            <Head title="Selector Photo" />

            <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
                <div className="max-w-xl w-full">
                    {/* Stepper Indicator */}
                    <div className="flex justify-between mb-12 relative px-4">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s ? 'bg-brand-red text-white' : 'bg-brand-black border border-white/10 text-white/30'
                                    }`}
                            >
                                {s}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: UID Input */}
                    {step === 1 && (
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm animate-fade-in">
                            <h2 className="text-2xl font-bold text-brand-white mb-2 uppercase tracking-tight">Halaman UID</h2>
                            <p className="text-brand-white/50 text-sm mb-8">Masukkan UID yang Anda terima dari AFstudio.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">UID Pelanggan</label>
                                    <input
                                        type="text"
                                        value={uid}
                                        onChange={(e) => setUid(e.target.value)}
                                        placeholder="Contoh: AF-2024-XXXX"
                                        className="w-full bg-brand-black border border-white/10 rounded-sm px-4 py-4 text-brand-white focus:border-brand-red focus:outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    disabled={!uid}
                                    onClick={nextStep}
                                    className="w-full bg-brand-red hover:bg-red-800 disabled:opacity-50 text-white font-bold py-4 uppercase tracking-widest transition-all rounded-sm"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Drive Selection */}
                    {step === 2 && (
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm animate-fade-in text-center">
                            <h2 className="text-2xl font-bold text-brand-white mb-2 uppercase tracking-tight">Pilih Akses Drive</h2>
                            <p className="text-brand-white/50 text-sm mb-8">Silakan pilih folder foto yang ingin Anda akses.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => {
                                        setDriveType('Mentahan');
                                        fetchPhotosFromDrive('Mentahan');
                                        nextStep();
                                    }}
                                    className="p-8 border border-white/10 rounded-xl hover:border-brand-red hover:bg-brand-red/5 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red/10">
                                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    </div>
                                    <h3 className="font-bold text-brand-white font-sans">Drive Mentahan</h3>
                                </button>

                                <button
                                    onClick={() => {
                                        setDriveType('Result');
                                        fetchPhotosFromDrive('Result');
                                        nextStep();
                                    }}
                                    className="p-8 border border-white/10 rounded-xl hover:border-brand-gold hover:bg-brand-gold/5 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/10">
                                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h3 className="font-bold text-brand-white font-sans">Drive Result (Editing)</h3>
                                </button>
                            </div>

                            <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-lg">
                                <p className="text-[10px] text-brand-gold uppercase tracking-widest font-bold mb-1">PENTING / DISCLAIMER</p>
                                <p className="text-brand-white/70 text-xs italic">
                                    "File pada Google Drive ini bersifat sementara dan akan otomatis dihapus setelah 7 hari."
                                </p>
                            </div>

                            <button onClick={prevStep} className="mt-8 text-brand-white/30 text-xs uppercase tracking-widest hover:text-brand-white font-bold transition-colors">Kembali ke UID</button>
                        </div>
                    )}

                    {/* Step 3: Flow Selection based on Drive Type */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Folder Info Header */}
                            <div className="flex items-center justify-between px-2">
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${driveType === 'Mentahan' ? 'bg-brand-red/20 text-brand-red' : 'bg-brand-gold/20 text-brand-gold'}`}>
                                    Folder {driveType}
                                </span>
                                <button onClick={prevStep} className="text-brand-white/40 hover:text-brand-gold text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                    Ganti Drive
                                </button>
                            </div>

                            {/* Section 1: Pemilihan Foto (Shared between both for showing Gallery) */}
                            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-brand-white mb-2 uppercase tracking-tight font-sans">{driveType === 'Result' ? 'Download Hasil' : 'Pemilihan Foto'}</h2>
                                <p className="text-brand-white/50 text-xs mb-6">
                                    {driveType === 'Result' ? 'Buka galeri untuk melihat dan mendownload foto Anda.' : 'Pilih satu atau beberapa foto dari galeri drive.'}
                                </p>

                                <button
                                    onClick={() => setShowGallery(true)}
                                    className={`w-full flex items-center justify-between p-4 bg-brand-black border border-white/10 rounded-sm group transition-all ${driveType === 'Result' ? 'hover:border-brand-gold' : 'hover:border-brand-red'}`}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <div className={`w-8 h-8 bg-white/5 rounded flex items-center justify-center transition-all ${driveType === 'Result' ? 'group-hover:bg-brand-gold/10' : 'group-hover:bg-brand-red/10'}`}>
                                            <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={driveType === 'Result' ? "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" : "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"}></path></svg>
                                        </div>
                                        <div>
                                            <span className="block text-brand-white text-xs font-bold uppercase tracking-wide font-sans">{driveType === 'Result' ? 'Lihat & Download' : 'Pilih Foto'}</span>
                                            <span className="block text-brand-white/30 text-[9px] uppercase font-bold tracking-widest mt-0.5">
                                                {driveType === 'Result' ? 'Semua foto siap didownload' : (selectedPhotos.length > 0 ? `${selectedPhotos.length} Foto Dipilih` : 'Belum ada foto dipilih')}
                                            </span>
                                        </div>
                                    </div>
                                    <svg className={`w-4 h-4 text-white/20 transition-all ${driveType === 'Result' ? 'group-hover:text-brand-gold' : 'group-hover:text-brand-red'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>

                            {/* Section 2: Form Review (Unified for both as per user request) */}
                            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-brand-white mb-2 uppercase tracking-tight font-sans">{driveType === 'Result' ? 'Review Layanan' : 'Catatan (opsional)'}</h2>
                                <p className="text-brand-white/50 text-xs mb-8">
                                    {driveType === 'Result' ? 'Berikan ulasan Anda tentang hasil pemotretan ini.' : 'Berikan catatan perbaikan atau retouch untuk admin.'}
                                </p>

                                <div className="space-y-6 text-left">


                                    <div>
                                        <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">{driveType === 'Result' ? 'Ulasan Anda' : 'Catatan Khusus'}</label>
                                        <textarea
                                            rows="3"
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            placeholder={driveType === 'Result' ? "Bagaimana hasil fotonya? Kami sangat menghargai masukan Anda..." : "Misal: Perbaikan warna, retouch kulit, atau crop..."}
                                            className="w-full bg-brand-black/50 border border-white/10 rounded-sm px-4 py-3 text-brand-white focus:border-brand-red focus:outline-none transition-colors text-sm placeholder:text-white/10"
                                        ></textarea>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            onClick={handleSend}
                                            disabled={driveType === 'Mentahan' && selectedPhotos.length === 0}
                                            className={`px-12 py-3.5 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl font-sans disabled:opacity-30 ${driveType === 'Result'
                                                ? 'bg-white/10 border border-white/10 hover:bg-white/20 text-brand-white'
                                                : 'bg-brand-gold text-brand-black hover:bg-brand-red hover:text-white shadow-brand-gold/10'
                                                }`}
                                        >
                                            {driveType === 'Result' ? 'Selesai & Kembali' : 'Kirim ke Admin'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
                    <div className="absolute inset-0 bg-brand-black/95 backdrop-blur-xl" onClick={() => setShowGallery(false)}></div>
                    <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-brand-black border border-white/10 rounded-2xl flex flex-col overflow-hidden animate-slide-up">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-brand-white uppercase">Drive {driveType}</h3>
                                <p className="text-brand-white/50 text-xs">
                                    {driveType === 'Result'
                                        ? 'Lihat dan download hasil foto anda'
                                        : `Pilih foto yang ingin diproses (${selectedPhotos.length} terpilih)`
                                    }
                                </p>
                            </div>
                            <button onClick={() => setShowGallery(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-brand-red transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Modal Body: Gallery Grid */}
                        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="w-12 h-12 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin"></div>
                                    <p className="text-brand-white/50 text-sm">Memuat foto dari Google Drive...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <p className="text-red-400 text-sm font-bold">Error: {error}</p>
                                    <button
                                        onClick={() => fetchPhotosFromDrive(driveType)}
                                        className="px-4 py-2 bg-brand-red text-white rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            ) : drivePhotos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <p className="text-brand-white/50 text-sm">Tidak ada foto di folder ini</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {drivePhotos.map((photo) => {
                                        const isSelected = selectedPhotos.includes(photo.id);
                                        return (
                                            <div
                                                key={photo.id}
                                                onClick={() => togglePhoto(photo.id)}
                                                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-4 ring-brand-red scale-[0.98]' : 'hover:scale-[1.02]'}`}
                                            >
                                                <img
                                                    src={photo.thumbnail || `https://drive.google.com/thumbnail?id=${photo.id}&sz=w400-h400`}
                                                    alt={photo.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        // Fallback if thumbnail fails
                                                        e.target.src = `https://via.placeholder.com/400x400/1a1a1a/666666?text=${encodeURIComponent(photo.name.substring(0, 10))}`;
                                                    }}
                                                />
                                                <div className={`absolute inset-0 flex flex-col justify-end p-2 sm:p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
                                                    <span className="text-[10px] text-white font-bold truncate">{photo.name}</span>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white shadow-lg">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-white/5 border-t border-white/10 flex justify-between items-center gap-4">
                            {driveType === 'Result' ? (
                                <>
                                    <button
                                        onClick={handleDownloadAll}
                                        className="bg-white/10 text-white px-6 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all rounded-sm"
                                    >
                                        Download Semua
                                    </button>
                                    <button
                                        onClick={() => { handleDownloadSelected(); setShowGallery(false); }}
                                        disabled={selectedPhotos.length === 0}
                                        className="bg-brand-gold text-brand-black px-6 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-brand-red hover:text-white disabled:opacity-50 transition-all rounded-sm"
                                    >
                                        Download Terpilih ({selectedPhotos.length})
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowGallery(false)}
                                    className="ml-auto bg-brand-red text-white px-10 py-3 font-bold uppercase tracking-widest text-xs hover:bg-red-800 transition-all shadow-lg shadow-brand-red/20"
                                >
                                    Simpan Pilihan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
