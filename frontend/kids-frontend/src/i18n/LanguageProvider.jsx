import { useState, useEffect, useMemo, useCallback } from 'react';
import { LanguageContext } from './language-context';
import { LANGUAGES, translations } from './translations';

const CODES = LANGUAGES.map((l) => l.code);

// اللغة المحفوظة، وإلا لغة المتصفح إن كانت مدعومة، وإلا الإنجليزية
function detectLanguage() {
  try {
    const saved = localStorage.getItem('lang');
    if (CODES.includes(saved)) return saved;
  } catch { /* تجاهل */ }
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return CODES.includes(browser) ? browser : 'en';
}

export default function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage);
  const meta = LANGUAGES.find((l) => l.code === lang);

  // اتجاه الصفحة (RTL للعربية) ولغتها وعنوان التبويب
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    document.title = translations[lang]['meta.title'];
  }, [lang, meta.dir]);

  const setLang = useCallback((code) => {
    if (!CODES.includes(code)) return;
    try { localStorage.setItem('lang', code); } catch { /* تجاهل */ }
    setLangState(code);
  }, []);

  const t = useCallback((key, vars) => {
    const text = translations[lang][key] ?? translations.en[key] ?? key;
    return vars ? text.replace(/\{(\w+)\}/g, (m, name) => (vars[name] ?? m)) : text;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, dir: meta.dir }), [lang, setLang, t, meta.dir]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
