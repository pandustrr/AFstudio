import { XMarkIcon, ChatBubbleLeftRightIcon, PhoneIcon, ChartBarIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function ViewModal({ session, onClose }) {
    if (!session) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-brand-black border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] animate-fade-in">
                <div className="sticky top-0 bg-white/80 dark:bg-brand-black/80 backdrop-blur-md px-8 py-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">Requests Customer : {session.uid}</h2>
                        <div className="flex flex-col gap-1 mt-1">
                            <p className="text-xs font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">{session.customer_name}</p>
                            {session.booking?.phone && (
                                <a
                                    href={`https://wa.me/${session.booking.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-500 hover:underline w-fit"
                                >
                                    <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                                    {session.booking.phone}
                                </a>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>


                <div className="px-8 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl">
                        <h4 className="text-[10px] font-black text-brand-black dark:text-brand-white uppercase tracking-widest mb-2">Folder Mentahan</h4>
                        <div className="flex flex-col gap-2">
                            {session.raw_folder_id ? (
                                <>
                                    <a
                                        href={session.raw_folder_id.startsWith('http') ? session.raw_folder_id : `https://drive.google.com/drive/folders/${session.raw_folder_id}`}
                                        target="_blank"
                                        className="text-[10px] font-black uppercase text-brand-gold hover:underline truncate"
                                    >
                                        Open GDrive Link
                                    </a>
                                    {!window.location.pathname.startsWith('/photographer') && (
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${session.is_raw_accessible ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                            <span className="text-[9px] font-bold text-brand-black/60 dark:text-brand-white/60 uppercase tracking-widest">
                                                {session.is_raw_accessible ? 'Akses Dibuka' : 'Akses Dikunci'}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-[10px] font-bold text-brand-black/20 dark:text-brand-white/20 uppercase tracking-widest">Belum diset</p>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl">
                        <h4 className="text-[10px] font-black text-brand-black dark:text-brand-white uppercase tracking-widest mb-2">Folder Hasil/Editing</h4>
                        <div className="flex flex-col gap-2">
                            {session.edited_folder_id ? (
                                <>
                                    <a
                                        href={session.edited_folder_id.startsWith('http') ? session.edited_folder_id : `https://drive.google.com/drive/folders/${session.edited_folder_id}`}
                                        target="_blank"
                                        className="text-[10px] font-black uppercase text-brand-gold hover:underline truncate"
                                    >
                                        Open GDrive Link
                                    </a>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${session.is_edited_accessible ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        <span className="text-[9px] font-bold text-brand-black/60 dark:text-brand-white/60 uppercase tracking-widest">
                                            {session.is_edited_accessible ? 'Akses Dibuka' : 'Akses Dikunci'}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-[10px] font-bold text-brand-black/20 dark:text-brand-white/20 uppercase tracking-widest">Belum diset</p>
                            )}
                        </div>
                    </div>
                </div>

                {session.extra_editing_quota > 0 && (
                    <div className="mx-8 mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                                <ChartBarIcon className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-0.5">Total Kuota Tambahan</h4>
                                <p className="text-sm font-black text-brand-black dark:text-brand-white">+{session.extra_editing_quota} Foto</p>
                            </div>
                        </div>
                        <div className="bg-green-500 text-white px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
                            Automated
                        </div>
                    </div>
                )}

                <div className="p-8">
                    {(session.edit_requests || []).length > 0 ? (() => {
                        // Consolidate all photos from all requests
                        const uniquePhotosMap = new Map();
                        (session.edit_requests || []).forEach(req => {
                            (req.selected_photos || []).forEach(photo => {
                                // Use ID if available, fallback to name/filename
                                const photoId = typeof photo === 'object' ? (photo.id || photo.name || photo.filename) : photo;
                                if (photoId && !uniquePhotosMap.has(photoId)) {
                                    uniquePhotosMap.set(photoId, photo);
                                }
                            });
                        });

                        // Sort alphabetically by name
                        const sortedPhotos = Array.from(uniquePhotosMap.values()).sort((a, b) => {
                            const nameA = (typeof a === 'object' ? (a.name || a.filename || '') : String(a)).toUpperCase();
                            const nameB = (typeof b === 'object' ? (b.name || b.filename || '') : String(b)).toUpperCase();
                            return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
                        });

                        return (
                            <div className="bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white/50 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
                                    <div className="text-xs font-black uppercase tracking-widest text-brand-gold">
                                        Request Photos List ({sortedPhotos.length})
                                    </div>
                                    <button
                                        onClick={() => {
                                            const text = sortedPhotos.map(p => typeof p === 'object' ? (p.name || p.filename || 'No Name') : p).join('\n');
                                            navigator.clipboard.writeText(text);
                                            alert('Daftar foto berhasil disalin!');
                                        }}
                                        className="px-4 py-1.5 bg-brand-gold text-brand-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Copy Full List
                                    </button>
                                </div>
                                <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
                                    {sortedPhotos.map((photo, pIdx) => (
                                        <div key={pIdx} className="flex items-center gap-3 px-6 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                                            <PhotoIcon className="w-4 h-4 text-brand-black/20 dark:text-brand-white/20 group-hover:text-brand-gold transition-colors" />
                                            <p className="text-[11px] font-mono font-bold text-brand-black/60 dark:text-brand-white/60 group-hover:text-brand-black dark:group-hover:text-brand-white transition-colors truncate">
                                                {typeof photo === 'object' ? (photo.name || photo.filename || 'Unnamed') : photo}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })() : (
                        <div className="py-12 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl">
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-black uppercase tracking-widest text-center">Belum ada request edit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
