import React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function ContactSection({ data, setData, errors, currentSubmitting }) {
    const isSubmitting = currentSubmitting === 'contact_submit';
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                    <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Pengaturan Kontak</h2>
                </div>
                <button
                    type="submit"
                    name="contact_submit"
                    disabled={isSubmitting}
                    className="py-2 px-6 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-brand-gold/10"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-12 xl:col-span-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Label Seksi" />
                            <TextInput
                                value={data.contact_label}
                                onChange={(e) => setData('contact_label', e.target.value)}
                                className="w-full mt-1.5 py-2 text-xs"
                                placeholder="Hubungi Kami"
                            />
                        </div>
                        <div>
                            <InputLabel value="Judul Seksi" />
                            <TextInput
                                value={data.contact_title}
                                onChange={(e) => setData('contact_title', e.target.value)}
                                className="w-full mt-1.5 py-2 text-xs font-bold"
                                placeholder="HADIRKAN VISI ANDA."
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Deskripsi" />
                        <TextArea
                            value={data.contact_description}
                            onChange={(e) => setData('contact_description', e.target.value)}
                            className="w-full mt-1.5 h-20 text-xs"
                            placeholder="Punya pertanyaan atau ide gila untuk sesi Anda?..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Informasi Operasional</h3>
                            <div>
                                <InputLabel value="Hari Operasional" />
                                <TextInput
                                    value={data.operation_days}
                                    onChange={(e) => setData('operation_days', e.target.value)}
                                    className="w-full mt-1 py-1.5 text-[11px]"
                                    placeholder="Senin — Minggu"
                                />
                            </div>
                            <div>
                                <InputLabel value="Jam Operasional" />
                                <TextInput
                                    value={data.operation_hours}
                                    onChange={(e) => setData('operation_hours', e.target.value)}
                                    className="w-full mt-1 py-1.5 text-[11px]"
                                    placeholder="09:00 — 21:00 WIB"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Informasi Respon</h3>
                            <div>
                                <InputLabel value="Metode Cepat" />
                                <TextInput
                                    value={data.response_method}
                                    onChange={(e) => setData('response_method', e.target.value)}
                                    className="w-full mt-1 py-1.5 text-[11px]"
                                    placeholder="Prioritas WhatsApp"
                                />
                            </div>
                            <div>
                                <InputLabel value="Rata-rata Respon" />
                                <TextInput
                                    value={data.response_time}
                                    onChange={(e) => setData('response_time', e.target.value)}
                                    className="w-full mt-1 py-1.5 text-[11px]"
                                    placeholder="< 15 Menit"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-12 xl:col-span-4 space-y-4">
                    <div className="p-5 bg-black/2 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Integrasi WhatsApp</h3>
                        <div>
                            <InputLabel value="Nomor WhatsApp Admin" />
                            <TextInput
                                value={data.admin_whatsapp}
                                onChange={(e) => setData('admin_whatsapp', e.target.value)}
                                className="w-full mt-1.5 py-2 text-xs"
                                placeholder="6281230487469"
                            />
                            <p className="text-[8px] text-gray-500 mt-2 italic">Format: 62xxxx (Tanpa + atau spasi)</p>
                        </div>
                    </div>

                    <div className="p-5 bg-black/2 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Pengaturan Formulir</h3>
                        <div>
                            <InputLabel value="Teks Tombol" />
                            <TextInput
                                value={data.contact_button_text}
                                onChange={(e) => setData('contact_button_text', e.target.value)}
                                className="w-full mt-1.5 py-2 text-xs"
                            />
                        </div>
                        <div>
                            <InputLabel value="Placeholder Formulir" />
                            <TextInput
                                value={data.contact_form_placeholder}
                                onChange={(e) => setData('contact_form_placeholder', e.target.value)}
                                className="w-full mt-1.5 py-2 text-xs"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
