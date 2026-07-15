export const languages = Object.freeze({
  dutch: { name: 'Dutch', locale: 'nl-NL' },
  polish: { name: 'Polish', locale: 'pl-PL' },
  'portuguese-pt': { name: 'European Portuguese', locale: 'pt-PT' }
});

export async function loadCurriculum(language) {
  if (!(language in languages)) {
    throw new RangeError(`Unsupported language: ${language}`);
  }
  const response = await fetch(new URL(`./${language}/curriculum.json`, import.meta.url));
  if (!response.ok) {
    throw new Error(`Could not load ${language} curriculum (${response.status})`);
  }
  return response.json();
}
