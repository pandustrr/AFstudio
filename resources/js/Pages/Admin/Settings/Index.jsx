import React from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SettingsIndex({ settings, flash }) {
    const { data, setData, patch, processing, errors } = useForm({
        admin_whatsapp: settings?.admin_whatsapp || '6281230487469',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch('/admin/settings');
    };

    return (
        <AdminLayout>
            <Head title="Settings" />
            
            <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
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
                                                placeholder="6281230487469"
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

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-brand-black/10 dark:border-brand-white/10">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </PrimaryButton>
                        </div>
                    </form>
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
