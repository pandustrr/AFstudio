import React from 'react';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MoodboardListSection({ moodboards, openDeleteMoodboardModal }) {
    if (moodboards.length === 0) {
        return (
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-12 text-center">
                <PhotoIcon className="w-12 h-12 mx-auto text-brand-black/10 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Belum ada gambar moodboard.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {moodboards.map((mb) => (
                <div key={mb.id} className="relative group aspect-square bg-black/5 rounded-xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm">
                    <img src={`/storage/${mb.image_path}`} alt={mb.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-linear-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[8px] sm:text-[10px] font-bold text-white uppercase truncate mb-2">{mb.title || 'Untitled'}</p>
                        <button
                            onClick={() => openDeleteMoodboardModal(mb.id)}
                            className="w-full py-1.5 bg-brand-red text-white text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 hover:brightness-110 transition-all"
                        >
                            <TrashIcon className="w-3 h-3" /> Hapus
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
