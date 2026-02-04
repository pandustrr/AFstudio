import React, { useState } from 'react';
import ThemeToggle from '../Components/ThemeToggle';
import { useTheme } from '../Contexts/ThemeContext';
import AdminSidebar from '../Components/AdminSidebar';
import { usePage, Link } from '@inertiajs/react';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import TopBar from '@/Components/TopBar';

export default function AdminLayout({ children, showToggle = true, showSidebar = true }) {
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { auth, url } = usePage().props;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen flex font-sans transition-colors duration-300 bg-[#FAFAFA] dark:bg-brand-black text-brand-black dark:text-brand-white">
            {showSidebar && (
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
            )}

            <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:pl-64' : ''}`}>
                {/* Mobile Sidebar Toggle (Visible only on mobile) */}
                {showSidebar && (
                    <div className="lg:hidden fixed bottom-6 right-6 z-50">
                        <button
                            onClick={toggleSidebar}
                            className="p-4 bg-brand-red text-white rounded-2xl shadow-2xl shadow-brand-red/40 active:scale-95 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* TopBar Component */}
                {showSidebar && <TopBar />}

                {showToggle && !showSidebar && (
                    <div className="fixed top-8 right-8 z-100 flex items-center space-x-4">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    </div>
                )}

                <main className="grow">
                    {children}
                </main>
            </div>
        </div>
    );
}
