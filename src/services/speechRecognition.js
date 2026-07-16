const FILLER_WORDS = new Set(['um', 'uh', 'erm', 'hmm', 'eh', 'euh', 'ah']);

export function normalizeSpeech(value) {
  return String(value || '').toLocaleLowerCase().normalize('NFC').replace(/[.,!?;:()[\]{}"“”„'’]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter((word) => word && !FILLER_WORDS.has(word)).join(' ');
}

function editDistance(left, right) {
  const a = left.split(' ').filter(Boolean); const b = right.split(' ').filter(Boolean);
  const rows = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) rows[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) for (let j = 1; j <= b.length; j += 1) rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + Number(a[i - 1] !== b[j - 1]));
  return rows[a.length][b.length];
}

function wordComparison(expected, recognised) {
  const expectedWords = expected.split(' ').filter(Boolean); const remaining = recognised.split(' ').filter(Boolean); const matching = []; const missing = [];
  for (const word of expectedWords) { const index = remaining.indexOf(word); if (index >= 0) { matching.push(word); remaining.splice(index, 1); } else missing.push(word); }
  const incorrect = missing.slice(0, remaining.length).map((expectedWord, index) => ({ expected: expectedWord, recognised: remaining[index] }));
  return { matching, missing, incorrect, additional: remaining };
}

export function compareSpeech(recognisedText, expectedAnswer, acceptedAnswers = [], { flexible = false, requiredConcepts = [] } = {}) {
  const recognised = normalizeSpeech(recognisedText);
  const candidates = [expectedAnswer, ...acceptedAnswers].filter(Boolean).map((answer) => ({ original: answer, normalized: normalizeSpeech(answer) }));
  let best = candidates[0] || { original: '', normalized: '' }; let bestDistance = Infinity;
  for (const candidate of candidates) { const distance = editDistance(candidate.normalized, recognised); if (distance < bestDistance) { best = candidate; bestDistance = distance; } }
  const wordCount = Math.max(best.normalized.split(' ').filter(Boolean).length, recognised.split(' ').filter(Boolean).length, 1);
  const similarityScore = Math.max(0, Math.round((1 - bestDistance / wordCount) * 100));
  const concepts = requiredConcepts.map(normalizeSpeech).filter(Boolean); const conceptScore = concepts.length ? Math.round(concepts.filter((concept) => recognised.includes(concept)).length / concepts.length * 100) : 0;
  const exactAlternative = candidates.some((candidate) => candidate.normalized === recognised);
  const score = flexible ? Math.max(exactAlternative ? 100 : 0, Math.round(similarityScore * .6 + conceptScore * .4)) : similarityScore;
  return { expected: best.original, recognised: recognisedText, normalizedExpected: best.normalized, normalizedRecognised: recognised, score, accepted: flexible ? exactAlternative || score >= 65 : score >= 80, ...wordComparison(best.normalized, recognised) };
}

export function isSpeechRecognitionSupported(scope = globalThis) { return Boolean(scope.SpeechRecognition || scope.webkitSpeechRecognition); }

export function startRecognition(locale, scope = globalThis) {
  let recognition; let settled = false; let rejectPromise;
  const promise = new Promise((resolve, reject) => {
    rejectPromise = reject;
    const Recognition = scope.SpeechRecognition || scope.webkitSpeechRecognition;
    if (!Recognition) { settled = true; reject(new Error('Speaking exercises are not supported by this browser. Try Chrome or Edge on a device with microphone access.')); return; }
    recognition = new Recognition(); recognition.lang = locale; recognition.continuous = false; recognition.interimResults = false; recognition.maxAlternatives = 3;
    recognition.onresult = (event) => { settled = true; resolve(event.results?.[0]?.[0]?.transcript || ''); };
    recognition.onerror = (event) => { const message = ['not-allowed','service-not-allowed'].includes(event.error) ? 'Microphone permission was denied.' : event.error === 'no-speech' ? 'No speech was recognised. Please try again.' : 'Speech recognition could not complete. Please try again.'; settled = true; reject(new Error(message)); };
    recognition.onnomatch = () => { settled = true; reject(new Error('No speech was recognised. Please try again.')); };
    recognition.start();
  });
  return { promise, stop() { if (!settled) { settled = true; recognition?.stop?.(); rejectPromise?.(new Error('Listening stopped.')); } } };
}

export function recogniseOnce(locale, scope = globalThis) { return startRecognition(locale, scope).promise; }
