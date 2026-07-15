export function speak(text, locale = 'nl-NL') {
  if (!('speechSynthesis' in window)) {
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopAudio() {
  window.speechSynthesis?.cancel();
}

