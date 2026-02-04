import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ChartBarIcon,
    CameraIcon,
    StarIcon,
    ArrowRightOnRectangleIcon,
    BuildingOfficeIcon,
    BanknotesIcon,
    CalendarDaysIcon,
    UserIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    PencilSquareIcon,
    TicketIcon,
    CogIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function AdminSidebar({ isOpen, toggleSidebar }) {
    const { url } = usePage();
    const [openGroups, setOpenGroups] = useState({
        photographer: true,
        editor: true
    });

    const toggleGroup = (group) => {
        setOpenGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const user = usePage().props.auth.user;
    let prefix = '/admin';
    if (url.startsWith('/editor')) prefix = '/editor';
    else if (url.startsWith('/photographer')) prefix = '/photographer';

    const isEditorRoute = url.startsWith('/editor');
    const isPhotographerRoute = url.startsWith('/photographer');

    // Auto-open groups based on current URL
    useEffect(() => {
        if (url.includes('bookings') || url.includes('photographers') || url.includes('photographer-sessions')) {
            setOpenGroups(prev => ({ ...prev, photographer: true }));
        }
        if (url.includes('photo-editing')) {
            setOpenGroups(prev => ({ ...prev, editor: true }));
        }
    }, [url]);

    const renderMenuItem = (item, isSub = false) => {
        const isActive = url.startsWith(item.href);
        const IconComponent = item.icon;
        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${isSub ? 'ml-4 py-2 opacity-80' : ''} ${isActive
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 scale-[1.02]'
                    : 'text-brand-black/40 dark:text-brand-white/40 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
            >
                <IconComponent className={`w-4 h-4 ${isSub ? 'w-3 h-3' : ''}`} />
                <span>{item.label}</span>
            </Link>
        );
    };

    const renderGroupHeader = (label, icon, isOpen, onToggle) => {
        const IconComponent = icon;
        return (
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest text-brand-black/60 dark:text-brand-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-all mb-1 mt-2"
            >
                <div className="flex items-center space-x-3">
                    <IconComponent className="w-4 h-4" />
                    <span>{label}</span>
                </div>
                {isOpen ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronRightIcon className="w-3 h-3" />}
            </button>
        );
    };

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

                <div className="flex flex-col space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Top Level Items */}
                    {renderMenuItem({ label: 'Dashboard', href: `${prefix}/dashboard`, icon: ChartBarIcon })}
                    {user.role === 'admin' && (
                        <>
                            {renderMenuItem({ label: 'Settings', href: `/admin/settings`, icon: CogIcon })}
                            {renderMenuItem({ label: 'Home Page', href: `/admin/home`, icon: BuildingOfficeIcon })}
                            {renderMenuItem({ label: 'About Page', href: `/admin/about`, icon: BuildingOfficeIcon })}
                            {renderMenuItem({ label: 'Pricelist', href: `/admin/pricelist`, icon: BanknotesIcon })}
                            {renderMenuItem({ label: 'Voucher Codes', href: `/admin/referral-codes`, icon: TicketIcon })}
                            {renderMenuItem({ label: 'Reviews', href: `/admin/reviews`, icon: StarIcon })}

                            {/* Photographer Group (Admin Control) */}
                            {renderGroupHeader('Photographer', UserIcon, openGroups.photographer, () => toggleGroup('photographer'))}
                            {openGroups.photographer && (
                                <div className="space-y-1 mb-2">
                                    {renderMenuItem({ label: 'List Booking', href: `/admin/bookings`, icon: CalendarDaysIcon }, true)}
                                    {renderMenuItem({ label: 'Manage FG', href: `/admin/photographers`, icon: UserIcon }, true)}
                                    {renderMenuItem({ label: 'Monitoring FG', href: `/admin/photographer-sessions`, icon: CalendarDaysIcon }, true)}
                                </div>
                            )}

                            {/* Editor Group (Admin Control) */}
                            {renderGroupHeader('Editor', PencilSquareIcon, openGroups.editor, () => toggleGroup('editor'))}
                            {openGroups.editor && (
                                <div className="space-y-1 mb-2">
                                    {renderMenuItem({ label: 'Request Edit', href: `/admin/photo-editing`, icon: CameraIcon }, true)}
                                </div>
                            )}

                        </>
                    )}

                    {/* Role Specific Items */}
                    {(user.role === 'photographer' || (user.role === 'admin' && prefix === '/photographer')) && (
                        <div className="space-y-1">
                            {renderMenuItem({ label: 'Jadwal Sesi', href: `/photographer/sessions`, icon: CalendarDaysIcon })}
                            {renderMenuItem({ label: 'List Booking', href: `/photographer/reservations`, icon: CalendarDaysIcon })}
                        </div>
                    )}

                    {(user.role === 'editor' || (user.role === 'admin' && prefix === '/editor')) && (
                        <div className="space-y-1">
                            {renderMenuItem({ label: 'Request Edit', href: `/editor/photo-editing`, icon: CameraIcon })}
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4">
                    {renderMenuItem({ label: 'Profile', href: `${prefix}/profile`, icon: UserIcon })}
                    <div className="mt-2 pt-4 border-t border-black/5 dark:border-white/5">
                        <Link
                            href={url.startsWith('/photographer') ? "/photographer/logout" : (url.startsWith('/editor') ? "/editor/logout" : "/admin/logout")}
                            method="post"
                            as="button"
                            onSuccess={() => window.location.href = url.startsWith('/photographer') ? '/photographer/login' : (url.startsWith('/editor') ? '/editor/login' : '/admin/login')}
                            onError={() => window.location.reload()}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest text-brand-red hover:bg-brand-red/5 transition-all text-left"
                        >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                            <span>Keluar</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
