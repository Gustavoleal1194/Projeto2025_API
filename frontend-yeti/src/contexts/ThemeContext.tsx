import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
    mode: ThemeMode;
    toggle: () => void;
    setMode: (m: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
    mode: 'light',
    toggle: () => { },
    setMode: () => { }
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('yeti_theme_mode');
        return (saved === 'dark' || saved === 'light') ? (saved as ThemeMode) : 'light';
    });

    const applyToDocument = useCallback((m: ThemeMode) => {
        const root = document.documentElement;
        const body = document.body;
        if (m === 'dark') {
            root.classList.add('dark');
            body.classList.add('dark');
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        applyToDocument(mode);
        localStorage.setItem('yeti_theme_mode', mode);
    }, [mode, applyToDocument]);

    const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
    const toggle = useCallback(() => setModeState(prev => prev === 'dark' ? 'light' : 'dark'), []);

    const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle, setMode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
