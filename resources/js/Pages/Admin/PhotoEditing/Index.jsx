import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import EditModal from './EditModal';
import ViewModal from './ViewModal';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';


export default function Index({ sessions, filters, options }) {
    const [viewSession, setViewSession] = useState(null);
    const [editSession, setEditSession] = useState(null);
    const [deleteSession, setDeleteSession] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const statuses = [
        { id: 'all', label: 'Semua', color: 'bg-black/5' },
        { id: 'pending', label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600' },
        { id: 'processing', label: 'Processing', color: 'bg-blue-500/10 text-blue-600' },
        { id: 'done', label: 'Done', color: 'bg-green-500/10 text-green-600' },
        { id: 'cancelled', label: 'Cancelled', color: 'bg-red-500/10 text-red-600' },
    ];

    const monthNames = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const prefix = window.location.pathname.startsWith('/editor') ? '/editor' : '/admin';

    const handleFilter = (type, value) => {
        const newFilters = { ...filters, [type]: value };

        if (type === 'year') {
            newFilters.month = '';
            newFilters.day = '';
            newFilters.status = 'all';
        } else if (type === 'month') {
            newFilters.day = '';
            newFilters.status = 'all';
        } else if (type === 'day') {
            newFilters.status = 'all';
        }

        router.get(`${prefix}/photo-editing`, newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const setToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        router.get(`${prefix}/photo-editing`, {
            ...filters,
            year: year.toString(),
            month: month.toString(),
            day: day.toString(),
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = () => {
        if (!deleteSession) return;

        setIsDeleting(true);
        router.delete(`${prefix}/photo-editing/${deleteSession.id}`, {
            onSuccess: () => {
                setDeleteSession(null);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Requests" />

            <div className="pt-12 lg:pt-20 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col gap-5 mb-6">
                    <div>
                        <h1 className="text-4xl font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-2">Daftar Request</h1>
                        <p className="text-brand-black/40 dark:text-brand-white/40 text-[10px] font-black uppercase tracking-widest">Kelola akses gallery dan request user.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Compact Date Filters */}
                        <div className="flex items-center gap-1 p-1.5 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 w-fit shadow-sm">
                            <div className="relative group">
                                <select
                                    value={filters.year || ''}
                                    onChange={(e) => handleFilter('year', e.target.value)}
                                    className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <option value="" className="bg-white dark:bg-brand-black">Tahun</option>
                                    {options.years.map((year) => (
                                        <option key={year} value={year} className="bg-white dark:bg-brand-black">{year}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                            </div>

                            <div className="w-px h-4 bg-black/10 dark:bg-white/10"></div>

                            <div className="relative group">
                                <select
                                    value={filters.month || ''}
                                    onChange={(e) => handleFilter('month', e.target.value)}
                                    disabled={!filters.year}
                                    className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                >
                                    <option value="" className="bg-white dark:bg-brand-black">Bulan</option>
                                    {options.months.map((month) => (
                                        <option key={month} value={month} className="bg-white dark:bg-brand-black">{monthNames[month]}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                            </div>

                            <div className="w-px h-4 bg-black/10 dark:bg-white/10"></div>

                            <div className="relative group">
                                <select
                                    value={filters.day || ''}
                                    onChange={(e) => handleFilter('day', e.target.value)}
                                    disabled={!filters.month}
                                    className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                                >
                                    <option value="" className="bg-white dark:bg-brand-black">Tgl</option>
                                    {options.days.map((day) => (
                                        <option key={day} value={day} className="bg-white dark:bg-brand-black">{day}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                            </div>
                        </div>

                        <button
                            onClick={setToday}
                            className="px-4 py-2 bg-brand-gold text-brand-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-brand-gold/90 transition-all shrink-0"
                        >
                            Hari Ini
                        </button>
                    </div>

                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                            <button
                                key={status.id}
                                onClick={() => handleFilter('status', status.id)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filters.status === status.id
                                    ? 'bg-brand-black text-white dark:bg-brand-gold dark:text-brand-black shadow-lg scale-105'
                                    : 'bg-black/5 dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40 hover:bg-black/10 dark:hover:bg-white/10'
                                    }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">UID / Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Tanggal</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Drive Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40">Progress</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr key={session.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-black text-brand-black dark:text-brand-white uppercase tracking-tighter mb-1">{session.customer_name}</div>
                                        <div className="text-[10px] font-mono text-brand-red font-black tracking-widest opacity-80">{session.uid}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-brand-black dark:text-brand-white">
                                            {(() => {
                                                const dObj = new Date(session.created_at);
                                                return dObj.toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                });
                                            })()}
                                        </div>
                                        <div className="text-[10px] font-mono text-brand-black/40 dark:text-brand-white/40 font-bold tracking-widest mt-1">
                                            {new Date(session.created_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }).replace('.', ':')} WIB
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${session.raw_folder_id ? 'bg-green-500' : 'bg-black/10 dark:bg-white/10'}`}></span>
                                                {session.raw_folder_id ? (
                                                    <a
                                                        href={session.raw_folder_id.startsWith('http') ? session.raw_folder_id : `https://drive.google.com/drive/folders/${session.raw_folder_id}`}
                                                        target="_blank"
                                                        className="text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white hover:text-brand-gold transition-all"
                                                    >
                                                        Mentahan: OPEN LINK
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/20 dark:text-brand-white/20">Mentahan: Belum diset</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${session.edited_folder_id ? 'bg-blue-500' : 'bg-black/10 dark:bg-white/10'}`}></span>
                                                {session.edited_folder_id ? (
                                                    <a
                                                        href={session.edited_folder_id.startsWith('http') ? session.edited_folder_id : `https://drive.google.com/drive/folders/${session.edited_folder_id}`}
                                                        target="_blank"
                                                        className="text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white hover:text-brand-gold transition-all"
                                                    >
                                                        Editing: OPEN LINK
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/20 dark:text-brand-white/20">Editing: Belum diset</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-block px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${session.status === 'done' ? 'bg-green-100 text-green-700' :
                                            session.status === 'processing' ? 'bg-brand-gold/20 text-brand-gold' :
                                                'bg-black/5 dark:bg-white/5 text-brand-black/40 dark:text-brand-white/40'
                                            }`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setViewSession(session)}
                                                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-brand-gold rounded-lg transition-all"
                                                title="Lihat Detail"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditSession(session)}
                                                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-brand-gold rounded-lg transition-all"
                                                title="Edit Request"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteSession(session)}
                                                className="p-3 bg-black/5 dark:bg-white/5 hover:bg-brand-red hover:text-white rounded-lg transition-all"
                                                title="Hapus"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {sessions.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-brand-black/40 dark:text-brand-white/40 text-xs font-bold uppercase tracking-widest">Tidak ada request ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* View Modal */}
                <ViewModal
                    session={viewSession}
                    onClose={() => setViewSession(null)}
                />

                {/* Modal Edit Section */}
                {
                    editSession && (
                        <EditModal
                            session={editSession}
                            onClose={() => setEditSession(null)}
                        />
                    )
                }

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    isOpen={!!deleteSession}
                    onClose={() => setDeleteSession(null)}
                    onConfirm={handleDelete}
                    processing={isDeleting}
                    title="Hapus Request"
                    message={`Apakah Anda yakin ingin menghapus request dari ${deleteSession?.customer_name}? Data foto dan seleksi akan ikut terhapus.`}
                />
            </div>
        </AdminLayout>
    );
}
