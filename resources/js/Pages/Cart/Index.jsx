import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ConfirmModal from '@/Components/ConfirmModal';
import EditNotif from '@/Components/EditNotif';

export default function CartIndex({ carts, transactionHistory, uid }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [processingDelete, setProcessingDelete] = useState(false);
    const [showSuccessNotif, setShowSuccessNotif] = useState(false);

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
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmRemove = () => {
        if (!itemToDelete) return;

        setProcessingDelete(true);
        const uid = localStorage.getItem('afstudio_cart_uid');
        router.delete(`/cart/${itemToDelete}`, {
            headers: { 'X-Cart-UID': uid },
            data: { cart_uid: uid },
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessNotif(true);
            },
            onFinish: () => {
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
                setProcessingDelete(false);
            }
        });
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

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmRemove}
                title="Hapus Item"
                message="Yakin ingin menghapus paket ini dari keranjang belanja?"
                processing={processingDelete}
                variant="danger"
            />

            <EditNotif
                show={showSuccessNotif}
                onClose={() => setShowSuccessNotif(false)}
                message="Item berhasil dihapus dari keranjang"
                type="success"
                duration={2000}
            />
        </div>
    );
}
