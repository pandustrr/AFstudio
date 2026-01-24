import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function ReferralCodeIndex({ codes }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');

    const formatPrice = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    const filteredCodes = codes.data.filter(code =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this referral code?')) {
            router.delete(`/admin/referral-codes/${id}`, {
                onSuccess: () => alert('Referral code deleted successfully!'),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Referral Codes" />

            <div className="pt-16 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter">
                                Referral Codes
                            </h1>
                            <p className="text-sm text-brand-black/50 dark:text-brand-white/50 font-bold uppercase tracking-widest mt-2">
                                Manage promotional and referral codes
                            </p>
                        </div>
                        <Link
                            href="/admin/referral-codes/create"
                            className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-black rounded-xl uppercase text-xs tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all shadow-lg"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create Code
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-black/40 dark:text-brand-white/40" />
                            <input
                                type="text"
                                placeholder="Search by code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                            />
                        </div>
                    </div>

                    {/* Codes Table */}
                    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden">
                        {filteredCodes.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-brand-black/40 dark:text-brand-white/40 font-bold uppercase">No referral codes found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2">
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60">Code</th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60">Discount</th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60">Valid Period</th>
                                            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60">Usage</th>
                                            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60">Status</th>
                                            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCodes.map((code) => (
                                            <tr key={code.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono font-black text-brand-red text-sm">{code.code}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold">
                                                        {code.discount_type === 'percentage' ? `${code.discount_value}%` : formatPrice(code.discount_value)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-brand-black/60 dark:text-brand-white/60">
                                                        {code.valid_from} to {code.valid_until}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-xs font-bold">
                                                        {code.usage_count} / {code.max_usage || '∞'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {code.is_active ? (
                                                        <span className="flex items-center justify-center gap-1 text-green-600 font-black text-xs">
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-1 text-red-600 font-black text-xs">
                                                            <XCircleIcon className="w-4 h-4" />
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/admin/referral-codes/${code.id}/edit`}
                                                            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(code.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
