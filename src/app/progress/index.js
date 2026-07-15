export const emptyProgress = () => ({
  completedExercises: [],
  correctAnswers: 0,
  totalAnswers: 0,
  streak: 0,
  updatedAt: null
});

export function recordAnswer(progress, exerciseId, correct, now = new Date()) {
  const completed = new Set(progress.completedExercises || []);
  completed.add(exerciseId);
  return {
    ...progress,
    completedExercises: [...completed],
    correctAnswers: (progress.correctAnswers || 0) + Number(Boolean(correct)),
    totalAnswers: (progress.totalAnswers || 0) + 1,
    updatedAt: now.toISOString()
  };
}

export function accuracy(progress) {
  return progress.totalAnswers
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;
}

