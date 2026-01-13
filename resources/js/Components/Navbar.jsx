import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar({ theme, toggleTheme }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { url } = usePage();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Price List', href: '/price-list' },
        { name: 'Selector Photo', href: '/selector-photo' },
        { name: 'Review', href: '/review' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 dark:bg-brand-black/80 backdrop-blur-xl py-4 border-b border-black/5 dark:border-white/5'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-500">
                            <span className="text-brand-white font-black text-xs">AF</span>
                        </div>
                        <span className="text-xl font-bold text-brand-black dark:text-brand-white tracking-widest uppercase">
                            AF<span className="text-brand-gold group-hover:text-brand-red transition-colors">STUDIO</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => {
                            const isActive = url === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:text-brand-gold ${isActive ? 'text-brand-gold' : 'text-brand-black/70 dark:text-brand-white/70'
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-red animate-pulse"></span>
                                    )}
                                </Link>
                            );
                        })}

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 ml-4 rounded-full bg-brand-black/5 dark:bg-white/10 hover:bg-brand-black/10 dark:hover:bg-white/20 text-brand-black dark:text-brand-white transition-all duration-300 border border-brand-black/10 dark:border-white/20 shadow-sm"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Toggle & Theme Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-brand-black/5 dark:bg-white/10 text-brand-black dark:text-brand-white border border-brand-black/10 dark:border-white/20 shadow-sm"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-brand-black dark:text-brand-white p-2 focus:outline-none"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between items-end">
                                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'}`}></span>
                                <span className={`h-0.5 bg-brand-gold transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`}></span>
                                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-5'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white dark:bg-brand-black z-[-1] transition-transform duration-500 md:hidden ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-black uppercase tracking-widest text-brand-black dark:text-brand-white hover:text-brand-gold transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-10">
                        <span className="text-brand-red text-xs tracking-widest uppercase font-bold">AFstudio Professional</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
