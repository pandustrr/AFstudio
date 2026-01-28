import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { XMarkIcon, KeyIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Edit({ isOpen, onClose, photographer, isNew = false }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        oldPassword: '',
        phone: ''
    });

    useEffect(() => {
        if (photographer) {
            setFormData({
                name: photographer.name || '',
                username: photographer.username || '',
                password: '',
                oldPassword: photographer.plain_password || '',
                phone: photographer.phone || ''
            });
        } else {
            setFormData({
                name: '',
                username: '',
                password: '',
                oldPassword: '',
                phone: ''
            });
        }
        setShowPassword(false);
        setShowOldPassword(false);
    }, [photographer, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        if (photographer) {
            router.put(`/admin/photographers/${photographer.id}`, formData, {
                onSuccess: () => {
                    onClose();
                    resetForm();
                },
                onFinish: () => setProcessing(false)
            });
        } else {
            router.post('/admin/photographers', formData, {
                onSuccess: () => {
                    onClose();
                    resetForm();
                },
                onFinish: () => setProcessing(false)
            });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            username: '',
            password: '',
            oldPassword: '',
            phone: ''
        });
        setShowPassword(false);
        setShowOldPassword(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="fixed inset-0 bg-black/60" onClick={handleClose} />
            <div className="relative bg-white dark:bg-brand-black w-full max-w-md rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden transform transition-all">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                            {photographer ? 'Edit Fotografer' : 'Tambah Fotografer'}
                        </h2>
                        <button onClick={handleClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <XMarkIcon className="w-5 h-5 text-brand-black/40" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/50 dark:text-brand-white/50 mb-2 px-1">Nama Lengkap</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-4 w-4 text-brand-black/20 dark:text-brand-white/20" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nama Fotografer"
                                    className="w-full pl-11 pr-4 py-4 bg-brand-black/5 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold text-brand-black dark:text-brand-white placeholder:text-brand-black/50 dark:placeholder:text-brand-white/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/50 dark:text-brand-white/50 mb-2 px-1">Username (Untuk Login)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyIcon className="h-4 w-4 text-brand-black/20 dark:text-brand-white/20" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="username_fg"
                                    className="w-full pl-11 pr-4 py-4 bg-brand-black/5 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-mono font-bold text-brand-black dark:text-brand-white placeholder:text-brand-black/50 dark:placeholder:text-brand-white/50 transition-all uppercase"
                                    required
                                />
                            </div>
                        </div>

                        {photographer && (
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/50 dark:text-brand-white/50 mb-2 px-1">Password Lama</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyIcon className="h-4 w-4 text-brand-black/20 dark:text-brand-white/20" />
                                    </div>
                                    <input
                                        type={showOldPassword ? 'text' : 'password'}
                                        value={formData.oldPassword || '(Password tidak tersimpan)'}
                                        readOnly
                                        className="w-full pl-11 pr-12 py-4 bg-brand-black/5 dark:bg-black/20 border-0 rounded-2xl text-xs font-mono font-bold text-brand-black dark:text-brand-white cursor-not-allowed transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/40 dark:text-brand-white/40 hover:text-brand-gold transition-colors pointer-events-auto"
                                    >
                                        {showOldPassword ? (
                                            <EyeSlashIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-[8px] text-brand-black/40 dark:text-brand-white/40 mt-2 px-1 lowercase italic">
                                    {formData.oldPassword ? 'Klik icon mata untuk melihat password.' : 'Password lama tidak tersedia. Ubah password untuk menyimpan password baru.'}
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/50 dark:text-brand-white/50 mb-2 px-1">
                                {photographer ? 'Password Baru (Kosongkan jika tetap)' : 'Password'}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyIcon className="h-4 w-4 text-brand-black/20 dark:text-brand-white/20" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-4 bg-brand-black/5 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold text-brand-black dark:text-brand-white placeholder:text-brand-black/50 dark:placeholder:text-brand-white/50 transition-all"
                                    required={!photographer}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/40 dark:text-brand-white/40 hover:text-brand-gold transition-colors pointer-events-auto"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-black/50 dark:text-brand-white/50 mb-2 px-1">Nomor WhatsApp</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-brand-black/20 dark:text-brand-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                </div>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="628123456789"
                                    className="w-full pl-11 pr-4 py-4 bg-brand-black/5 dark:bg-black/20 border-0 rounded-2xl focus:ring-2 focus:ring-brand-gold/50 text-xs font-bold text-brand-black dark:text-brand-white placeholder:text-brand-black/50 dark:placeholder:text-brand-white/50 transition-all"
                                />
                            </div>
                            <p className="text-[8px] text-brand-black/30 dark:text-brand-white/30 mt-2 px-1 lowercase italic">Bisa menggunakan format 08..., 628..., atau +62...</p>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : (photographer ? 'Update Fotografer' : 'Daftarkan Fotografer')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
