export function checkMultipleChoice(exercise, selected) {
  return selected === exercise.answer;
}

export function MultipleChoice(exercise, onAnswer) {
  const group = document.createElement('div');
  group.className = 'answer-options';
  exercise.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => onAnswer(checkMultipleChoice(exercise, option)));
    group.append(button);
  });
  return group;
}

