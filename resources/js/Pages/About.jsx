import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { BuildingOfficeIcon, UserGroupIcon, SparklesIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function About({ about }) {
    return (
        <div className="min-h-screen bg-brand-white dark:bg-brand-black transition-colors duration-300">
            <Head title="Tentang Kami - AFSTUDIO" />
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[35vh] md:h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {about?.image_path ? (
                        <img
                            src={`/storage/${about.image_path}`}
                            alt="AF Studio About Hero"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-brand-red/5"></div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-brand-black/50 via-brand-black/10 to-brand-white dark:to-brand-black transition-colors"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-3xl pt-12">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter italic mb-3 animate-fade-in-up">
                        {about?.title || 'ABOUT AF STUDIO'}
                    </h1>
                    <div className="w-10 h-1 bg-brand-gold mx-auto mb-3"></div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 md:py-16 px-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-red/10 rounded-full">
                            <BuildingOfficeIcon className="w-2.5 h-2.5 text-brand-red" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-brand-red">The Story</span>
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter">
                            MEMORIES THROUGH <br /><span className="text-brand-gold">OUR LENS</span>
                        </h2>
                        <p className="text-brand-black/60 dark:text-brand-white/60 text-xs md:text-sm leading-relaxed font-medium transition-colors">
                            {about?.description || 'Kami adalah studio fotografi profesional yang berdedikasi untuk menangkap momen-momen berharga Anda dalam kualitas terbaik.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-black/5 dark:border-white/5 text-center group hover:border-brand-gold transition-all">
                            <div className="text-2xl font-black text-brand-gold mb-0.5">5+</div>
                            <div className="text-[8px] uppercase font-black tracking-widest text-brand-black/40 dark:text-brand-white/40">Years Exp</div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-black/5 dark:border-white/5 text-center group hover:border-brand-gold transition-all mt-3">
                            <div className="text-2xl font-black text-brand-gold mb-0.5">1K+</div>
                            <div className="text-[8px] uppercase font-black tracking-widest text-brand-black/40 dark:text-brand-white/40">Happy Clients</div>
                        </div>
                    </div>
                </div>

                {/* Visi Misi */}
                {(about?.vision || about?.mission) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
                        <div className="bg-brand-red p-6 md:p-8 rounded-3xl text-white">
                            <div className="flex items-center gap-3 mb-3">
                                <SparklesIcon className="w-5 h-5 opacity-50" />
                                <h3 className="text-sm font-black uppercase tracking-widest">Our Vision</h3>
                            </div>
                            <p className="text-sm md:text-base font-bold italic leading-relaxed opacity-90">
                                "{about.vision}"
                            </p>
                        </div>
                        <div className="bg-brand-gold p-6 md:p-8 rounded-3xl text-brand-black">
                            <div className="flex items-center gap-3 mb-3">
                                <UserGroupIcon className="w-5 h-5 opacity-50" />
                                <h3 className="text-sm font-black uppercase tracking-widest">Our Mission</h3>
                            </div>
                            <div className="text-sm md:text-base font-bold leading-relaxed whitespace-pre-line">
                                {about.mission}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Footer */}
                <div className="bg-brand-black dark:bg-white/5 text-white p-6 md:p-10 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red/20 blur-[60px] -mr-20 -mt-20"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic">GET IN TOUCH <br /><span className="text-brand-gold">WITH US.</span></h3>
                            <p className="text-white/60 text-[10px] md:text-xs font-medium">Beri tahu kami momen apa yang ingin Anda abadikan. Kami siap membantu mewujudkannya.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 group/link">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/link:bg-brand-gold group-hover/link:text-brand-black transition-all">
                                    <EnvelopeIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-[8px] uppercase font-black tracking-widest opacity-40">Email Address</div>
                                    <div className="text-sm font-bold">{about?.email || 'studio@afstudio.com'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group/link">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/link:bg-brand-red group-hover/link:text-white transition-all">
                                    <PhoneIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-[8px] uppercase font-black tracking-widest opacity-40">Phone / WhatsApp</div>
                                    <div className="text-sm font-bold">{about?.phone || '+62 812 3456 7890'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
