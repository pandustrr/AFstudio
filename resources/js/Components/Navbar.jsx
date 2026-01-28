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
            // Force reset if UID is NOT in correct format AF-{5digits}
            const validFormat = /^AF-\d{5}$/.test(uid);
            if (!validFormat) {
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
            className={`fixed top-0 w-full z-100 transition-all duration-500 ${scrolled
                ? 'bg-white/70 dark:bg-brand-black/70 backdrop-blur-2xl py-1 md:py-2 border-b border-black/5 dark:border-white/5 shadow-sm'
                : 'bg-transparent py-2.5 md:py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-9 md:h-14">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center space-x-2.5">
                        <div className="w-5.5 h-5.5 md:w-7 md:h-7 bg-brand-red rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-all duration-500 shadow-lg shadow-brand-red/20">
                            <span className="text-brand-white font-black text-[8px] md:text-[10px]">AF</span>
                        </div>
                        <span className={`text-sm md:text-lg font-black tracking-[0.2em] uppercase transition-colors duration-300 ${!scrolled && (url === '/about' || url === '/review')
                            ? 'text-white'
                            : 'text-brand-black dark:text-brand-white'
                            }`}>
                            AF<span className="text-brand-gold group-hover:text-brand-red transition-colors">STUDIO</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-9">
                        {navLinks.map((link) => {
                            const isActive = url === link.href;
                            const isDarkHero = url === '/about' || url === '/review';
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative text-[9px] uppercase tracking-[0.25em] font-black transition-all duration-300 hover:text-brand-gold ${isActive
                                        ? 'text-brand-gold'
                                        : (!scrolled && isDarkHero ? 'text-white' : 'text-brand-black/70 dark:text-brand-white/70')
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-brand-red rounded-full"></span>
                                    )}
                                </Link>
                            );
                        })}

                        {/* Cart Icon */}
                        <button
                            onClick={() => setIsCartModalOpen(true)}
                            className={`relative transition-all duration-300 ml-5 hover:scale-110 ${!scrolled && (url === '/about' || url === '/review') ? 'text-white' : 'text-brand-black/70 dark:text-brand-white/70'
                                } hover:text-brand-gold`}
                        >
                            <ShoppingCartIcon className="w-5.5 h-5.5" />
                        </button>

                        {/* Theme Toggle Button */}
                        <ThemeToggle
                            theme={theme}
                            toggleTheme={toggleTheme}
                            className={`ml-3 scale-90 ${!scrolled && (url === '/about' || url === '/review') ? 'border-white/20 text-white bg-white/10 hover:bg-white/20' : ''}`}
                        />
                    </div>

                    {/* Mobile Toggle & Theme Button */}
                    <div className="md:hidden flex items-center space-x-3">
                        <ThemeToggle
                            theme={theme}
                            toggleTheme={toggleTheme}
                            className={`scale-85 ${!scrolled && (url === '/about' || url === '/review') ? 'border-white/20 text-white bg-white/10 hover:bg-white/20' : ''}`}
                        />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-1.5 focus:outline-none transition-colors ${!scrolled && (url === '/about' || url === '/review') ? 'text-white' : 'text-brand-black dark:text-brand-white'
                                }`}
                        >
                            <div className="w-5 h-3.5 flex flex-col justify-between items-end">
                                <span className={`h-0.5 bg-current transition-all duration-500 rounded-full ${isOpen ? 'w-5 -rotate-45 translate-y-1.5' : 'w-5'}`}></span>
                                <span className={`h-0.5 bg-brand-gold transition-all duration-500 rounded-full ${isOpen ? 'opacity-0' : 'w-3.5'}`}></span>
                                <span className={`h-0.5 bg-current transition-all duration-500 rounded-full ${isOpen ? 'w-5 rotate-45 -translate-y-1.5' : 'w-4'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Sidebar */}
            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-100 md:hidden" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-400"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-brand-black/40 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex justify-end">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-out duration-500"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in duration-400"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="w-[70%] max-w-[260px] h-full bg-white dark:bg-brand-black p-6 shadow-2xl border-l border-black/5 dark:border-white/10 overflow-y-auto relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -mr-16 -mt-16"></div>
                                <div className="relative z-10 flex flex-col items-center space-y-6">
                                    <div className="grid grid-cols-1 gap-1 items-center justify-items-center mb-2">
                                        <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center mb-1 shadow-xl shadow-brand-red/30">
                                            <span className="text-white font-black text-xs">AF</span>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-gold">Menu Navigasi</span>
                                    </div>

                                    {navLinks.map((link, i) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`text-base font-black uppercase tracking-[0.25em] transition-all duration-300 hover:text-brand-gold ${url === link.href ? 'text-brand-red scale-105' : 'text-brand-black/70 dark:text-brand-white/70'
                                                }`}
                                            style={{ transitionDelay: `${i * 50}ms` }}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}

                                    <div className="w-full h-px bg-black/5 dark:bg-white/5 my-2"></div>

                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsCartModalOpen(true);
                                        }}
                                        className="p-4 bg-brand-black dark:bg-brand-white text-white dark:text-brand-black rounded-2xl active:scale-90 transition-all shadow-xl hover:bg-brand-gold hover:text-brand-black"
                                    >
                                        <ShoppingCartIcon className="w-6 h-6" />
                                    </button>

                                    <button onClick={() => setIsOpen(false)} className="mt-4 p-3 bg-black/5 dark:bg-white/5 rounded-full hover:bg-brand-red hover:text-white transition-all">
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
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
                                                    placeholder="Contoh: AF-12345"
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
        </nav >
    );
}
