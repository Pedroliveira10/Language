export function ExerciseCard({ title, prompt, children = [] }) {
  const card = document.createElement('section');
  card.className = 'exercise-card';

  const heading = document.createElement('h2');
  heading.textContent = title;
  const question = document.createElement('p');
  question.className = 'exercise-card__prompt';
  question.textContent = prompt;

  card.append(heading, question, ...children);
  return card;
}

