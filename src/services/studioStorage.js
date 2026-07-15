export function readJson(key, fallback, storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(key);
    return raw === null || raw === undefined ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value, storage = globalThis.localStorage) {
  try {
    storage?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readText(key, fallback = null, storage = globalThis.localStorage) {
  try {
    return storage?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function backupStorageKey(key, storage = globalThis.localStorage) {
  const raw = readText(key, null, storage);
  if (raw === null) return null;
  const backupKey = `language-studio-backup-${key}`;
  if (readText(backupKey, null, storage) === null) storage?.setItem(backupKey, raw);
  return backupKey;
}

