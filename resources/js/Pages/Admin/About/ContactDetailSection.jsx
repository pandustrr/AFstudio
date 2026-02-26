import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { EnvelopeIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { usePage, Link } from '@inertiajs/react';

export default function ContactDetailSection({ data, setData, errors, currentSubmitting }) {
    const { settings } = usePage().props;
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-3">
                    <div>
                        <InputLabel value="Email" />
                        <TextInput
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full mt-0.5 py-1.5"
                            type="email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <InputLabel value="Nomor WA (Global)" />
                            <Link href="/admin/settings" className="text-[7px] font-black text-brand-gold uppercase flex items-center gap-0.5 hover:underline">
                                Edit Global <ArrowTopRightOnSquareIcon className="w-2 h-2" />
                            </Link>
                        </div>
                        <div className="w-full bg-black/5 dark:bg-white/5 rounded-lg border border-transparent px-3 py-2 text-xs font-bold text-brand-black/40 dark:text-brand-white/40 italic">
                            +{settings?.admin_whatsapp}
                        </div>
                    </div>
                    <div>
                        <InputLabel value="Instagram Link" />
                        <TextInput
                            value={data.instagram}
                            onChange={(e) => setData('instagram', e.target.value)}
                            className="w-full mt-0.5 py-1.5"
                            placeholder="https://instagram.com/..."
                        />
                        {errors.instagram && <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>}
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <InputLabel value="Alamat Lengkap" />
                        <TextArea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="w-full mt-0.5 h-20 py-1.5"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                        <InputLabel value="Google Maps Link" />
                        <TextInput
                            value={data.maps_link}
                            onChange={(e) => setData('maps_link', e.target.value)}
                            className="w-full mt-0.5 py-1.5"
                            placeholder="Iframe URL or Share Link"
                        />
                        {errors.maps_link && <p className="text-red-500 text-xs mt-1">{errors.maps_link}</p>}
                    </div>
                </div>
            </div>

            <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-3">Pengaturan Call to Action (CTA)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel value="Judul CTA" />
                        <TextInput
                            value={data.cta_title}
                            onChange={(e) => setData('cta_title', e.target.value)}
                            className="w-full mt-0.5 py-1.5"
                        />
                        {errors.cta_title && <p className="text-red-500 text-xs mt-1">{errors.cta_title}</p>}
                    </div>
                    <div>
                        <InputLabel value="Subtitle CTA" />
                        <TextInput
                            value={data.cta_subtitle}
                            onChange={(e) => setData('cta_subtitle', e.target.value)}
                            className="w-full mt-0.5 py-1.5"
                        />
                        {errors.cta_subtitle && <p className="text-red-500 text-xs mt-1">{errors.cta_subtitle}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
