import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useTheme } from '../../Contexts/ThemeContext';
import ThemeToggle from '../../Components/ThemeToggle';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    const { theme, toggleTheme } = useTheme();

    return (
        <AdminLayout showToggle={false}>
            <Head title="Admin Login" />

            <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-brand-red/5 via-transparent to-brand-gold/5 transition-all duration-300">
                <div className="max-w-md w-full mx-auto relative group">
                    <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl transition-all duration-500 backdrop-blur-xl relative overflow-hidden">
                        {/* Repositioned Toggle Button */}
                        <div className="absolute top-6 right-6 z-10">
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="scale-90" />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-red/5 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl"></div>

                        <div className="text-center mb-10 relative z-10">
                            <div className="inline-block p-4 bg-brand-red/10 rounded-2xl mb-4">
                                <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-brand-black dark:text-brand-white uppercase mb-2 tracking-tighter italic">Admin Panel</h2>
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest leading-tight">Authorized Access Only</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60 ml-1 font-sans">Username</label>
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="Enter username"
                                    className={`w-full bg-black/5 dark:bg-white/5 border ${errors.username ? 'border-brand-red' : 'border-black/10 dark:border-white/10'} rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-medium placeholder:text-brand-black/20 dark:placeholder:text-brand-white/20`}
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
                                    className={`w-full bg-black/5 dark:bg-white/5 border ${errors.password ? 'border-brand-red' : 'border-black/10 dark:border-white/10'} rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-red transition-all font-medium placeholder:text-brand-black/20 dark:placeholder:text-brand-white/20`}
                                    required
                                />
                                {errors.password && (
                                    <p className="text-brand-red text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${data.remember ? 'bg-brand-red border-brand-red' : 'border-black/20 dark:border-white/20'}`}>
                                        {data.remember && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                    </div>
                                    <span className="ml-2 text-[10px] font-bold text-brand-black/40 dark:text-brand-white/40 uppercase tracking-widest group-hover:text-brand-black dark:group-hover:text-brand-white transition-colors">Ingat Saya</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-brand-red hover:bg-black text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all disabled:opacity-50 shadow-xl shadow-brand-red/20 active:scale-95"
                            >
                                {processing ? 'Authenticating...' : 'Masuk Control Panel'}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 text-center relative z-10">
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-[9px] font-bold uppercase tracking-widest">
                                AFstudio &copy; 2024 &bull; Admin Space
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
