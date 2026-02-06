import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function JourneySection({
    journeySteps,
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
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Alur Proses (Journey Steps)</h2>
            </div>

            {/* Add New Journey Form */}
            {isAddingNewJourney && (
                <div className="bg-brand-gold/5 dark:bg-brand-gold/10 p-5 rounded-2xl border border-brand-gold/20 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white mb-3">Tambah Langkah Baru</h3>
                    <div>
                        <InputLabel value="Nomor Langkah" className="mb-2" />
                        <TextInput
                            value={newJourneyFormData.step_number}
                            onChange={(e) => setNewJourneyFormData({...newJourneyFormData, step_number: e.target.value})}
                            className="w-full py-2 text-xs"
                            placeholder="01, 02, 03..."
                        />
                    </div>
                    <div>
                        <InputLabel value="Judul Langkah" className="mb-2" />
                        <TextInput
                            value={newJourneyFormData.title}
                            onChange={(e) => setNewJourneyFormData({...newJourneyFormData, title: e.target.value})}
                            className="w-full py-2 text-xs"
                            placeholder="Konsultasi"
                        />
                    </div>
                    <div>
                        <InputLabel value="Deskripsi" className="mb-2" />
                        <TextArea
                            value={newJourneyFormData.description}
                            onChange={(e) => setNewJourneyFormData({...newJourneyFormData, description: e.target.value})}
                            className="w-full h-20 text-xs"
                            placeholder="Deskripsi langkah..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onCreateJourney}
                            disabled={creatingJourney}
                            className="flex-1 py-2 px-3 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
                        >
                            {creatingJourney ? 'Menyimpan...' : 'Simpan Langkah'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddingNewJourney(false);
                                setNewJourneyFormData({ step_number: '', title: '', description: '', order: '' });
                            }}
                            className="flex-1 py-2 px-3 bg-black/10 dark:bg-white/10 rounded-lg text-[10px] font-black uppercase hover:bg-black/20 transition-colors"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {/* Journey Steps List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white">Daftar Langkah ({displayJourneySteps.length})</h3>
                    {!isAddingNewJourney && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddingNewJourney(true);
                                setNewJourneyFormData({ step_number: '', title: '', description: '', order: '' });
                            }}
                            className="px-3 py-1.5 bg-brand-gold text-black rounded-lg text-[9px] font-black uppercase hover:bg-brand-gold/90 transition-colors"
                        >
                            + Tambah Langkah
                        </button>
                    )}
                </div>

                {displayJourneySteps.length > 0 ? (
                    <div className="space-y-3">
                        {displayJourneySteps.map((step) => (
                            <div key={step.id}>
                                <div className="p-4 bg-black/2 dark:bg-white/2 rounded-xl border border-black/5 dark:border-white/5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-black text-brand-gold">{step.step_number}</span>
                                                <div>
                                                    <p className="text-sm font-bold uppercase tracking-wider text-brand-black dark:text-brand-white">{step.title}</p>
                                                    <p className="text-[9px] text-brand-black/60 dark:text-brand-white/60 mt-1">{step.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (editingId === step.id) {
                                                        setEditingId(null);
                                                    } else {
                                                        setEditingId(step.id);
                                                        setEditingData({
                                                            step_number: step.step_number,
                                                            title: step.title,
                                                            description: step.description,
                                                            order: step.order || ''
                                                        });
                                                    }
                                                }}
                                                className="px-3 py-1.5 text-[9px] font-black uppercase bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                {editingId === step.id ? 'Tutup' : 'Edit'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteJourney(step.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Hapus Step"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Form */}
                                {editingId === step.id && (
                                    <div className="mt-2 p-4 bg-brand-gold/5 dark:bg-brand-gold/10 rounded-xl border border-brand-gold/20 space-y-3">
                                        <h3 className="text-sm font-bold text-brand-black dark:text-brand-white">Edit Langkah</h3>
                                        <div>
                                            <InputLabel value="Nomor Langkah" className="mb-2" />
                                            <TextInput
                                                value={editingData.step_number || ''}
                                                onChange={(e) => setEditingData({...editingData, step_number: e.target.value})}
                                                className="w-full py-2 text-xs"
                                                placeholder="01, 02, 03..."
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Judul Langkah" className="mb-2" />
                                            <TextInput
                                                value={editingData.title || ''}
                                                onChange={(e) => setEditingData({...editingData, title: e.target.value})}
                                                className="w-full py-2 text-xs"
                                                placeholder="Konsultasi"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="Deskripsi" className="mb-2" />
                                            <TextArea
                                                value={editingData.description || ''}
                                                onChange={(e) => setEditingData({...editingData, description: e.target.value})}
                                                className="w-full h-20 text-xs"
                                                placeholder="Deskripsi langkah..."
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setIsSaving(true);
                                                    try {
                                                        const response = await fetch(`/admin/home/journey/${step.id}`, {
                                                            method: 'PATCH',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                                                            },
                                                            body: JSON.stringify(editingData)
                                                        });
                                                        let data;
                                                        try {
                                                            data = await response.json();
                                                        } catch (parseError) {
                                                            throw new Error('Invalid response format: ' + parseError.message);
                                                        }
                                                        if (response.ok) {
                                                            setEditingId(null);
                                                            if (onSuccessNotification) {
                                                                onSuccessNotification('Langkah perjalanan berhasil diperbarui');
                                                            }
                                                            setTimeout(() => window.location.reload(), 1500);
                                                        } else {
                                                            const errorMsg = data.message || 'Gagal menyimpan perubahan';
                                                            alert(errorMsg);
                                                        }
                                                    } catch (error) {
                                                        alert('Terjadi kesalahan: ' + error.message);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="flex-1 py-2 px-3 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
                                            >
                                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
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
                        {!isAddingNewJourney && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddingNewJourney(true);
                                    setNewJourneyFormData({ step_number: '', title: '', description: '', order: '' });
                                }}
                                className="mt-4 px-4 py-2 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase hover:bg-brand-gold/90 transition-colors"
                            >
                                + Tambah Langkah Pertama
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
