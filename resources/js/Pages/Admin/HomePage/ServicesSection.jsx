import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function ServicesSection({ data, setData, errors }) {
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Services Section</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <InputLabel value="Judul Utama (Services Title)" />
                    <TextInput
                        value={data.services_title}
                        onChange={(e) => setData('services_title', e.target.value)}
                        className="w-full mt-1 py-2 text-xs"
                        placeholder="Contoh: LAYANAN YANG MENGINSPIRASI"
                    />
                    {errors.services_title && <p className="text-red-500 text-[10px] mt-1">{errors.services_title}</p>}
                </div>

                <div>
                    <InputLabel value="Subtitle" />
                    <TextInput
                        value={data.services_subtitle}
                        onChange={(e) => setData('services_subtitle', e.target.value)}
                        className="w-full mt-1 py-2 text-xs"
                        placeholder="Contoh: Layanan Pilihan"
                    />
                    {errors.services_subtitle && <p className="text-red-500 text-[10px] mt-1">{errors.services_subtitle}</p>}
                </div>

                <div>
                    <InputLabel value="Deskripsi Layanan" />
                    <TextArea
                        value={data.services_description}
                        onChange={(e) => setData('services_description', e.target.value)}
                        className="w-full mt-1 h-24 text-xs"
                        placeholder="Contoh: Setiap momen memiliki jiwanya sendiri..."
                    />
                    {errors.services_description && <p className="text-red-500 text-[10px] mt-1">{errors.services_description}</p>}
                </div>
            </div>
        </div>
    );
}
