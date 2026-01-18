import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../Contexts/ThemeContext';
import { ShoppingCartIcon, XMarkIcon, MagnifyingGlassIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

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

    const [cartUid, setCartUid] = useState(null);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [inputUid, setInputUid] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const { props } = usePage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Get UID for cart link
        const uid = localStorage.getItem('afstudio_cart_uid');
        if (uid) {
            // Force reset if UID is in old format (no dash)
            if (!uid.includes('-')) {
                localStorage.removeItem('afstudio_cart_uid');
                setCartUid(null);
                setInputUid('');
            } else {
                setCartUid(uid);
                setInputUid(uid);
            }
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [props.flash, isCartModalOpen]); // Re-check on flash changes (adding to cart)

    const handleUidSubmit = (e) => {
        e.preventDefault();
        if (inputUid.trim()) {
            const formattedUid = inputUid.trim().toUpperCase();
            localStorage.setItem('afstudio_cart_uid', formattedUid);
            setCartUid(formattedUid);
            setIsCartModalOpen(false);
            router.visit(`/cart?uid=${formattedUid}`);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

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
                        <button
                            onClick={() => setIsCartModalOpen(true)}
                            className="relative text-brand-black/70 dark:text-brand-white/70 hover:text-brand-gold transition-colors duration-300 ml-4 scale-90"
                        >
                            <ShoppingCartIcon className="w-6 h-6" />
                        </button>

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
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setIsCartModalOpen(true);
                        }}
                        className="text-2xl font-black uppercase tracking-widest text-brand-black dark:text-brand-white hover:text-brand-gold transition-colors flex items-center gap-2"
                    >
                        <ShoppingCartIcon className="w-6 h-6" />
                        CART
                    </button>
                </div>
            </div>
            {/* UID Input Modal */}
            <Transition appear show={isCartModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-60" onClose={() => setIsCartModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-brand-black border border-white/10 p-8 text-left shadow-[0_0_50px_0_rgba(0,0,0,0.3)] transition-all">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title as="h3" className="text-xl font-black uppercase tracking-tighter italic text-brand-black dark:text-brand-white">
                                            Buka Keranjang
                                        </Dialog.Title>
                                        <button onClick={() => setIsCartModalOpen(false)} className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                            <XMarkIcon className="w-5 h-5 text-brand-black dark:text-brand-white" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUidSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">
                                                Masukkan UID Sesi Anda
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={inputUid}
                                                    onChange={(e) => setInputUid(e.target.value)}
                                                    placeholder="Contoh: PANDU-123456"
                                                    className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-brand-gold focus:ring-0 rounded-2xl px-5 py-4 pr-12 text-brand-black dark:text-brand-white font-black tracking-widest uppercase placeholder:text-black/20 dark:placeholder:text-white/20 transition-all font-mono"
                                                    autoFocus
                                                />
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                    {inputUid && (
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(inputUid)}
                                                            className="p-2 rounded-lg text-brand-gold hover:bg-brand-gold/10 transition-all active:scale-90"
                                                            title="Copy UID"
                                                        >
                                                            {isCopied ? <CheckIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                                                        </button>
                                                    )}
                                                    <MagnifyingGlassIcon className="w-5 h-5 text-brand-black/20 dark:text-brand-white/20 mr-2" />
                                                </div>
                                            </div>
                                            <p className="text-[9px] font-bold text-brand-gold uppercase tracking-tighter">
                                                *UID dapat ditemukan pada notifikasi setelah tambah ke keranjang
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <button
                                                type="submit"
                                                className="flex-1 py-4 bg-brand-red text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCartIcon className="w-5 h-5" />
                                                Buka
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("Hapus sesi keranjang saat ini?")) {
                                                        localStorage.removeItem('afstudio_cart_uid');
                                                        setCartUid(null);
                                                        setInputUid('');
                                                        setIsCartModalOpen(false);
                                                        router.visit('/price-list');
                                                    }
                                                }}
                                                className="py-4 px-6 bg-black/5 dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40 font-black uppercase tracking-tighter rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-[10px]"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </nav>
    );
}
