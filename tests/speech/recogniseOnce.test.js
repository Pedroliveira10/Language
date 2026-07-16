import test from 'node:test';
import assert from 'node:assert/strict';

import { recogniseOnce, startRecognition } from '../../src/services/speechRecognition.js';

test('starts recognition with the requested locale and returns the transcript', async () => {
  let instance;
  class FakeRecognition {
    constructor() { instance = this; }
    start() {
      this.started = true;
      queueMicrotask(() => this.onresult({ results: [[{ transcript: 'Bom dia' }]] }));
    }
  }

  const transcript = await recogniseOnce('pt-PT', { SpeechRecognition: FakeRecognition });

  assert.equal(instance.lang, 'pt-PT');
  assert.equal(instance.started, true);
  assert.equal(instance.continuous, false);
  assert.equal(instance.interimResults, false);
  assert.equal(transcript, 'Bom dia');
});

test('turns a denied microphone event into a useful explanation', async () => {
  class DeniedRecognition {
    start() { queueMicrotask(() => this.onerror({ error: 'not-allowed' })); }
  }

  await assert.rejects(
    recogniseOnce('nl-NL', { webkitSpeechRecognition: DeniedRecognition }),
    /Microphone permission was denied\./
  );
});

test('rejects safely when speech recognition is unavailable', async () => {
  await assert.rejects(
    recogniseOnce('pl-PL', {}),
    /Speaking exercises are not supported by this browser\./
  );
});

test('an active recognition session can be stopped and settles immediately', async () => {
  let instance;
  class StoppableRecognition { constructor() { instance = this; } start() { this.started = true; } stop() { this.stopped = true; } }
  const session = startRecognition('nl-NL', { SpeechRecognition: StoppableRecognition });
  session.stop();
  await assert.rejects(session.promise, /Listening stopped/);
  assert.equal(instance.started, true);
  assert.equal(instance.stopped, true);
});
