export function canSpeak(scope = globalThis) {
  return Boolean(scope.speechSynthesis && scope.SpeechSynthesisUtterance);
}

export function speakText(text, locale, rate = 1, scope = globalThis) {
  if (!canSpeak(scope)) return false;
  scope.speechSynthesis.cancel();
  const utterance = new scope.SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = rate;
  scope.speechSynthesis.speak(utterance);
  return true;
}

