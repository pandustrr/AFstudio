import React, { useState } from 'react';
import { TrashIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function JourneySection({
    journeySteps,
    setJourneySteps,
    onDeleteJourney,
    isAddingNewJourney,
    setIsAddingNewJourney,
    newJourneyFormData,
    setNewJourneyFormData,
    onCreateJourney,
    creatingJourney,
    onSuccessNotification
}) {
    const displayJourneySteps = journeySteps || [];
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Alur Perjalanan</h2>
                </div>
                {!isAddingNewJourney && (
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingNewJourney(true);
                            setNewJourneyFormData({ step_number: '', title: '', description: '', order: '' });
                        }}
                        className="py-2 px-6 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-all shadow-lg shadow-brand-gold/10"
                    >
                        + Tambah Langkah
                    </button>
                )}
            </div>

            {/* Add New Journey Form */}
            {isAddingNewJourney && (
                <div className="bg-brand-gold/5 dark:bg-brand-gold/10 p-5 rounded-2xl border border-brand-gold/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Langkah Proses Baru</h3>
                        <button onClick={() => setIsAddingNewJourney(false)} className="text-brand-black/40 hover:text-red-500 transition-colors">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                            <InputLabel value="Langkah #" />
                            <TextInput
                                value={newJourneyFormData.step_number}
                                onChange={(e) => setNewJourneyFormData({ ...newJourneyFormData, step_number: e.target.value })}
                                className="w-full mt-1 py-2 text-xs"
                                placeholder="01"
                            />
                        </div>
                        <div className="md:col-span-9">
                            <InputLabel value="Judul Langkah" />
                            <TextInput
                                value={newJourneyFormData.title}
                                onChange={(e) => setNewJourneyFormData({ ...newJourneyFormData, title: e.target.value })}
                                className="w-full mt-1 py-2 text-xs"
                                placeholder="Contoh: Sesi Konsultasi"
                            />
                        </div>
                        <div className="md:col-span-12">
                            <InputLabel value="Deskripsi Detail" />
                            <TextArea
                                value={newJourneyFormData.description}
                                onChange={(e) => setNewJourneyFormData({ ...newJourneyFormData, description: e.target.value })}
                                className="w-full mt-1 h-20 text-xs"
                                placeholder="Apa yang terjadi di langkah ini?"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onCreateJourney}
                            disabled={creatingJourney}
                            className="flex-1 py-2.5 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-all shadow-lg shadow-brand-gold/10 disabled:opacity-50"
                        >
                            {creatingJourney ? 'Menyimpan...' : 'Tambah ke Alur'}
                        </button>
                    </div>
                </div>
            )}

            {/* Journey Steps List */}
            <div className="space-y-3">
                {displayJourneySteps.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {displayJourneySteps.map((step) => (
                            <div key={step.id} className="group">
                                <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-brand-gold/30 transition-all duration-300">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            <span className="text-3xl font-black text-brand-gold/20 group-hover:text-brand-gold transition-colors duration-500">
                                                {step.step_number}
                                            </span>
                                            <div className="truncate">
                                                <h4 className="text-xs font-black uppercase tracking-wider text-brand-black dark:text-brand-white truncate">
                                                    {step.title}
                                                </h4>
                                                <p className="text-[10px] text-brand-black/40 dark:text-brand-white/40 mt-1 truncate">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(editingId === step.id ? null : step.id);
                                                    setEditingData({
                                                        step_number: step.step_number,
                                                        title: step.title,
                                                        description: step.description,
                                                        order: step.order || ''
                                                    });
                                                }}
                                                className="p-1.5 bg-black/5 dark:bg-white/5 hover:bg-brand-gold text-brand-black dark:text-brand-white hover:text-black rounded-lg transition-all"
                                            >
                                                <PencilSquareIcon className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteJourney(step.id)}
                                                className="p-1.5 bg-black/5 dark:bg-white/5 hover:bg-red-500 text-brand-black dark:text-brand-white hover:text-white rounded-lg transition-all"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Inline Edit Form */}
                                {editingId === step.id && (
                                    <div className="mt-2 p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-brand-gold/20 animate-fade-in space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-2">
                                                <InputLabel value="No." />
                                                <TextInput
                                                    value={editingData.step_number || ''}
                                                    onChange={(e) => setEditingData({ ...editingData, step_number: e.target.value })}
                                                    className="w-full mt-1 py-1.5 text-xs text-center font-bold"
                                                />
                                            </div>
                                            <div className="md:col-span-12">
                                                <InputLabel value="Judul" />
                                                <TextInput
                                                    value={editingData.title || ''}
                                                    onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                                                    className="w-full mt-1 py-1.5 text-xs font-bold"
                                                />
                                            </div>
                                            <div className="md:col-span-12">
                                                <InputLabel value="Deskripsi" />
                                                <TextArea
                                                    value={editingData.description || ''}
                                                    onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                                                    className="w-full mt-1 h-20 text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setIsSaving(true);
                                                    try {
                                                        const response = await fetch(`/admin/home/journey/${step.id}`, {
                                                            method: 'PATCH',
                                                            headers: {
                                                                'Accept': 'application/json',
                                                                'Content-Type': 'application/json',
                                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                                                            },
                                                            body: JSON.stringify(editingData)
                                                        });
                                                        if (response.ok) {
                                                            const updatedSteps = displayJourneySteps.map(s =>
                                                                s.id === step.id ? { ...s, ...editingData } : s
                                                            );
                                                            setJourneySteps(updatedSteps);
                                                            setEditingId(null);
                                                            onSuccessNotification?.('Berhasil Diperbarui!');
                                                        }
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="flex-1 py-2 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest"
                                            >
                                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="px-6 py-2 bg-black/5 dark:bg-white/5 text-brand-black dark:text-brand-white rounded-lg text-[10px] font-black uppercase tracking-widest"
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
                    <div className="text-center py-12 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                        <p className="text-[10px] text-brand-black/30 dark:text-brand-white/30 uppercase font-black tracking-widest italic">Belum ada langkah yang ditentukan</p>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
