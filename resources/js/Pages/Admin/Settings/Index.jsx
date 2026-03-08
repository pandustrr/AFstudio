import React from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SettingsIndex({ settings, flash }) {
    const { data, setData, patch, processing, errors } = useForm({
        admin_whatsapp: settings?.admin_whatsapp || '6282232586727',
        follow_up_template: settings?.follow_up_template || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch('/admin/settings');
    };

    return (
        <AdminLayout>
            <div className="py-12 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white tracking-tight">
                            Pengaturan Aplikasi
                        </h1>
                        <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mt-2">
                            Kelola pengaturan umum aplikasi website AFStudio
                        </p>
                    </div>

                    {/* Success Alert */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                            <p className="text-sm text-green-700 dark:text-green-300">{flash.success}</p>
                        </div>
                    )}

                    {/* Form Container */}
                    <div className="bg-white dark:bg-brand-black/40 border border-brand-black/10 dark:border-brand-white/10 rounded-2xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* WhatsApp Admin Section */}
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-lg font-black text-brand-black dark:text-brand-white mb-2">
                                        Kontak Admin
                                    </h2>
                                    <p className="text-xs text-brand-black/60 dark:text-brand-white/60 uppercase tracking-wide">
                                        Nomor WhatsApp untuk semua link kontak di website
                                    </p>
                                </div>

                                <div className="bg-brand-black/5 dark:bg-brand-white/5 rounded-xl p-6">
                                    <div>
                                        <InputLabel value="Nomor WhatsApp Admin" className="mb-2" />
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <TextInput
                                                    value={data.admin_whatsapp}
                                                    onChange={(e) => setData('admin_whatsapp', e.target.value)}
                                                    className="w-full py-3 text-sm"
                                                    placeholder="6282232586727"
                                                />
                                                <p className="text-gray-500 text-[10px] mt-2">
                                                    Format: 62xxxxxxxxxx (tanpa +)
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => window.open(`https://wa.me/${data.admin_whatsapp}`, '_blank')}
                                                className="shrink-0 px-4 py-3 bg-green-500 hover:bg-green-600 text-white text-xs font-black rounded-lg transition-colors"
                                                title="Test WhatsApp"
                                            >
                                                Test WA
                                            </button>
                                        </div>
                                        {errors.admin_whatsapp && (
                                            <p className="text-red-500 text-xs mt-2">{errors.admin_whatsapp}</p>
                                        )}
                                    </div>

                                    {/* Info Box */}
                                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                                            💡 Nomor ini akan digunakan di:
                                        </p>
                                        <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1 list-disc list-inside">
                                            <li>Form Kontak di halaman Home</li>
                                            <li>Tombol WhatsApp di halaman Pricelist</li>
                                            <li>Chat pembayaran di halaman Checkout</li>
                                            <li>Semua link WhatsApp di website</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Template Section */}
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-lg font-black text-brand-black dark:text-brand-white mb-2">
                                        Template Follow Up
                                    </h2>
                                    <p className="text-xs text-brand-black/60 dark:text-brand-white/60 uppercase tracking-wide">
                                        Template pesan yang akan dikirim ke WhatsApp klien
                                    </p>
                                </div>

                                <div className="bg-brand-black/5 dark:bg-brand-white/5 rounded-xl p-6">
                                    <div>
                                        <InputLabel value="Template Pesan Follow Up" className="mb-2" />
                                        <textarea
                                            value={data.follow_up_template}
                                            onChange={(e) => setData('follow_up_template', e.target.value)}
                                            className="w-full h-40 bg-white dark:bg-brand-black/40 border border-brand-black/10 dark:border-brand-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-gold focus:border-brand-gold translation-all scrollbar-thin overflow-y-auto"
                                            placeholder="Halo [client_name], ..."
                                        ></textarea>
                                        <div className="mt-4 p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-lg">
                                            <p className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mb-2">
                                                Variabel yang tersedia:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {['[client_name]', '[booking_code]', '[package_name]', '[scheduled_date]'].map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-white dark:bg-brand-black rounded text-[9px] font-mono border border-brand-gold/20 leading-none">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-[9px] text-brand-black/40 dark:text-brand-white/40 mt-2 italic font-bold">
                                                * Klik pada variabel untuk menyalin (Coming soon) atau tulis manual.
                                            </p>
                                        </div>
                                        {errors.follow_up_template && (
                                            <p className="text-red-500 text-xs mt-2">{errors.follow_up_template}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4 border-t border-brand-black/10 dark:border-brand-white/10">
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Magic Link Section */}
                    <div className="mt-8 bg-white dark:bg-brand-black/40 border border-brand-black/10 dark:border-brand-white/10 rounded-2xl p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-black text-brand-black dark:text-brand-white mb-2">
                                Akses Khusus (Magic Link)
                            </h2>
                            <p className="text-xs text-brand-black/60 dark:text-brand-white/60 uppercase tracking-wide">
                                Bagikan link ini untuk membuka akses penuh pricelist tanpa login
                            </p>
                        </div>

                        <div className="bg-brand-black/5 dark:bg-brand-white/5 rounded-xl p-6 border border-dashed border-brand-black/10">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex-1 w-full">
                                    <div className="bg-white dark:bg-brand-black px-4 py-3 rounded-lg text-xs font-mono text-brand-black/60 dark:text-brand-white/60 break-all border border-black/5">
                                        {window.location.origin}/open-access/afstudio-unlock
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const url = `${window.location.origin}/open-access/afstudio-unlock`;
                                        navigator.clipboard.writeText(url);
                                        alert('Magic Link berhasil disalin!');
                                    }}
                                    className="w-full sm:w-auto shrink-0 px-6 py-3 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    Salin Link
                                </button>
                            </div>
                            <p className="text-[10px] text-brand-gold font-bold mt-4 uppercase tracking-tighter">
                                💡 Tip: Kirim link ini ke customer lewat WhatsApp.
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 p-6 bg-brand-black/5 dark:bg-brand-white/5 rounded-lg border border-brand-black/10 dark:border-brand-white/10">
                        <h3 className="text-sm font-black text-brand-black dark:text-brand-white mb-2">
                            Perlu Bantuan?
                        </h3>
                        <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                            Masukkan nomor WhatsApp admin dalam format 62xxxxxxxxxx. Pastikan nomor aktif dan terdaftar di WhatsApp untuk menerima pesan dari website.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
