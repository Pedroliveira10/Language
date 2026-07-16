import { escapeHtml } from './studioMarkup.js';

export function MicrophoneButton({ supported, exerciseId }) {
  if (!supported) return '<div class="notice warning" role="status">Speaking exercises are not supported by this browser. Try Chrome or Edge on a device with microphone access.</div>';
  return `<div class="microphone-control" data-microphone-control="${escapeHtml(exerciseId)}">
    <button class="button microphone-button" type="button" data-speak-exercise="${escapeHtml(exerciseId)}" aria-label="Start microphone for speaking exercise"><span aria-hidden="true">Mic</span> <span data-microphone-label>Start speaking</span></button>
    <button class="button secondary" type="button" data-stop-speaking hidden>Stop</button>
    <span class="listening-indicator" data-listening-indicator hidden aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <span class="sr-only" data-microphone-status role="status" aria-live="polite">Microphone is idle</span>
  </div>`;
}
