import React from 'react';

export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block text-[10px] uppercase font-black tracking-widest text-brand-black/60 dark:text-brand-white/60 ml-1 font-sans ` + className}>
            {value ? value : children}
        </label>
    );
}
