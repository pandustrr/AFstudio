import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function ContactSection({ data, setData, errors, currentSubmitting }) {
    const isSubmitting = currentSubmitting === 'contact_submit';
    return (
        <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <h2 className="text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white">Contact Section</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <InputLabel value="Label (Hubungi Kami)" />
                    <TextInput
                        value={data.contact_label}
                        onChange={(e) => setData('contact_label', e.target.value)}
                        className="w-full mt-1 py-2 text-xs"
                        placeholder="Hubungi Kami"
                    />
                    {errors.contact_label && <p className="text-red-500 text-[10px] mt-1">{errors.contact_label}</p>}
                </div>

                <div>
                    <InputLabel value="Judul Utama (Hadirkan Visi Anda)" />
                    <TextInput
                        value={data.contact_title}
                        onChange={(e) => setData('contact_title', e.target.value)}
                        className="w-full mt-1 py-2 text-xs"
                        placeholder="HADIRKAN VISI ANDA."
                    />
                    {errors.contact_title && <p className="text-red-500 text-[10px] mt-1">{errors.contact_title}</p>}
                </div>

                <div>
                    <InputLabel value="Deskripsi" />
                    <TextArea
                        value={data.contact_description}
                        onChange={(e) => setData('contact_description', e.target.value)}
                        className="w-full mt-1 h-20 text-xs"
                        placeholder="Punya pertanyaan atau ide gila untuk sesi Anda?..."
                    />
                    {errors.contact_description && <p className="text-red-500 text-[10px] mt-1">{errors.contact_description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <InputLabel value="Hari Operasional" />
                        <TextInput
                            value={data.operation_days}
                            onChange={(e) => setData('operation_days', e.target.value)}
                            className="w-full mt-1 py-2 text-xs"
                            placeholder="Senin — Minggu"
                        />
                    </div>
                    <div>
                        <InputLabel value="Jam Operasional" />
                        <TextInput
                            value={data.operation_hours}
                            onChange={(e) => setData('operation_hours', e.target.value)}
                            className="w-full mt-1 py-2 text-xs"
                            placeholder="09:00 — 21:00 WIB"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <InputLabel value="Metode Respon" />
                        <TextInput
                            value={data.response_method}
                            onChange={(e) => setData('response_method', e.target.value)}
                            className="w-full mt-1 py-2 text-xs"
                            placeholder="WhatsApp Priority"
                        />
                    </div>
                    <div>
                        <InputLabel value="Waktu Respon" />
                        <TextInput
                            value={data.response_time}
                            onChange={(e) => setData('response_time', e.target.value)}
                            className="w-full mt-1 py-2 text-xs"
                            placeholder="Rata-rata < 15 Menit"
                        />
                    </div>
                </div>

                <div>
                    <InputLabel value="Teks Tombol Form" />
                    <TextInput
                        value={data.contact_button_text}
                        onChange={(e) => setData('contact_button_text', e.target.value)}
                        className="w-full mt-1 py-2 text-xs"
                        placeholder="Kirim Pesan Sekarang"
                    />
                    {errors.contact_button_text && <p className="text-red-500 text-[10px] mt-1">{errors.contact_button_text}</p>}
                </div>

                <div>
                    <InputLabel value="Nomor WhatsApp Admin" />
                    <TextInput
                        value={data.admin_whatsapp}
                        onChange={(e) => setData('admin_whatsapp', e.target.value)}
                        className="w-full mt-1 py-2 text-xs"
                        placeholder="6281230487469"
                    />
                    <p className="text-gray-500 text-[10px] mt-1">Format: 62xxxxxxxxxx (tanpa +)</p>
                    {errors.admin_whatsapp && <p className="text-red-500 text-[10px] mt-1">{errors.admin_whatsapp}</p>}
                </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <button
                    type="submit"
                    name="contact_submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-brand-gold text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Contact Section'}
                </button>
            </div>
        </div>
    );
}
