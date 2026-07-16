import test from 'node:test';
import assert from 'node:assert/strict';
import { compareSpeech, isSpeechRecognitionSupported, normalizeSpeech } from '../../src/services/speechRecognition.js';

test('speech normalization ignores punctuation, spacing, case and filler words', () => {
  assert.equal(normalizeSpeech('  Um, IK   woon in Duitsland! '), 'ik woon in duitsland');
});

test('speech comparison accepts the closest configured alternative', () => {
  const result = compareSpeech(
    'Ik woon momenteel in Duitsland',
    'Ik woon in Duitsland.',
    ['Ik woon momenteel in Duitsland.']
  );
  assert.equal(result.accepted, true);
  assert.equal(result.score, 100);
  assert.equal(result.expected, 'Ik woon momenteel in Duitsland.');
});

test('speech comparison reports missing and additional words', () => {
  const result = compareSpeech('Ik woon nu', 'Ik woon in Duitsland.', []);
  assert.ok(result.matching.includes('ik'));
  assert.ok(result.missing.includes('duitsland'));
  assert.ok(result.additional.includes('nu'));
  assert.ok(result.score < 80);
});

test('flexible question scoring accepts natural alternatives without exact model matching', () => {
  const result = compareSpeech('Prima', 'Het gaat goed.', ['Goed.', 'Prima.', 'Niet zo goed.'], { flexible: true, requiredConcepts: ['goed'] });
  assert.equal(result.accepted, true);
  assert.equal(result.score, 100);
});

test('support detection recognises prefixed browser implementation', () => {
  assert.equal(isSpeechRecognitionSupported({}), false);
  assert.equal(isSpeechRecognitionSupported({ webkitSpeechRecognition() {} }), true);
});
