import React from 'react';
import Navbar from '../Components/Navbar';
import WhatsAppButton from '../Components/WhatsAppButton';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-white dark:bg-brand-black text-brand-black dark:text-brand-white">
            <Navbar />
            <main className="grow">
                {children}
            </main>
            <footer className="bg-white dark:bg-brand-black border-t border-black/5 dark:border-white/5 py-10 text-center transition-colors">
                <p className="text-brand-black/40 dark:text-brand-white/40 text-sm">
                    &copy; {new Date().getFullYear()} <span className="text-brand-gold">AFstudio</span>. Professional Photography.
                </p>
            </footer>
            <WhatsAppButton />
        </div>
    );
}
