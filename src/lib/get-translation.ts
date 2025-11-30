// lib/get-translation.ts
import 'server-only';
import { cookies } from 'next/headers';
import es from '@/locales/es.json';
import en from '@/locales/en.json';

type Language = 'es' | 'en';
type Translations = typeof es;

const translations: Record<Language, Translations> = { es, en };

export const getTranslation = () => {
  const cookieStore = cookies();
  const langCookie = cookieStore.get('language');
  const language: Language = langCookie?.value === 'en' ? 'en' : 'es';

  return (key: keyof Translations, params?: { [key: string]: string | number }): string => {
    let translation = translations[language][key] || translations['es'][key] || String(key);
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{{${paramKey}}}`, String(params[paramKey]));
      });
    }

    return translation;
  };
};
