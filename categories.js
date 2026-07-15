export function ExplanationBox({ text, tone = 'info' }) {
  const box = document.createElement('aside');
  box.className = `explanation-box explanation-box--${tone}`;
  box.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  box.textContent = text;
  return box;
}

