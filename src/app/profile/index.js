export const defaultProfile = Object.freeze({
  enrolled: [],
  preferences: {
    theme: 'system',
    soundEnabled: true,
    dailyGoal: 10
  },
  stats: {
    sessions: 0,
    seconds: 0,
    studyDates: [],
    byLanguage: {}
  },
  achievements: {}
});

export function createProfile(saved = {}) {
  return {
    ...defaultProfile,
    ...saved,
    enrolled: [...(saved.enrolled || [])],
    preferences: { ...defaultProfile.preferences, ...saved.preferences },
    stats: {
      ...defaultProfile.stats,
      ...saved.stats,
      studyDates: [...(saved.stats?.studyDates || [])],
      byLanguage: { ...(saved.stats?.byLanguage || {}) }
    },
    achievements: { ...(saved.achievements || {}) }
  };
}

export function setEnrollment(profile, language, enrolled) {
  const courses = new Set(profile.enrolled);
  enrolled ? courses.add(language) : courses.delete(language);
  return { ...profile, enrolled: [...courses] };
}

export function recordStudySession(profile, { language, seconds = 0, date }) {
  const next = createProfile(profile);
  const studyDate = date || new Date().toISOString().slice(0, 10);
  const languageStats = next.stats.byLanguage[language] || { sessions: 0, seconds: 0 };

  next.enrolled = [...new Set([...next.enrolled, language])];
  next.stats.sessions += 1;
  next.stats.seconds += Math.max(0, seconds);
  next.stats.studyDates = [...new Set([...next.stats.studyDates, studyDate])];
  next.stats.byLanguage[language] = {
    sessions: languageStats.sessions + 1,
    seconds: languageStats.seconds + Math.max(0, seconds)
  };
  return next;
}

export const achievementRules = Object.freeze([
  { id: 'first-course', unlocked: ({ profile }) => profile.enrolled.length >= 1 },
  { id: 'first-module', unlocked: ({ completedModules }) => completedModules >= 1 },
  { id: 'getting-started', unlocked: ({ profile }) => profile.stats.sessions >= 3 },
  { id: 'three-courses', unlocked: ({ profile }) => profile.enrolled.length >= 3 },
  { id: 'three-days', unlocked: ({ profile }) => profile.stats.studyDates.length >= 3 },
  { id: 'half-hour', unlocked: ({ profile }) => profile.stats.seconds >= 1800 }
]);

export function awardAchievements(profile, completedModules = 0, now = new Date()) {
  const achievements = { ...profile.achievements };
  for (const rule of achievementRules) {
    if (!achievements[rule.id] && rule.unlocked({ profile, completedModules })) {
      achievements[rule.id] = now.toISOString();
    }
  }
  return { ...profile, achievements };
}

