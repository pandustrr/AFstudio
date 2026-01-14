import React from 'react';

export default function TextInput({ type = 'text', className = '', isFocused = false, ...props }) {
    const input = React.useRef();

    React.useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-6 py-4 text-brand-black dark:text-brand-white focus:outline-none focus:border-brand-gold transition-all font-medium placeholder:text-brand-black/20 dark:placeholder:text-brand-white/20 ' +
                className
            }
            ref={input}
        />
    );
}
