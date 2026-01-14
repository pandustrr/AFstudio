import React from 'react';

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center px-6 py-3 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-red/10 disabled:opacity-50 ` +
                className
            }
        >
            {children}
        </button>
    );
}
