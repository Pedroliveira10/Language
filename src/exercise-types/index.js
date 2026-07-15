import { Conversation } from './Conversation.js';
import { Listening } from './Listening.js';
import { ManualInput } from './ManualInput.js';
import { MultipleChoice } from './MultipleChoice.js';
import { SentenceOrder } from './SentenceOrder.js';

export const exerciseTypes = Object.freeze({
  'multiple-choice': MultipleChoice,
  'manual-input': ManualInput,
  'sentence-order': SentenceOrder,
  listening: Listening,
  conversation: Conversation
});

export function renderExercise(exercise, onAnswer) {
  const renderer = exerciseTypes[exercise.type];
  if (!renderer) throw new RangeError(`Unsupported exercise type: ${exercise.type}`);
  return renderer(exercise, onAnswer);
}
