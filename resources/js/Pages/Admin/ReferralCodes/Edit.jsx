import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeftIcon, TicketIcon, PercentBadgeIcon } from '@heroicons/react/24/outline';

export default function VoucherCodeEdit({ code }) {
    const { data, setData, put, processing, errors } = useForm({
        code: code.code,
        discount_type: code.discount_type,
        discount_value: code.discount_value,
        valid_from: code.valid_from,
        valid_until: code.valid_until,
        is_active: code.is_active,
        max_usage: code.max_usage || '',
    });

    const formatCurrency = (value) => {
        if (!value) return '';
        // If it's a number (from DB), convert to string first
        const strValue = typeof value === 'number' ? value.toString() : value;
        const number = strValue.replace(/[^0-9]/g, '');
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number).replace(/\s/g, ' ').replace('Rp', 'Rp.');
    };

    const handleDiscountValueChange = (e) => {
        const val = e.target.value;
        if (data.discount_type === 'fixed') {
            const numericValue = val.replace(/[^0-9]/g, '');
            setData('discount_value', numericValue);
        } else {
            setData('discount_value', val);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/referral-codes/${code.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Edit Voucher Code - ${code.code}`} />

            <div className="pt-8 lg:pt-16 pb-12 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/admin/referral-codes"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black/40 dark:text-brand-white/40 hover:text-brand-red transition-colors mb-8"
                    >
                        <ChevronLeftIcon className="w-4 h-4" /> Back to Voucher Codes
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white uppercase italic tracking-tighter flex items-center gap-3">
                            <TicketIcon className="w-10 h-10 text-brand-red" />
                            Edit Voucher Code
                        </h1>
                        <p className="text-sm text-brand-black/50 dark:text-brand-white/50 font-bold uppercase tracking-widest mt-2">
                            Update <span className="font-mono text-brand-red">{code.code}</span>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 shadow-xl space-y-6">
                        {/* Code (Read-only) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                <TicketIcon className="w-4 h-4" /> Code
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                disabled
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-brand-black/50 dark:text-brand-white/50 cursor-not-allowed uppercase"
                            />
                        </div>

                        {/* Discount Type and Value */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    <PercentBadgeIcon className="w-4 h-4" /> Discount Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.discount_type}
                                    onChange={e => {
                                        setData(prev => ({
                                            ...prev,
                                            discount_type: e.target.value,
                                            discount_value: ''
                                        }));
                                    }}
                                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (Rp)</option>
                                </select>
                                {errors.discount_type && <p className="text-red-500 text-xs font-bold">{errors.discount_type}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    Discount Value <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={data.discount_type === 'percentage' ? 'number' : 'text'}
                                        required
                                        step={data.discount_type === 'percentage' ? '0.01' : '1'}
                                        min="0.01"
                                        value={data.discount_type === 'fixed' ? formatCurrency(data.discount_value) : data.discount_value}
                                        onChange={handleDiscountValueChange}
                                        placeholder={data.discount_type === 'percentage' ? 'e.g., 20' : 'Rp. 50.000'}
                                        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                    />
                                </div>
                                {errors.discount_value && <p className="text-red-500 text-xs font-bold">{errors.discount_value}</p>}
                            </div>
                        </div>

                        {/* Valid From and Until */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    Valid From <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={data.valid_from}
                                    onChange={e => setData('valid_from', e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                />
                                {errors.valid_from && <p className="text-red-500 text-xs font-bold">{errors.valid_from}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    Valid Until <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={data.valid_until}
                                    onChange={e => setData('valid_until', e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                                />
                                {errors.valid_until && <p className="text-red-500 text-xs font-bold">{errors.valid_until}</p>}
                            </div>
                        </div>

                        {/* Max Usage */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                Max Usage (leave empty for unlimited)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={data.max_usage}
                                onChange={e => setData('max_usage', e.target.value)}
                                placeholder="e.g., 100"
                                className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-brand-gold focus:border-brand-gold transition-all text-brand-black dark:text-brand-white"
                            />
                            {errors.max_usage && <p className="text-red-500 text-xs font-bold">{errors.max_usage}</p>}
                        </div>

                        {/* Usage Info */}
                        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10">
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60 mb-1">
                                Current Usage
                            </p>
                            <p className="text-lg font-black text-brand-black dark:text-brand-white">
                                {code.usage_count} / {code.max_usage || '∞'}
                            </p>
                        </div>

                        {/* Is Active */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded border-black/10 dark:border-white/10 text-brand-gold"
                                />
                                <span className="text-xs font-black uppercase tracking-widest text-brand-black/70 dark:text-brand-white/70">
                                    Active
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 bg-brand-gold text-brand-black font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link
                                href="/admin/referral-codes"
                                className="flex-1 py-3 bg-black/5 dark:bg-white/5 text-brand-black dark:text-brand-white font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
