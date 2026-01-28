import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { BuildingOfficeIcon, SparklesIcon, EnvelopeIcon, PhoneIcon, XMarkIcon, CameraIcon, ChevronLeftIcon, ChevronRightIcon, BoltIcon, HeartIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function About({ about, moodboards = [] }) {
    const [previewImage, setPreviewImage] = React.useState(null);

    // Split moodboards for two-tier scrolling
    const midPoint = Math.ceil(moodboards.length / 2);
    const row1 = moodboards.slice(0, midPoint);
    const row2 = moodboards.slice(midPoint);

    return (
        <div className="min-h-screen bg-brand-white dark:bg-brand-black transition-colors duration-500 relative overflow-hidden">
            <Head title="Tentang Kami - AFSTUDIO" />

            {/* Artistic Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] z-9999 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-brand-black">
                <div className="absolute inset-0 z-0">
                    {about?.image_path ? (
                        <div className="relative w-full h-full overflow-hidden">
                            <img
                                src={`/storage/${about.image_path}`}
                                alt="AF Studio About Hero"
                                className="w-full h-full object-cover scale-110 animate-slow-zoom opacity-60"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-brand-white dark:to-brand-black opacity-100 transition-colors duration-500"></div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-brand-black">
                            <div className="absolute inset-0 bg-linear-to-tr from-brand-red/20 via-transparent to-brand-gold/20 opacity-30"></div>
                        </div>
                    )}
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl pt-10">
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-brand-black/40 backdrop-blur-xl rounded-full border border-white/20 mb-5 animate-fade-in shadow-lg">
                        <CameraIcon className="w-3 h-3 text-brand-gold" />
                        <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Sejak 2019</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter italic mb-4 animate-fade-in-up drop-shadow-xl leading-[0.9]">
                        {about?.title || 'TENTANG AF STUDIO'}
                    </h1>

                    <div className="flex items-center justify-center gap-4 animate-fade-in delay-300">
                        <div className="h-px w-10 bg-linear-to-r from-transparent to-brand-gold"></div>
                        <p className="text-white/90 text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] italic">Merangkai Keunggulan</p>
                        <div className="h-px w-10 bg-linear-to-l from-transparent to-brand-gold"></div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce-subtle pointer-events-none">
                    <div className="w-px h-10 bg-linear-to-b from-brand-gold to-transparent opacity-50"></div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 md:py-20 px-6 max-w-5xl mx-auto relative">
                {/* Decorative Element */}
                <div className="absolute top-40 left-0 w-32 h-32 bg-brand-gold/5 blur-[70px] rounded-full animate-pulse"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-20">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-brand-red/10 dark:bg-brand-red/20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-all duration-500 border border-brand-red/20">
                                <BuildingOfficeIcon className="w-4 h-4 text-brand-red" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-red">Kisah Utama Kami</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-none italic transition-colors">
                            MENGABADIKAN <br /> <span className="text-brand-gold underline decoration-brand-red/20 underline-offset-8">MAHAKARYA</span> YANG TAK TERUCAP.
                        </h2>
                        <div className="w-16 h-px bg-brand-gold shadow-sm"></div>
                        <p className="text-brand-black/70 dark:text-brand-white/60 text-sm md:text-base leading-relaxed font-medium transition-colors max-w-2xl italic">
                            {about?.description || 'Kami bukan sekadar memotret gambar, kami menenun cerita di balik setiap bayangan dan cahaya.'}
                        </p>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 pt-0 lg:pt-8">
                        {[
                            { val: '05+', label: 'Tahun Visi', color: 'brand-gold', icon: SparklesIcon },
                            { val: '1.2K', label: 'Jiwa Terabadikan', color: 'brand-red', icon: CameraIcon }
                        ].map((stat, i) => (
                            <div key={i} className="relative group bg-white dark:bg-white/5 p-6 rounded-3xl border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-700 hover:shadow-xl hover:border-brand-gold/40">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color === 'brand-gold' ? 'brand-gold' : 'brand-red'}/5 blur-2xl -mr-12 -mt-12 group-hover:opacity-100 opacity-0 transition-opacity`}></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white mb-1 italic tracking-tighter transition-colors">{stat.val}</div>
                                        <div className="text-[8px] uppercase font-black tracking-[0.3em] text-brand-black/40 dark:text-brand-white/40 transition-colors">{stat.label}</div>
                                    </div>
                                    <stat.icon className={`w-7 h-7 text-${stat.color} opacity-20 group-hover:opacity-100 transition-all duration-700`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visi Misi Section */}
                {(about?.vision || about?.mission) && (
                    <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-10 relative items-center">
                        <div className="space-y-5 p-8 bg-brand-black rounded-3xl relative overflow-hidden group shadow-xl">
                            <div className="absolute top-0 right-0 text-5xl font-black text-white/5 italic -mr-4 -mt-4 select-none uppercase">Vision</div>
                            <h3 className="text-[9px] font-black text-brand-red uppercase tracking-[0.4em] relative z-10">Visi / Perspektif</h3>
                            <p className="text-lg md:text-xl font-black text-white italic leading-tight relative z-10">
                                "{about.vision}"
                            </p>
                        </div>

                        <div className="space-y-5 p-4 lg:pl-8">
                            <h3 className="text-[9px] font-black text-brand-gold uppercase tracking-[0.4em]">Misi / Eksekusi</h3>
                            <div className="text-sm md:text-base font-bold text-brand-black/70 dark:text-brand-white/60 leading-relaxed whitespace-pre-line border-l-3 border-brand-red pl-6 transition-colors">
                                {about.mission}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quality Pillars / DNA Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {[
                        { title: 'Kreativitas Tanpa Batas', desc: 'Mengeksplorasi perspektif baru dalam setiap bingkai foto.', icon: BoltIcon, color: 'text-brand-gold' },
                        { title: 'Kualitas Premium', desc: 'Dedikasi tinggi pada detail teknis dan hasil akhir yang sempurna.', icon: ShieldCheckIcon, color: 'text-brand-red' },
                        { title: 'Sentuhan Personal', desc: 'Membangun koneksi untuk menangkap ekspresi yang paling jujur.', icon: HeartIcon, color: 'text-brand-gold' },
                        { title: 'Kolaborasi Tim', desc: 'Sinergi visi antara kami dan Anda untuk hasil mahakarya.', icon: UserGroupIcon, color: 'text-brand-red' }
                    ].map((pillar, i) => (
                        <div key={i} className="group p-8 bg-white dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 hover:border-brand-gold/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <pillar.icon className={`w-10 h-10 ${pillar.color} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`} />
                            <h4 className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-wider mb-3 leading-tight">{pillar.title}</h4>
                            <p className="text-[11px] text-brand-black/40 dark:text-brand-white/40 font-medium leading-relaxed">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Moodboard Section - Full Width Infinite Scroll */}
            {moodboards.length > 0 && (
                <section className="py-16 md:py-24 overflow-hidden relative bg-brand-white dark:bg-brand-black transition-colors">
                    <div className="absolute top-0 right-10 text-[80px] lg:text-[150px] font-black text-brand-black/2 dark:text-brand-white/2 select-none pointer-events-none italic transition-colors uppercase">Legacy</div>

                    <div className="flex flex-col items-center text-center mb-12 px-6 relative z-10">
                        <div className="mb-6 h-12 w-px bg-linear-to-b from-transparent via-brand-gold to-transparent"></div>
                        <span className="text-brand-red text-[9px] font-black uppercase tracking-[0.6em] mb-4">Visual Essence</span>
                        <h2 className="text-4xl md:text-6xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter leading-none mb-4 transition-colors">
                            MOOD<span className="text-brand-gold italic">BOARD.</span>
                        </h2>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[8px] font-black uppercase tracking-[0.4em]">Eksplorasi Visi Lewat Lensa Kami</p>
                    </div>

                    {/* Infinite Moving Rails - Edge to Edge */}
                    <div className="relative group/moodboard">
                        {/* Navigation Icons Overlay */}
                        <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-linear-to-r from-brand-white dark:from-brand-black to-transparent z-20 pointer-events-none opacity-0 group-hover/moodboard:opacity-100 transition-opacity duration-700"></div>
                        <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-linear-to-l from-brand-white dark:from-brand-black to-transparent z-20 pointer-events-none opacity-0 group-hover/moodboard:opacity-100 transition-opacity duration-700"></div>

                        <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover/moodboard:opacity-100 transition-all duration-700 translate-x-4 group-hover/moodboard:translate-x-0">
                            <button className="p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-black dark:text-brand-white hover:bg-brand-gold hover:text-brand-black transition-all shadow-2xl">
                                <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover/moodboard:opacity-100 transition-all duration-700 -translate-x-4 group-hover/moodboard:translate-x-0">
                            <button className="p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-black dark:text-brand-white hover:bg-brand-gold hover:text-brand-black transition-all shadow-2xl">
                                <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4 overflow-hidden relative">
                                <div className="flex gap-4 animate-marquee-slow hover:pause cursor-default w-max">
                                    {[...row1, ...row1].map((mb, idx) => (
                                        <div
                                            key={`${mb.id}-r1-${idx}`}
                                            className="min-w-[110px] md:min-w-[200px] aspect-4/5 rounded-3xl overflow-hidden relative group shadow-2xl border border-black/5 dark:border-white/10"
                                        >
                                            <img
                                                src={`/storage/${mb.image_path}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                                                alt={mb.title}
                                            />
                                            <div
                                                onClick={() => setPreviewImage(mb)}
                                                className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer flex flex-col justify-end h-full"
                                            >
                                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                                    <h4 className="text-white text-lg font-black uppercase tracking-tight italic mb-2">{mb.title || 'Perspective'}</h4>
                                                    <span className="text-brand-gold text-[9px] font-black uppercase tracking-[0.4em]">Lihat Detail</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 overflow-hidden relative">
                                <div className="flex gap-4 animate-marquee-reverse hover:pause cursor-default w-max">
                                    {[...row2, ...row2].map((mb, idx) => (
                                        <div
                                            key={`${mb.id}-r2-${idx}`}
                                            className="min-w-[110px] md:min-w-[200px] aspect-4/5 rounded-3xl overflow-hidden relative group shadow-2xl border border-black/5 dark:border-white/10"
                                        >
                                            <img
                                                src={`/storage/${mb.image_path}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                                                alt={mb.title}
                                            />
                                            <div
                                                onClick={() => setPreviewImage(mb)}
                                                className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer flex flex-col justify-end h-full"
                                            >
                                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                                    <h4 className="text-white text-lg font-black uppercase tracking-tight italic mb-2">{mb.title || 'Legacy'}</h4>
                                                    <span className="text-brand-gold text-[9px] font-black uppercase tracking-[0.4em]">Lihat Detail</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact & Map Section */}
            <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto relative">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-linear-to-r from-brand-red/10 to-brand-gold/10 rounded-3xl blur-[80px] opacity-20 animate-pulse"></div>
                    <div className="bg-brand-black dark:bg-white/5 text-white p-6 md:p-10 rounded-3xl relative overflow-hidden group shadow-2xl border border-white/5 transition-all duration-500">
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/10 rounded-full">
                                    <span className="w-1 h-1 bg-brand-gold rounded-full animate-pulse"></span>
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/80">Available now</span>
                                </div>
                                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-[0.85] text-white">READY TO <br /><span className="text-brand-gold tracking-[-0.05em]">IMMOR-</span><br />TALIZE?</h3>
                                <p className="text-white/40 text-[9px] font-medium max-w-sm uppercase tracking-widest leading-relaxed">Mari ciptakan masa depan yang abadi.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { icon: EnvelopeIcon, label: 'Email Resmi', val: about?.email || 'studio@afstudio.com' },
                                    { icon: PhoneIcon, label: 'WhatsApp', val: '0851-3436-3956' },
                                ].map((c, i) => (
                                    <div key={i} className={`flex items-center gap-4 group/link bg-white/5 p-4 md:p-5 rounded-xl border border-white/5 hover:border-brand-gold transition-all duration-500 cursor-pointer relative shadow-lg`}>
                                        <div className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover/link:bg-brand-gold group-hover/link:text-brand-black transition-all duration-500`}>
                                            <c.icon className="w-4 h-4" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-[8px] uppercase font-black tracking-[0.3em] text-white/30 mb-0.5">{c.label}</div>
                                            <div className="text-sm md:text-base font-black text-white truncate">{c.val}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Map */}
                <div className="relative group/map h-[200px] md:h-[300px] w-full rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xl transition-all duration-700 grayscale hover:grayscale-0">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15797.77169528612!2d113.8052148!3d-8.1583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd697669d0d5b43%3A0xc3f58992e59e38e1!2sAF%20STUDIO!5e0!3m2!1sid!2sid!4v1706500000000!5m2!1sid!2sid"
                        className="w-full h-full opacity-60 group-hover/map:opacity-100 transition-all duration-1000"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </section>

            {/* Cinematic Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-black/98 backdrop-blur-3xl" onClick={() => setPreviewImage(null)}></div>
                    <div className="relative w-full max-w-5xl h-[80vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-700 ease-out">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-12 right-0 p-3 bg-white/5 hover:bg-brand-red rounded-full text-brand-white transition-all z-20 group border border-white/10"
                        >
                            <XMarkIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                        <img
                            src={`/storage/${previewImage.image_path}`}
                            alt={previewImage.title}
                            className="max-w-full max-h-full object-contain relative z-10 shadow-3xl rounded-xl border border-white/5"
                        />
                        <div className="absolute -bottom-16 text-center space-y-2 z-20">
                            <h3 className="text-2xl md:text-3xl font-black text-brand-white uppercase tracking-tighter italic">
                                {previewImage.title || 'Karya Tanpa Judul'}
                            </h3>
                            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.6em]">AF STUDIO DIGITAL ARCHIVE</span>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1.1); }
                    100% { transform: scale(1.2); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 30s infinite alternate ease-in-out;
                }
                @keyframes marquee-slow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-slow {
                    animation: marquee-slow 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                @keyframes marquee-reverse {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee-reverse {
                    animation: marquee-reverse 40s linear infinite;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translate(-50%, 0); opacity: 0.3; }
                    50% { transform: translate(-50%, 10px); opacity: 0.6; }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2.5s infinite ease-in-out;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </div>
    );
}
