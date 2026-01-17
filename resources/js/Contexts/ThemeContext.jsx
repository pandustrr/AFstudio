import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Detect context (admin vs public)
    const isAdmin = () => typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

    const [adminTheme, setAdminTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin-theme') || 'dark';
        }
        return 'dark';
    });

    const [publicTheme, setPublicTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    const currentTheme = isAdmin() ? adminTheme : publicTheme;

    // Apply theme to document
    const applyTheme = (themeValue) => {
        const root = window.document.documentElement;
        if (themeValue === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    // Initial and periodic sync based on routing
    useEffect(() => {
        applyTheme(currentTheme);

        // Listen for Inertia navigation to switch theme context if needed
        const unbind = router.on('finish', () => {
            applyTheme(isAdmin() ? adminTheme : publicTheme);
        });

        return () => unbind();
    }, [adminTheme, publicTheme]);

    const toggleTheme = () => {
        if (isAdmin()) {
            setAdminTheme(prev => {
                const next = prev === 'dark' ? 'light' : 'dark';
                localStorage.setItem('admin-theme', next);
                return next;
            });
        } else {
            setPublicTheme(prev => {
                const next = prev === 'dark' ? 'light' : 'dark';
                localStorage.setItem('theme', next);
                return next;
            });
        }
    };

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
