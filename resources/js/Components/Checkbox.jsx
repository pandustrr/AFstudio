import React from 'react';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-black/10 dark:border-white/10 text-brand-gold shadow-sm focus:ring-brand-gold bg-black/5 dark:bg-white/5 ' +
                className
            }
        />
    );
}
