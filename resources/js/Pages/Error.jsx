import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ClockIcon, 
    ExclamationTriangleIcon, 
    NoSymbolIcon, 
    ServerStackIcon,
    ArrowPathIcon,
    HomeIcon
} from '@heroicons/react/24/outline';

export default function Error({ status, message }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
        419: 'Sesi Berakhir',
    }[status] || `Error ${status}`;

    const description = {
        503: 'Maaf, kami sedang melakukan pemeliharaan rutin. Silakan kembali lagi nanti.',
        500: 'Oops, terjadi kesalahan pada server kami. Tim kami sedang menanganinya.',
        404: 'Maaf, halaman yang Anda cari tidak dapat ditemukan.',
        403: 'Maaf, Anda tidak memiliki akses ke halaman ini.',
        419: 'Sesi Anda telah berakhir karena terlalu lama tidak ada aktivitas.',
    }[status] || message || 'Terjadi kesalahan yang tidak terduga.';

    const Icon = {
        503: ServerStackIcon,
        500: ServerStackIcon,
        404: ExclamationTriangleIcon,
        403: NoSymbolIcon,
        419: ClockIcon,
    }[status] || ExclamationTriangleIcon;

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden">
            <Head title={title} />
            
            {/* Background Ornaments */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full relative z-10 text-center">
                {/* Icon Container */}
                <div className="mb-8 relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-gold/20 to-brand-red/20 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-xl relative z-10">
                        <Icon className="w-12 h-12 text-brand-gold animate-pulse" />
                    </div>
                    <div className="absolute inset-0 bg-brand-gold/40 blur-2xl rounded-full opacity-50 animate-pulse"></div>
                </div>

                {/* Text Content */}
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
                    {title}
                </h1>
                <p className="text-white/60 font-medium leading-relaxed mb-10 px-4">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-brand-gold text-brand-black rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-gold/20 group"
                    >
                        <ArrowPathIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Muat Ulang Halaman
                    </button>
                    
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 text-white/50 border border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                        <HomeIcon className="w-5 h-5" />
                        Kembali ke Beranda
                    </Link>
                </div>

                {/* Footer branding */}
                <p className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                    AFSTUDIO &bull; Premium Photography
                </p>
            </div>
        </div>
    );
}
