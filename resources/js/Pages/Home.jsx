import React from 'react';
import GuestLayout from '../Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <GuestLayout>
            <Head title="Welcome" />

            <div className="relative min-h-screen bg-gray-900 overflow-hidden selection:bg-red-500 selection:text-white text-white">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span>System Status: Operational</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 pb-2">
                            Laravel + Inertia
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Currently running on <span className="text-yellow-400 font-semibold">Vite</span> with <span className="text-cyan-400 font-semibold">React</span> and styled with <span className="text-sky-400 font-semibold">Tailwind CSS</span>.
                            A modern, full-stack foundation for your next big idea.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a href="https://laravel.com/docs" target="_blank" className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95">
                                Documentation
                            </a>
                            <a href="https://github.com/check" target="_blank" className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                                Github Repo
                            </a>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-all hover:bg-white/10">
                            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Backend Power</h3>
                            <p className="text-gray-400 text-sm">
                                Built on Laravel 11. Robust, secure, and developer-friendly.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all hover:bg-white/10">
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Fast Refresh</h3>
                            <p className="text-gray-400 text-sm">
                                Instant feedback with Vite and React Fast Refresh.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-white/10">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Modern UI</h3>
                            <p className="text-gray-400 text-sm">
                                Composable interfaces with React and Inertia linkage.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-20">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">© 2024 Your Company. All rights reserved.</p>
                        <div className="flex gap-6 text-sm font-medium text-gray-400">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
