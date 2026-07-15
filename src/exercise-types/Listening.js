import { speak } from '../services/audio.js';
import { ManualInput, checkManualInput } from './ManualInput.js';

export { checkManualInput as checkListening };

export function Listening(exercise, onAnswer) {
  const container = document.createElement('div');
  const play = document.createElement('button');
  play.type = 'button';
  play.textContent = 'Play audio';
  play.addEventListener('click', () => speak(exercise.audioText, exercise.locale));
  container.append(play, ManualInput(exercise, onAnswer));
  return container;
}

