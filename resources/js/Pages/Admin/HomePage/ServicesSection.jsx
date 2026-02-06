import React from 'react';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function ServicesSection({ data, setData, errors, currentSubmitting }) {
    const isSubmitting = currentSubmitting === 'services_submit';
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <Square3Stack3DIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                    <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Pengaturan Layanan</h2>
                </div>
                <button
                    type="submit"
                    name="services_submit"
                    disabled={isSubmitting}
                    className="py-2 px-6 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-brand-gold/10"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div>
                        <InputLabel value="Judul Seksi Layanan" />
                        <TextInput
                            value={data.services_title}
                            onChange={(e) => setData('services_title', e.target.value)}
                            className="w-full mt-1.5 py-2 text-xs font-bold"
                            placeholder="LAYANAN YANG MENGINSPIRASI"
                        />
                        {errors.services_title && <p className="text-red-500 text-[10px] mt-1">{errors.services_title}</p>}
                    </div>

                    <div>
                        <InputLabel value="Sub-judul Seksi" />
                        <TextInput
                            value={data.services_subtitle}
                            onChange={(e) => setData('services_subtitle', e.target.value)}
                            className="w-full mt-1.5 py-2 text-xs"
                            placeholder="Layanan Pilihan"
                        />
                        {errors.services_subtitle && <p className="text-red-500 text-[10px] mt-1">{errors.services_subtitle}</p>}
                    </div>
                </div>

                <div>
                    <InputLabel value="Deskripsi Seksi" />
                    <TextArea
                        value={data.services_description}
                        onChange={(e) => setData('services_description', e.target.value)}
                        className="w-full mt-1.5 h-full min-h-[114px] text-xs leading-relaxed"
                        placeholder="Mulai ceritakan bagaimana layanan Anda membantu klien..."
                    />
                    {errors.services_description && <p className="text-red-500 text-[10px] mt-1">{errors.services_description}</p>}
                </div>
            </div>
        </div>
    );
}
