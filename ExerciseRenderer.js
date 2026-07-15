export const defaultSettings = Object.freeze({
  language: 'dutch',
  soundEnabled: true,
  reducedMotion: false,
  dailyGoal: 10
});

export function mergeSettings(saved = {}) {
  return { ...defaultSettings, ...saved };
}

