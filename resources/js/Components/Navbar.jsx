import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../Contexts/ThemeContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
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
                ? 'bg-white/80 dark:bg-brand-black/80 backdrop-blur-xl py-1.5 md:py-2 border-b border-black/5 dark:border-white/5 shadow-sm'
                : 'bg-transparent py-3 md:py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-10 md:h-14">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-brand-red rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-500">
                            <span className="text-brand-white font-black text-[9px] md:text-[10px]">AF</span>
                        </div>
                        <span className="text-base md:text-lg font-bold text-brand-black dark:text-brand-white tracking-widest uppercase">
                            AF<span className="text-brand-gold group-hover:text-brand-red transition-colors">STUDIO</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const isActive = url === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:text-brand-gold ${isActive ? 'text-brand-gold' : 'text-brand-black/70 dark:text-brand-white/70'
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-brand-red animate-pulse"></span>
                                    )}
                                </Link>
                            );
                        })}

                        {/* Cart Icon */}
                        <Link
                            href="/cart"
                            className="relative text-brand-black/70 dark:text-brand-white/70 hover:text-brand-gold transition-colors duration-300 ml-4 scale-90"
                        >
                            <ShoppingCartIcon className="w-6 h-6" />
                        </Link>

                        {/* Theme Toggle Button */}
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="ml-2 scale-90" />
                    </div>

                    {/* Mobile Toggle & Theme Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="scale-90" />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-brand-black dark:text-brand-white p-2 focus:outline-none"
                        >
                            <div className="w-5 h-4 flex flex-col justify-between items-end">
                                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-5 -rotate-45 translate-y-1.5' : 'w-5'}`}></span>
                                <span className={`h-0.5 bg-brand-gold transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-3'}`}></span>
                                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-5 rotate-45 -translate-y-2' : 'w-4'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white dark:bg-brand-black z-40 transition-transform duration-500 md:hidden ${isOpen ? 'translate-y-0 visible' : '-translate-y-full invisible'}`}>
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
                    {/* Removed redundant text that might cause overlap issues on scroll */}
                    {/* Mobile Cart Link */}
                    <Link
                        href="/cart"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-black uppercase tracking-widest text-brand-black dark:text-brand-white hover:text-brand-gold transition-colors flex items-center gap-2"
                    >
                        <ShoppingCartIcon className="w-6 h-6" />
                        CART
                    </Link>
                </div>
            </div>
        </nav>
    );
}
