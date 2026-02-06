import React from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextArea from '@/Components/TextArea';

export default function VisionMissionSection({ data, setData, errors }) {
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <GlobeAltIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Visi & Misi</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel value="Visi" />
                    <TextArea
                        value={data.vision}
                        onChange={(e) => setData('vision', e.target.value)}
                        className="w-full mt-1 h-40"
                        placeholder="Visi perusahaan..."
                    />
                    {errors.vision && <p className="text-red-500 text-xs mt-1">{errors.vision}</p>}
                </div>
                <div>
                    <InputLabel value="Misi" />
                    <TextArea
                        value={data.mission}
                        onChange={(e) => setData('mission', e.target.value)}
                        className="w-full mt-1 h-40"
                        placeholder="Misi perusahaan..."
                    />
                    {errors.mission && <p className="text-red-500 text-xs mt-1">{errors.mission}</p>}
                </div>
            </div>
        </div>
    );
}
