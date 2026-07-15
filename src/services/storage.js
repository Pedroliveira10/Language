export function loadJson(key, fallback = null, storage = globalThis.localStorage) {
  try {
    const value = storage?.getItem(key);
    return value === null || value === undefined ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function saveJson(key, value, storage = globalThis.localStorage) {
  try {
    storage?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key, storage = globalThis.localStorage) {
  storage?.removeItem(key);
}

