export function ProgressBar({ value = 0, max = 100, label = 'Lesson progress' }) {
  const progress = document.createElement('progress');
  progress.className = 'progress-bar';
  progress.value = Math.min(Math.max(value, 0), max);
  progress.max = max;
  progress.setAttribute('aria-label', label);
  return progress;
}

