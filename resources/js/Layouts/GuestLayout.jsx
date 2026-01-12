import React from 'react';
import Navbar from '../Components/Navbar';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-brand-black flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-brand-black border-t border-white/5 py-10 text-center">
                <p className="text-brand-white/40 text-sm">
                    &copy; {new Date().getFullYear()} <span className="text-brand-gold">AFstudio</span>. Professional Photography.
                </p>
            </footer>
        </div>
    );
}
