const normalize = (value) => value.trim().toLocaleLowerCase().normalize('NFC');

export function checkManualInput(exercise, value) {
  const answers = Array.isArray(exercise.answer) ? exercise.answer : [exercise.answer];
  return answers.some((answer) => normalize(answer) === normalize(value));
}

export function ManualInput(exercise, onAnswer) {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.autocomplete = 'off';
  input.required = true;
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Check';
  form.append(input, submit);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onAnswer(checkManualInput(exercise, input.value));
  });
  return form;
}

