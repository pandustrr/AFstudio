import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function CartIndex({ carts, transactionHistory, uid }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [expandedTransaction, setExpandedTransaction] = useState(null);

    // Toggle check for a single item
    const toggleItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Toggle check for all items
    const toggleAll = () => {
        if (selectedItems.length === carts.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(carts.map(c => c.id));
        }
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        const uid = localStorage.getItem('afstudio_cart_uid');
        router.put(`/cart/${id}`, { quantity, cart_uid: uid }, {
            headers: { 'X-Cart-UID': uid },
            preserveScroll: true
        });
    };

    const removeItem = (id) => {
        if (confirm('Are you sure you want to remove this item?')) {
            const uid = localStorage.getItem('afstudio_cart_uid');
            router.delete(`/cart/${id}`, {
                headers: { 'X-Cart-UID': uid },
                data: { cart_uid: uid }, // Some servers need matching body
                preserveScroll: true
            });
        }
    };

    // Calculate total
    const total = carts
        .filter(c => selectedItems.includes(c.id))
        .reduce((sum, c) => sum + (parseFloat(c.package.price_numeric || 0) * c.quantity), 0);

    // Format currency
    const formatPrice = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    return (
        <div className="min-h-screen bg-brand-white dark:bg-brand-black transition-colors duration-300 pb-32">
            <Head title="Cart - AFSTUDIO" />
            <Navbar />

            <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-brand-black dark:text-brand-white mb-8 flex items-center gap-3">
                    <ShoppingBagIcon className="w-8 h-8 md:w-10 md:h-10 text-brand-red" />
                    Shopping Cart
                </h1>

                {/* Riwayat Transaksi Section - Always show if exists */}
                {transactionHistory && transactionHistory.length > 0 && (
                    <div className="mb-12 p-3 md:p-6 lg:p-8 bg-brand-gold/10 border-2 border-brand-gold/30 rounded-xl md:rounded-2xl">
                        <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-brand-black dark:text-brand-white mb-4 md:mb-6 flex items-center gap-2">
                            <span className="text-lg md:text-xl">📋</span>
                            <span>Riwayat Transaksi</span>
                        </h2>
                        <div className="space-y-2 md:space-y-3">
                            {transactionHistory.map((transaction) => (
                                <div key={transaction.id} className="p-3 md:p-4 bg-white dark:bg-white/5 rounded-lg md:rounded-xl border border-black/5 dark:border-white/5">
                                    <div className="flex flex-col gap-2">
                                        {/* Header - Booking Code & Status */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-xs md:text-sm text-brand-black dark:text-brand-white uppercase truncate">
                                                    Booking #{transaction.booking_code}
                                                </p>
                                                <p className="text-[8px] md:text-[9px] text-brand-black/60 dark:text-brand-white/60 mt-0.5">
                                                    {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <span className="text-[8px] md:text-[9px] font-black px-2 py-1 rounded-md whitespace-nowrap"
                                                style={{
                                                    backgroundColor: transaction.status === 'completed' ? '#10b981' : transaction.status === 'confirmed' ? '#3b82f6' : transaction.status === 'pending' ? '#f59e0b' : '#ef4444',
                                                    color: 'white'
                                                }}>
                                                {transaction.status === 'completed' ? 'SELESAI' : transaction.status === 'confirmed' ? 'KONFIRMASI' : transaction.status === 'pending' ? 'MENUNGGU' : 'BATAL'}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex justify-between items-center pt-2 border-t border-black/5 dark:border-white/5">
                                            <p className="text-[9px] md:text-[10px] text-brand-black/60 dark:text-brand-white/60 uppercase font-bold">Total:</p>
                                            <p className="font-bold text-brand-gold text-xs md:text-sm italic">
                                                {transaction.total_price?.toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0
                                                })}
                                            </p>
                                        </div>

                                        {/* Items - Horizontal scroll on mobile */}
                                        {transaction.items && transaction.items.length > 0 && (
                                            <div className="pt-2">
                                                <p className="text-[8px] md:text-[9px] text-brand-black/50 dark:text-brand-white/50 mb-1.5 uppercase font-bold">Items:</p>
                                                <div className="flex flex-wrap gap-1 md:gap-2">
                                                    {transaction.items.map((item) => (
                                                        <span key={item.id} className="text-[7px] md:text-[8px] px-1.5 md:px-2 py-0.5 md:py-1 bg-black/5 dark:bg-white/5 rounded text-brand-black dark:text-brand-white truncate">
                                                            {item.package?.name?.slice(0, 15)} x{item.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Detail Button */}
                                        <button
                                            onClick={() => setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id)}
                                            className="mt-2 w-full flex items-center justify-center gap-2 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-brand-red hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                                        >
                                            <span>{expandedTransaction === transaction.id ? 'Sembunyikan' : 'Lihat'} Detail</span>
                                            <ChevronDownIcon className={`w-3 h-3 transition-transform ${expandedTransaction === transaction.id ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Expandable Detail Section */}
                                        {expandedTransaction === transaction.id && (
                                            <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {/* Customer Info */}
                                                <div className="bg-black/5 dark:bg-white/5 p-2 md:p-3 rounded-lg">
                                                    <p className="text-[8px] md:text-[9px] font-black text-brand-black/60 dark:text-brand-white/60 uppercase mb-2">Informasi Customer</p>
                                                    <div className="space-y-1.5 text-[9px] md:text-[10px]">
                                                        <p><span className="font-bold">Nama:</span> {transaction.name}</p>
                                                        <p><span className="font-bold">No. HP:</span> {transaction.phone}</p>
                                                        {transaction.university && <p><span className="font-bold">Universitas:</span> {transaction.university}</p>}
                                                        {transaction.domicile && <p><span className="font-bold">Asal:</span> {transaction.domicile}</p>}
                                                    </div>
                                                </div>

                                                {/* Booking Details */}
                                                <div className="bg-black/5 dark:bg-white/5 p-2 md:p-3 rounded-lg">
                                                    <p className="text-[8px] md:text-[9px] font-black text-brand-black/60 dark:text-brand-white/60 uppercase mb-2">Detail Booking</p>
                                                    <div className="space-y-1.5 text-[9px] md:text-[10px]">
                                                        <p><span className="font-bold">Tanggal Booking:</span> {new Date(transaction.booking_date).toLocaleDateString('id-ID')}</p>
                                                        <p><span className="font-bold">Lokasi:</span> {transaction.location}</p>
                                                        {transaction.notes && <p><span className="font-bold">Catatan:</span> {transaction.notes}</p>}
                                                    </div>
                                                </div>

                                                {/* Items Details */}
                                                <div className="bg-black/5 dark:bg-white/5 p-2 md:p-3 rounded-lg">
                                                    <p className="text-[8px] md:text-[9px] font-black text-brand-black/60 dark:text-brand-white/60 uppercase mb-2">Item Details</p>
                                                    <div className="space-y-2">
                                                        {transaction.items?.map((item) => (
                                                            <div key={item.id} className="p-2 bg-white dark:bg-white/3 rounded border border-black/5 dark:border-white/10">
                                                                {/* Category Hierarchy */}
                                                                <div className="mb-1.5 pb-1.5 border-b border-black/5 dark:border-white/10">
                                                                    <p className="text-[8px] text-brand-black/50 dark:text-brand-white/50 uppercase font-bold tracking-tight mb-0.5">Kategori</p>
                                                                    <p className="text-[9px] md:text-[10px] font-bold text-brand-black dark:text-brand-white">
                                                                        {item.package?.sub_category?.category?.name || '-'}
                                                                    </p>
                                                                </div>

                                                                {/* Sub Category */}
                                                                <div className="mb-1.5 pb-1.5 border-b border-black/5 dark:border-white/10">
                                                                    <p className="text-[8px] text-brand-black/50 dark:text-brand-white/50 uppercase font-bold tracking-tight mb-0.5">Sub Kategori</p>
                                                                    <p className="text-[9px] md:text-[10px] font-bold text-brand-gold">
                                                                        {item.package?.sub_category?.name || '-'}
                                                                    </p>
                                                                </div>

                                                                {/* Package */}
                                                                <div className="mb-1.5 pb-1.5 border-b border-black/5 dark:border-white/10">
                                                                    <p className="text-[8px] text-brand-black/50 dark:text-brand-white/50 uppercase font-bold tracking-tight mb-0.5">Paket</p>
                                                                    <p className="text-[9px] md:text-[10px] font-bold text-brand-black dark:text-brand-white">
                                                                        {item.package?.name || '-'}
                                                                    </p>
                                                                </div>

                                                                {/* Package Description */}
                                                                {item.package?.description && (
                                                                    <div className="mb-1.5 pb-1.5 border-b border-black/5 dark:border-white/10">
                                                                        <p className="text-[8px] text-brand-black/50 dark:text-brand-white/50 uppercase font-bold tracking-tight mb-0.5">Deskripsi</p>
                                                                        <p className="text-[8px] md:text-[9px] text-brand-black/70 dark:text-brand-white/70 line-clamp-2">
                                                                            {item.package?.description}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {/* Pricing */}
                                                                <div className="flex justify-between items-end">
                                                                    <div>
                                                                        <p className="text-[8px] text-brand-black/50 dark:text-brand-white/50 uppercase font-bold">Harga/Unit</p>
                                                                        <p className="text-[9px] md:text-[10px] font-bold text-brand-black dark:text-brand-white">
                                                                            {item.package?.price_numeric?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-[8px] text-brand-black/50 dark:text-brand-white/50 uppercase font-bold">Qty: x{item.quantity}</p>
                                                                        <p className="text-[9px] md:text-[10px] font-bold text-brand-gold italic">
                                                                            {(item.package?.price_numeric * item.quantity)?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Payment Info */}
                                                <div className="bg-brand-gold/10 p-2 md:p-3 rounded-lg border border-brand-gold/30">
                                                    <p className="text-[8px] md:text-[9px] font-black text-brand-black/60 dark:text-brand-white/60 uppercase mb-2">Ringkasan Pembayaran</p>
                                                    <div className="space-y-1 text-[9px] md:text-[10px]">
                                                        <p className="flex justify-between"><span>Total Harga:</span> <span className="font-bold">{transaction.total_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span></p>
                                                        <p className="flex justify-between"><span>DP Terbayar:</span> <span className="font-bold text-brand-gold">{transaction.down_payment?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span></p>
                                                        <p className="flex justify-between border-t border-brand-gold/30 pt-1"><span>Sisa Pembayaran:</span> <span className="font-bold text-brand-red">{(transaction.total_price - transaction.down_payment)?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span></p>
                                                    </div>
                                                </div>

                                                {/* Download PDF Button - Show when confirmed */}
                                                {transaction.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => {
                                                            window.open(`/pdf/booking/${transaction.booking_code}`, '_blank');
                                                        }}
                                                        className="w-full py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white bg-brand-green hover:bg-brand-green/80 rounded-lg transition-colors"
                                                    >
                                                        📄 Lihat Preview & Download
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {carts.length === 0 ? (
                    <div className="text-center py-12 md:py-20 border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl md:rounded-3xl px-4">
                        <p className="text-brand-black/40 dark:text-brand-white/40 font-bold uppercase tracking-widest mb-4 text-xs md:text-sm">Your cart is empty.</p>
                        <Link href="/price-list" className="inline-block px-4 md:px-6 py-2 md:py-2.5 bg-brand-red text-white font-bold rounded-lg uppercase text-[10px] md:text-xs tracking-widest hover:bg-brand-gold hover:text-brand-black transition-colors">
                            Browse Packages
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Current Cart Items */}
                        {/* Header Row (Desktop) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-white dark:bg-white/5 rounded-t-2xl border-b border-black/5 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-brand-black/60 dark:text-brand-white/60">
                            <div className="col-span-6 flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                                    checked={selectedItems.length === carts.length && carts.length > 0}
                                    onChange={toggleAll}
                                />
                                <span>Product</span>
                            </div>
                            <div className="col-span-2 text-center">Unit Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-1 text-center">Total Price</div>
                            <div className="col-span-1 text-center">Actions</div>
                        </div>

                        {/* Cart Items */}
                        <div className="bg-white dark:bg-white/5 rounded-2xl md:rounded-t-none shadow-sm divide-y divide-black/5 dark:divide-white/5 overflow-hidden">
                            {carts.map((cart) => (
                                <div key={cart.id} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    {/* Mobile: Checkbox + Product Info */}
                                    <div className="md:col-span-6 flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            className="mt-1 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                                            checked={selectedItems.includes(cart.id)}
                                            onChange={() => toggleItem(cart.id)}
                                        />
                                        <div>
                                            <div className="inline-flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-brand-black text-white dark:bg-brand-gold dark:text-brand-black text-[8px] font-bold uppercase rounded-md tracking-wider">
                                                    Package
                                                </span>
                                            </div>
                                            <h3 className="text-sm md:text-base font-bold text-brand-black dark:text-brand-white uppercase leading-tight">
                                                {cart.package.name}
                                            </h3>
                                            <p className="text-xs text-brand-black/50 dark:text-brand-white/50">
                                                {cart.package.sub_category?.name} - {cart.package.sub_category?.category?.name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Unit Price */}
                                    <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                                        <span className="md:hidden text-xs text-brand-black/50 uppercase">Price</span>
                                        <span className="text-sm font-bold text-brand-black dark:text-brand-white">
                                            {formatPrice(cart.package.price_numeric)}
                                        </span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                                        <span className="md:hidden text-xs text-brand-black/50 uppercase">Qty</span>
                                        <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-black/20">
                                            <button
                                                onClick={() => updateQuantity(cart.id, cart.quantity - 1)}
                                                disabled={cart.quantity <= 1}
                                                className="p-1.5 md:p-2 text-brand-black/60 hover:text-brand-red disabled:opacity-30"
                                            >
                                                <MinusIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                            </button>
                                            <input
                                                type="text"
                                                value={cart.quantity}
                                                readOnly
                                                className="w-8 md:w-10 text-center border-none bg-transparent text-xs font-bold p-0 focus:ring-0 text-brand-black dark:text-brand-white"
                                            />
                                            <button
                                                onClick={() => updateQuantity(cart.id, cart.quantity + 1)}
                                                className="p-1.5 md:p-2 text-brand-black/60 hover:text-brand-green disabled:opacity-30"
                                            >
                                                <PlusIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal (Item) */}
                                    <div className="md:col-span-1 flex justify-between md:justify-center items-center md:hidden lg:flex">
                                        <span className="md:hidden text-xs text-brand-black/50 uppercase">Subtotal</span>
                                        <span className="text-sm font-black text-brand-gold italic">
                                            {formatPrice(cart.package.price_numeric * cart.quantity)}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="md:col-span-1 text-right md:text-center">
                                        <button
                                            onClick={() => removeItem(cart.id)}
                                            className="text-brand-red hover:text-red-600 transition-colors p-2"
                                            title="Remove Item"
                                        >
                                            <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sticky Footer */}
                        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-brand-black border-t border-black/5 dark:border-white/5 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] p-2 md:p-4 lg:p-6 z-40">
                            <div className="max-w-4xl mx-auto flex flex-col gap-2 md:gap-4">
                                {/* Mobile: Compact view */}
                                <div className="flex md:hidden items-center justify-between gap-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                                        checked={selectedItems.length === carts.length && carts.length > 0}
                                        onChange={toggleAll}
                                    />
                                    <div className="text-right flex-1">
                                        <p className="text-[9px] uppercase font-bold text-brand-black/60 dark:text-brand-white/60">
                                            Total ({selectedItems.length})
                                        </p>
                                        <p className="text-base font-black text-brand-red italic">
                                            {formatPrice(total)}
                                        </p>
                                    </div>
                                    <button
                                        disabled={selectedItems.length === 0}
                                        className="px-3 md:px-6 py-2 md:py-3 bg-brand-red text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg md:rounded-xl hover:bg-brand-gold hover:text-brand-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        onClick={() => {
                                            const uid = localStorage.getItem('afstudio_cart_uid');
                                            router.visit(uid ? `/checkout?uid=${uid}` : '/checkout');
                                        }}
                                    >
                                        Checkout
                                    </button>
                                </div>

                                {/* Desktop: Full view */}
                                <div className="hidden md:flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                                            checked={selectedItems.length === carts.length && carts.length > 0}
                                            onChange={toggleAll}
                                        />
                                        <span className="text-xs uppercase font-bold text-brand-black/60 dark:text-brand-white/60">
                                            Select All ({carts.length})
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-brand-black/60 dark:text-brand-white/60 mb-1">
                                                Total ({selectedItems.length} items)
                                            </p>
                                            <p className="text-xl md:text-2xl font-black text-brand-red italic">
                                                {formatPrice(total)}
                                            </p>
                                        </div>
                                        <button
                                            disabled={selectedItems.length === 0}
                                            className="px-8 py-3 bg-brand-red text-white text-xs md:text-sm font-black uppercase tracking-widest rounded-xl hover:bg-brand-gold hover:text-brand-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => {
                                                const uid = localStorage.getItem('afstudio_cart_uid');
                                                router.visit(uid ? `/checkout?uid=${uid}` : '/checkout');
                                            }}
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
