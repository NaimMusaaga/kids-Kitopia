import { LANGUAGES } from '../i18n/translations';
import { useLanguage } from '../i18n/language-context';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ variant = 'light' }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className={`lang-switch ${variant}`} role="group" aria-label={t('lang.switch')}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          className={l.code === lang ? 'on' : ''}
          onClick={() => setLang(l.code)}
          aria-pressed={l.code === lang}
          aria-label={l.label}
          title={l.label}
          lang={l.code}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
