import React from 'react';
import ThemeToggle from '../Components/ThemeToggle';
import { useTheme } from '../Contexts/ThemeContext';

export default function AdminLayout({ children, showToggle = true }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-white dark:bg-brand-black text-brand-black dark:text-brand-white">
            {/* Minimalist Admin Header with Toggle */}
            {showToggle && (
                <div className="fixed top-6 right-6 z-100 flex items-center space-x-4">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
            )}

            <main className="grow">
                {children}
            </main>
        </div>
    );
}
