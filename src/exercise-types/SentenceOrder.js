export function checkSentenceOrder(exercise, words) {
  return words.join(' ') === exercise.answer.join(' ');
}

export function SentenceOrder(exercise, onAnswer) {
  const container = document.createElement('div');
  const selection = [];
  exercise.words.forEach((word) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = word;
    button.addEventListener('click', () => {
      selection.push(word);
      button.disabled = true;
      if (selection.length === exercise.words.length) {
        onAnswer(checkSentenceOrder(exercise, selection));
      }
    });
    container.append(button);
  });
  return container;
}

