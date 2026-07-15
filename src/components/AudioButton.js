export function AudioButton({ label = 'Play pronunciation', onPlay }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'audio-button';
  button.setAttribute('aria-label', label);
  button.textContent = '🔊';
  button.addEventListener('click', onPlay);
  return button;
}

