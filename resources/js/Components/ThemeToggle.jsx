import React from 'react';

export default function ThemeToggle({ theme, toggleTheme, className = "" }) {
    return (
        <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full bg-brand-black/5 dark:bg-white/10 hover:bg-brand-black/10 dark:hover:bg-white/20 text-brand-black dark:text-brand-white transition-all duration-300 border border-brand-black/10 dark:border-white/20 shadow-sm ${className}`}
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
        </button>
    );
}
