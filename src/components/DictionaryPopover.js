export function DictionaryPopover({ term, definition }) {
  const details = document.createElement('details');
  details.className = 'dictionary-popover';
  const summary = document.createElement('summary');
  summary.textContent = term;
  const content = document.createElement('p');
  content.textContent = definition;
  details.append(summary, content);
  return details;
}

