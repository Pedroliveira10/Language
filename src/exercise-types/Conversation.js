export function Conversation(exercise, onAnswer) {
  const container = document.createElement('div');
  container.className = 'conversation';
  exercise.turns.forEach(({ speaker, text }) => {
    const turn = document.createElement('p');
    turn.innerHTML = `<strong></strong> <span></span>`;
    turn.querySelector('strong').textContent = `${speaker}:`;
    turn.querySelector('span').textContent = text;
    container.append(turn);
  });
  const complete = document.createElement('button');
  complete.type = 'button';
  complete.textContent = 'Complete conversation';
  complete.addEventListener('click', () => onAnswer(true));
  container.append(complete);
  return container;
}

