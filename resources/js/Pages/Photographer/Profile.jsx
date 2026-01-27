import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { UserIcon, KeyIcon, PhoneIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Edit({ user }) {
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        username: user.username,
        phone: user.phone || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(window.location.pathname, {
            onSuccess: () => reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit Profil" />

            <div className="pt-24 pb-20 px-6 max-w-2xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1 leading-none">Pengaturan Profil</h1>
                    <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-black uppercase tracking-widest leading-none">Perbarui informasi akun dan keamanan Anda.</p>
                </div>

                <form onSubmit={submit} className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl relative overflow-hidden">
                    {/* Username */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2 px-1">Username (Login)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <UserIcon className="h-4 w-4 text-brand-black/20 transition-colors group-focus-within:text-brand-gold" />
                            </div>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold transition-all uppercase"
                                required
                            />
                        </div>
                        {errors.username && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase">{errors.username}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2 px-1">Nomor WhatsApp</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <PhoneIcon className="h-4 w-4 text-brand-black/20 transition-colors group-focus-within:text-brand-gold" />
                            </div>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="628..."
                                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold transition-all"
                            />
                        </div>
                        <p className="text-[8px] text-brand-black/30 dark:text-brand-white/30 mt-2 px-1 lowercase italic">Bisa menggunakan format 08..., 628..., atau +62...</p>
                        {errors.phone && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase">{errors.phone}</p>}
                    </div>

                    <div className="h-px bg-black/5 dark:bg-white/5 my-8"></div>

                    {/* Current Password - Required for security updates */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2 px-1">Password Saat Ini</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <KeyIcon className="h-4 w-4 text-brand-black/20 transition-colors group-focus-within:text-brand-gold" />
                            </div>
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                placeholder="Masukkan password lama untuk verifikasi"
                                className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold transition-all"
                                required={data.password !== ''}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword('current')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/20 hover:text-brand-gold transition-colors"
                            >
                                {showPasswords.current ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.current_password && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase">{errors.current_password}</p>}
                    </div>

                    {/* New Password & Confirmation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2 px-1 h-4 flex items-center justify-between">
                                <span>Password Baru</span>
                                <span className="text-[7px] lowercase italic opacity-50 font-bold">(Kosongkan jika tetap)</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyIcon className="h-4 w-4 text-brand-black/20 transition-colors group-focus-within:text-brand-gold" />
                                </div>
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('new')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/20 hover:text-brand-gold transition-colors"
                                >
                                    {showPasswords.new ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 mb-2 px-1 h-4 flex items-center">
                                Konfirmasi Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyIcon className="h-4 w-4 text-brand-black/20 transition-colors group-focus-within:text-brand-gold" />
                                </div>
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('confirm')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/20 hover:text-brand-gold transition-colors"
                                >
                                    {showPasswords.confirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:translate-y-[-2px] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>

                        {recentlySuccessful && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-green-500 bg-green-500/10 py-3 rounded-xl animate-bounce">
                                <CheckCircleIcon className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Berhasil Tersimpan!</span>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
