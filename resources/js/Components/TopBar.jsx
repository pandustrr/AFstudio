import React from 'react';
import { usePage } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';
import { useTheme } from '@/Contexts/ThemeContext';

export default function TopBar() {
    const { auth, url } = usePage().props;
    const { theme, toggleTheme } = useTheme();

    const getPageLabel = () => {
        const currentUrl = url || '';
        if (currentUrl.includes('dashboard')) return 'Dashboard';
        if (currentUrl.includes('bookings')) return 'Reservations';
        if (currentUrl.includes('photographers')) return 'Manage FG';
        if (currentUrl.includes('photographer-sessions')) return 'Monitoring FG';
        if (currentUrl.includes('photo-editing')) return 'Editor Panel';
        if (currentUrl.includes('reviews')) return 'Reviews';
        if (currentUrl.includes('pricelist')) return 'Pricelist Settings';
        if (currentUrl.includes('about')) return 'About Page';
        return 'Control Panel';
    };

    if (!auth || !auth.user) return null;

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-brand-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-0.5">{getPageLabel()}</h2>
                        <h1 className="hidden sm:block text-xs font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">AFSTUDIO <span className="text-brand-gold italic">/</span> SYSTEMS</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden sm:block">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="scale-90" />
                    </div>

                    <div className="h-8 w-px bg-black/10 dark:bg-white/10 hidden sm:block"></div>

                    {/* Photographer Info */}
                    <div className="flex items-center gap-3 pl-2 sm:pl-0 border-l sm:border-0 border-black/5 dark:border-white/5">
                        <div className="text-right hidden sm:block">
                            <p className="text-[11px] font-black uppercase tracking-tight text-brand-black dark:text-brand-white leading-none mb-1">{auth.user.name}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-brand-gold leading-none">{auth.user.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center p-0.5 border border-black/5 dark:border-white/5">
                            <div className="w-full h-full rounded-lg bg-brand-red flex items-center justify-center text-white text-[10px] font-black uppercase">
                                {auth.user.name.substring(0, 2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
