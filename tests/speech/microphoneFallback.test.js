import test from 'node:test';
import assert from 'node:assert/strict';

import { MicrophoneButton } from '../../src/components/MicrophoneButton.js';

test('shows the required fallback when speech recognition is unavailable', () => {
  const markup = MicrophoneButton({ supported: false });

  assert.match(
    markup,
    /Speaking exercises are not supported by this browser\. Try Chrome or Edge on a device with microphone access\./
  );
  assert.doesNotMatch(markup, /data-speak-exercise/);
});

test('renders a click-to-start control when speech recognition is supported', () => {
  const markup = MicrophoneButton({ supported: true });

  assert.match(markup, /data-speak-exercise/);
  assert.match(markup, /Start speaking/);
  assert.match(markup, /data-listening-indicator/);
  assert.match(markup, /data-stop-speaking/);
  assert.match(markup, /Microphone is idle/);
});
