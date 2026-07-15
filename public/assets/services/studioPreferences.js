import { readJson, writeJson } from './studioStorage.js';

export const SETTINGS_KEY = 'language-studio-settings-v2';
export const LEGACY_PROFILE_KEY = 'language-studio-local-profile-v1';

const defaults = Object.freeze({
  theme: 'system',
  soundEnabled: true,
  dailyGoal: 10,
  reducedMotion: false,
  enrolled: []
});

export function loadStudioPreferences(storage = globalThis.localStorage) {
  const legacy = readJson(LEGACY_PROFILE_KEY, {}, storage);
  const saved = readJson(SETTINGS_KEY, {}, storage);
  return {
    ...defaults,
    ...legacy.preferences,
    ...saved,
    enrolled: [...new Set(saved.enrolled || legacy.enrolled || [])]
  };
}

export function saveStudioPreferences(preferences, storage = globalThis.localStorage) {
  writeJson(SETTINGS_KEY, preferences, storage);
  const legacy = readJson(LEGACY_PROFILE_KEY, {}, storage);
  writeJson(LEGACY_PROFILE_KEY, {
    ...legacy,
    enrolled: [...preferences.enrolled],
    preferences: {
      ...legacy.preferences,
      theme: preferences.theme,
      soundEnabled: preferences.soundEnabled,
      dailyGoal: preferences.dailyGoal,
      reducedMotion: preferences.reducedMotion
    }
  }, storage);
}

export function setCourseEnrolled(preferences, language, enrolled) {
  const courses = new Set(preferences.enrolled);
  enrolled ? courses.add(language) : courses.delete(language);
  return { ...preferences, enrolled: [...courses] };
}

