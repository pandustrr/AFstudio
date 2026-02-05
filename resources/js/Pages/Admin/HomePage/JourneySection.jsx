import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function JourneySection({
    journeySteps,
    onEditJourney,
    onDeleteJourney,
    editingJourneyId,
    setEditingJourneyId,
    journeyFormData,
    setJourneyFormData,
    onSaveJourney
}) {
    const displayJourneySteps = journeySteps || [];

    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Alur Proses (Journey Steps)</h2>
            </div>

            {/* Journey Steps List */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white">Daftar Langkah ({displayJourneySteps.length})</h3>

                {displayJourneySteps.length > 0 ? (
                    <div className="space-y-3">
                        {displayJourneySteps.map((step) => (
                            <div key={step.id} className="p-4 bg-black/2 dark:bg-white/2 rounded-xl border border-black/5 dark:border-white/5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl font-black text-brand-gold">{step.step_number}</span>
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white">{step.title}</p>
                                                <p className="text-[9px] text-brand-black/60 dark:text-brand-white/60 mt-1">{step.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                if (editingJourneyId === step.id) {
                                                    setEditingJourneyId(null);
                                                } else {
                                                    setJourneyFormData({
                                                        step_number: step.step_number,
                                                        title: step.title,
                                                        description: step.description,
                                                        order: step.order || ''
                                                    });
                                                    setEditingJourneyId(step.id);
                                                }
                                            }}
                                            className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors"
                                            title="Edit Step"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteJourney(step.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Hapus Step"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Edit Form */}
                                {editingJourneyId === step.id && (
                                    <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
                                        <div>
                                            <InputLabel value="Nomor Langkah" className="mb-2" />
                                            <TextInput
                                                value={journeyFormData.step_number}
                                                onChange={(e) => setJourneyFormData({...journeyFormData, step_number: e.target.value})}
                                                className="w-full py-2 text-xs"
                                                placeholder="01, 02, 03..."
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Judul Langkah" className="mb-2" />
                                            <TextInput
                                                value={journeyFormData.title}
                                                onChange={(e) => setJourneyFormData({...journeyFormData, title: e.target.value})}
                                                className="w-full py-2 text-xs"
                                                placeholder="Konsultasi"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Deskripsi" className="mb-2" />
                                            <TextArea
                                                value={journeyFormData.description}
                                                onChange={(e) => setJourneyFormData({...journeyFormData, description: e.target.value})}
                                                className="w-full h-20 text-xs"
                                                placeholder="Deskripsi langkah..."
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onSaveJourney(step.id);
                                                }}
                                                className="flex-1 py-2 px-3 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase hover:bg-brand-gold/90 transition-colors"
                                            >
                                                Simpan Perubahan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingJourneyId(null)}
                                                className="flex-1 py-2 px-3 bg-black/10 dark:bg-white/10 rounded-lg text-[10px] font-black uppercase hover:bg-black/20 transition-colors"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                        <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 uppercase font-black tracking-widest">Belum ada langkah</p>
                    </div>
                )}
            </div>
        </div>
    );
}
