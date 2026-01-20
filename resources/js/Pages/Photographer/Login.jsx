import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useTheme } from '../../Contexts/ThemeContext';
import ThemeToggle from '../../Components/ThemeToggle';
import { Head, useForm } from '@inertiajs/react';

export default function PhotographerLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
        type: 'photographer',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/photographer/login', {
            onFinish: () => reset('password'),
        });
    };

    const { theme, toggleTheme } = useTheme();

    return (
        <AdminLayout showToggle={false} showSidebar={false}>
            <Head title="Photographer Login" />

            <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-brand-gold/5 via-transparent to-brand-red/5 transition-all duration-300">
                <div className="max-w-md w-full mx-auto relative group">
                    <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl transition-all duration-500 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-6 right-6 z-10">
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="scale-90" />
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-red/5 rounded-full blur-3xl"></div>

                        <div className="text-center mb-10 relative z-10">
                            <div className="inline-block p-4 bg-brand-gold/10 rounded-2xl mb-4">
                                <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-2 tracking-tighter italic">Photographer Panel</h2>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest leading-tight">Session & Booking Management</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60 ml-1 font-sans">Username</label>
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="Enter username"
                                    className={`w-full bg-black/5 dark:bg-white/5 border ${errors.username ? 'border-brand-red' : 'border-black/10 dark:border-white/10'} rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-gold transition-all font-medium placeholder:text-brand-black/20 dark:placeholder:text-brand-white/20`}
                                    required
                                />
                                {errors.username && (
                                    <p className="text-brand-red text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">{errors.username}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60 ml-1 font-sans">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-black/5 dark:bg-white/5 border ${errors.password ? 'border-brand-red' : 'border-black/10 dark:border-white/10'} rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-gold transition-all font-medium placeholder:text-brand-black/20 dark:placeholder:text-brand-white/20`}
                                    required
                                />
                                {errors.password && (
                                    <p className="text-brand-red text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-brand-gold hover:bg-black hover:text-white text-brand-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all disabled:opacity-50 shadow-xl shadow-brand-gold/20 active:scale-95"
                            >
                                {processing ? 'Authenticating...' : 'Masuk Photographer Panel'}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 text-center relative z-10">
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-bold uppercase tracking-widest">
                                AFstudio &copy; 2024 &bull; Photographer Space
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
