import React, { useState } from 'react';
import ThemeToggle from '../Components/ThemeToggle';
import { useTheme } from '../Contexts/ThemeContext';
import AdminSidebar from '../Components/AdminSidebar';

export default function AdminLayout({ children, showToggle = true, showSidebar = true }) {
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen flex font-sans transition-colors duration-300 bg-black/2 dark:bg-brand-black text-brand-black dark:text-brand-white">
            {showSidebar && (
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
            )}

            <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:pl-64' : ''}`}>
                {/* Mobile Header */}
                {showSidebar && (
                    <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-brand-black border-b border-black/5 dark:border-white/5 sticky top-0 z-30">
                        <button onClick={toggleSidebar} className="p-2 -ml-2 text-brand-black dark:text-brand-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="font-black uppercase italic text-xs tracking-tighter">AF Control</div>
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="scale-75" />
                    </div>
                )}

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
