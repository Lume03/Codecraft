'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import es from '@/locales/es.json';
import en from '@/locales/en.json';

type Language = 'es' | 'en';

type Translations = typeof es;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations, params?: { [key: string]: string | number }) => string;
}

const translations: Record<Language, Translations> = { es, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // Try reading from cookie first, then localStorage
    const cookieLang = getCookie('language') as Language;
    if (cookieLang && (cookieLang === 'es' || cookieLang === 'en')) {
      setLanguageState(cookieLang);
      return;
    }

    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && (storedLang === 'es' || storedLang === 'en')) {
      setLanguageState(storedLang);
      setCookie('language', storedLang, 365); // Sync to cookie
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setCookie('language', lang, 365); // Set a cookie that expires in a year
    setLanguageState(lang);
  };

  const t = useCallback((key: keyof Translations, params?: { [key: string]: string | number }): string => {
    let translation = translations[language][key] || translations['es'][key] || String(key);
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{{${paramKey}}}`, String(params[paramKey]));
      });
    }

    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
