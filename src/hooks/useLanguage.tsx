import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Language, t } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [language, setLang] = useState<Language>('en');

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('language').eq('id', user.id).maybeSingle()
      .then(({ data }) => {
        if (data?.language === 'hi' || data?.language === 'en') setLang(data.language as Language);
      });
  }, [user?.id]);

  const setLanguage = async (lang: Language) => {
    setLang(lang);
    if (user) {
      await supabase.from('profiles').update({ language: lang }).eq('id', user.id);
    }
  };

  const translate = (key: string) => t(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
