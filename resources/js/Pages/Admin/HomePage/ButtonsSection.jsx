import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ButtonsSection({ data, setData, errors, processing }) {
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5 sticky top-24">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Button Texts</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <InputLabel value="Teks Tombol CTA" />
                    <TextInput
                        value={data.cta_button_text}
                        onChange={(e) => setData('cta_button_text', e.target.value)}
                        className="w-full mt-1 py-2 text-xs"
                        placeholder="Mulai Cerita Anda"
                    />
                    {errors.cta_button_text && <p className="text-red-500 text-xs mt-1">{errors.cta_button_text}</p>}
                </div>

                <div>
                    <InputLabel value="Teks Tombol About" />
                    <TextInput
                        value={data.about_button_text}
                        onChange={(e) => setData('about_button_text', e.target.value)}
                        className="w-full mt-1 py-2 text-xs"
                        placeholder="Mengenal Kami"
                    />
                    {errors.about_button_text && <p className="text-red-500 text-xs mt-1">{errors.about_button_text}</p>}
                </div>
            </div>

            <div className="pt-2">
                <PrimaryButton
                    name="home_submit"
                    className="w-full justify-center py-3 text-[10px] tracking-widest uppercase font-black"
                    disabled={processing}
                >
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </PrimaryButton>
            </div>
        </div>
    );
}
