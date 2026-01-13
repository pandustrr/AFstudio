import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';

export default function GuestLayout({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-white dark:bg-brand-black text-brand-black dark:text-brand-white">
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-white dark:bg-brand-black border-t border-black/5 dark:border-white/5 py-10 text-center transition-colors">
                <p className="text-brand-black/40 dark:text-brand-white/40 text-sm">
                    &copy; {new Date().getFullYear()} <span className="text-brand-gold">AFstudio</span>. Professional Photography.
                </p>
            </footer>
        </div>
    );
}
