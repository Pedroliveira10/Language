import { emptyProgress } from '../app/progress/index.js';
import { loadJson, saveJson } from './storage.js';

const key = (language) => `language-studio:progress:${language}`;

export function loadProgress(language) {
  return loadJson(key(language), emptyProgress());
}

export function saveProgress(language, progress) {
  return saveJson(key(language), progress);
}

