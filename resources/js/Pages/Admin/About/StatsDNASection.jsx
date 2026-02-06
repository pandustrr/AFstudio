import React from 'react';
import { ChartBarIcon, SparklesIcon, CameraIcon, BoltIcon, ShieldCheckIcon, HeartIcon, UserGroupIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function StatsDNASection({ data, setData, errors, currentSubmitting }) {
    const isSubmitting = currentSubmitting === 'stats_dna_submit';

    // Ensure stats and dna are arrays
    const stats = Array.isArray(data.stats) ? data.stats : [];
    const dna = Array.isArray(data.dna) ? data.dna : [];

    const addStat = () => {
        if (stats.length < 3) {
            setData('stats', [...stats, { val: '', label: '' }]);
        }
    };

    const removeStat = (index) => {
        setData('stats', stats.filter((_, i) => i !== index));
    };

    const updateStat = (index, field, value) => {
        const newStats = [...stats];
        newStats[index][field] = value;
        setData('stats', newStats);
    };

    const addDNA = () => {
        if (dna.length < 4) {
            setData('dna', [...dna, { title: '', desc: '', icon: 'bolt' }]);
        }
    };

    const removeDNA = (index) => {
        setData('dna', dna.filter((_, i) => i !== index));
    };

    const updateDNA = (index, field, value) => {
        const newDNA = [...dna];
        newDNA[index][field] = value;
        setData('dna', newDNA);
    };

    const iconOptions = [
        { id: 'bolt', icon: BoltIcon, label: 'Bolt' },
        { id: 'shield', icon: ShieldCheckIcon, label: 'Shield' },
        { id: 'heart', icon: HeartIcon, label: 'Heart' },
        { id: 'users', icon: UserGroupIcon, label: 'Users' },
        { id: 'sparkles', icon: SparklesIcon, label: 'Sparkles' },
        { id: 'camera', icon: CameraIcon, label: 'Camera' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Section */}
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                        <ChartBarIcon className="w-4 h-4 text-brand-black dark:text-brand-white" />
                        <h2 className="text-sm font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Statistik</h2>
                    </div>
                    <div className="flex gap-2">
                        {stats.length < 3 && (
                            <button
                                type="button"
                                onClick={addStat}
                                className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-brand-black dark:text-brand-white hover:bg-brand-gold hover:text-black transition-all"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            type="submit"
                            name="stats_dna_submit"
                            disabled={isSubmitting}
                            className="py-1.5 px-4 bg-brand-gold text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? '...' : 'Simpan'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 space-y-2 relative group">
                            <button
                                type="button"
                                onClick={() => removeStat(idx)}
                                className="absolute top-1 right-1 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <TrashIcon className="w-3 h-3" />
                            </button>
                            <div>
                                <InputLabel value="Nilai" className="text-[10px]" />
                                <TextInput
                                    value={stat.val}
                                    onChange={(e) => updateStat(idx, 'val', e.target.value)}
                                    className="w-full mt-0.5 py-1 text-sm"
                                />
                            </div>
                            <div>
                                <InputLabel value="Label" className="text-[10px]" />
                                <TextInput
                                    value={stat.label}
                                    onChange={(e) => updateStat(idx, 'label', e.target.value)}
                                    className="w-full mt-0.5 py-1 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                    {stats.length === 0 && (
                        <p className="col-span-full text-center py-4 text-brand-black/20 dark:text-brand-white/20 text-[10px] uppercase font-bold italic">Belum ada statistik</p>
                    )}
                </div>
            </div>

            {/* DNA Section */}
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-brand-black dark:text-brand-white" />
                        <h2 className="text-sm font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Keunggulan Utama</h2>
                    </div>
                    {dna.length < 4 && (
                        <button
                            type="button"
                            onClick={addDNA}
                            className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-brand-black dark:text-brand-white hover:bg-brand-gold hover:text-black transition-all"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dna.map((item, idx) => (
                        <div key={idx} className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 space-y-3 relative group">
                            <button
                                type="button"
                                onClick={() => removeDNA(idx)}
                                className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <TrashIcon className="w-3 h-3" />
                            </button>

                            <div className="space-y-3">
                                <div>
                                    <InputLabel value="Judul" className="text-[10px]" />
                                    <TextInput
                                        value={item.title}
                                        onChange={(e) => updateDNA(idx, 'title', e.target.value)}
                                        className="w-full mt-0.5 py-1 text-sm"
                                    />
                                </div>

                                <div>
                                    <InputLabel value="Pilih Ikon Visual" className="text-[10px] mb-1.5" />
                                    <div className="flex flex-wrap gap-2">
                                        {iconOptions.map(opt => {
                                            const IconComp = opt.icon;
                                            const isActive = (item.icon || 'bolt') === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => updateDNA(idx, 'icon', opt.id)}
                                                    className={`p-2 rounded-xl border transition-all ${isActive
                                                        ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20 scale-110'
                                                        : 'bg-white dark:bg-brand-black border-black/5 dark:border-white/5 text-brand-black/20 dark:text-brand-white/20 hover:text-brand-gold hover:border-brand-gold/30'
                                                        }`}
                                                >
                                                    <IconComp className="w-4 h-4" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <InputLabel value="Deskripsi" className="text-[10px]" />
                                    <TextArea
                                        value={item.desc}
                                        onChange={(e) => updateDNA(idx, 'desc', e.target.value)}
                                        className="w-full mt-0.5 h-14 py-1 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {dna.length === 0 && (
                        <p className="col-span-full text-center py-4 text-brand-black/20 dark:text-brand-white/20 text-[10px] uppercase font-bold italic">Belum ada pilar keunggulan</p>
                    )}
                </div>
            </div>
        </div>
    );
}
