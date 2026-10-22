export function createLanguagePreferenceRepository(storageProvider = () => window.localStorage) {
  const key = 'aitu-language';
  return {
    load() {
      try {
        const saved = storageProvider().getItem(key);
        return ['en', 'ru', 'kk'].includes(saved) ? saved : 'en';
      } catch {
        return 'en';
      }
    },
    save(language) {
      storageProvider().setItem(key, language);
    },
  };
}
