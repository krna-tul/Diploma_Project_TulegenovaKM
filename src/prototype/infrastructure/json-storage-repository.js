export function createJsonStorageRepository({ storage, key, createDefault, isValid = () => true }) {
  return {
    load() {
      try {
        const saved = JSON.parse(storage.getItem(key));
        return saved && isValid(saved) ? saved : createDefault();
      } catch {
        return createDefault();
      }
    },
    save(value) {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch {
        throw new Error('Browser storage is unavailable. Changes have not been saved.');
      }
    },
  };
}
