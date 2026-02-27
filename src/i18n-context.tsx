import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TranslationKey, getTranslation } from './i18n';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    // Load saved language on mount
    useEffect(() => {
        const loadLang = async () => {
            try {
                if (window.gameVisionAPI?.getLanguage) {
                    const saved = await window.gameVisionAPI.getLanguage();
                    if (saved === 'ja' || saved === 'en') {
                        setLanguageState(saved);
                    }
                }
            } catch (e) {
                console.warn('Failed to load language setting:', e);
            }
        };
        loadLang();
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        // Persist to electron-store
        if (window.gameVisionAPI?.setLanguage) {
            window.gameVisionAPI.setLanguage(lang);
        }
    }, []);

    const t = useCallback((key: TranslationKey): string => {
        return getTranslation(language, key);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export function useT() {
    const { t } = useContext(LanguageContext);
    return t;
}
