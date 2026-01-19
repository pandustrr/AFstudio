import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChartBarIcon, CameraIcon, StarIcon, ArrowRightOnRectangleIcon, BuildingOfficeIcon, BanknotesIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../Contexts/ThemeContext';

export default function AdminSidebar({ isOpen, toggleSidebar }) {
    const { url } = usePage();
    const { theme, toggleTheme } = useTheme();

    const user = usePage().props.auth.user;
    const prefix = url.startsWith('/editor') ? '/editor' : '/admin';

    const allMenuItems = [
        { label: 'Dashboard', href: `${prefix}/dashboard`, icon: ChartBarIcon },
        { label: 'About Page', href: `${prefix}/about`, icon: BuildingOfficeIcon },
        { label: 'Pricelist', href: `${prefix}/pricelist`, icon: BanknotesIcon },
        { label: 'Reservations', href: `${prefix}/bookings`, icon: CalendarDaysIcon },
        { label: 'Manage Rooms', href: `${prefix}/rooms`, icon: BuildingOfficeIcon },
        { label: 'Request Edit', href: `${prefix}/photo-editing`, icon: CameraIcon },
        { label: 'Reviews', href: `${prefix}/reviews`, icon: StarIcon },
    ];

    const isEditorRoute = url.startsWith('/editor');
    const menuItems = (user.role === 'editor' || isEditorRoute)
        ? allMenuItems.filter(item => item.label === 'Request Edit' || item.label === 'Dashboard')
        : allMenuItems;

    return (
        <>
            {/* Backdrop Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`w-64 min-h-screen bg-white dark:bg-brand-black border-r border-black/5 dark:border-white/5 flex flex-col pt-8 pb-6 px-5 fixed left-0 top-0 z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Brand / Logo */}
                <div className="flex items-center space-x-3 px-3 mb-12">
                    <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white font-black text-xs">AF</div>
                    <span className="font-black uppercase tracking-tighter text-sm text-brand-black dark:text-brand-white">Control Panel</span>
                </div>

                <div className="flex flex-col space-y-1">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const IconComponent = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${isActive
                                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 scale-105'
                                    : 'text-brand-black/40 dark:text-brand-white/40 hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                <IconComponent className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto space-y-2">
                    <div className="px-4 py-3 flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Theme</span>
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="scale-75 origin-right" />
                    </div>
                    <Link
                        href={url.startsWith('/editor') ? "/editor/logout" : "/admin/logout"}
                        method="post"
                        as="button"
                        onSuccess={() => window.location.href = url.startsWith('/editor') ? '/editor/login' : '/admin/login'}
                        onError={() => window.location.reload()}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest text-brand-red hover:bg-brand-red/5 transition-all text-left"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Keluar</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
