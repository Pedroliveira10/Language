import { escapeHtml } from './studioMarkup.js';

export function MicrophoneButton({ supported, exerciseId }) {
  if (!supported) {
    return '<div class="notice warning" role="status">Speaking exercises are not supported by this browser. Try Chrome or Edge on a device with microphone access.</div>';
  }
  return `<button class="button microphone-button" type="button" data-speak-exercise="${escapeHtml(exerciseId)}" aria-label="Start microphone for speaking exercise">
    <span aria-hidden="true">🎙</span> Start speaking
  </button>`;
}

