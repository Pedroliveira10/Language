import test from 'node:test';
import assert from 'node:assert/strict';
import { createNavigator, screens } from '../../src/app/navigation/index.js';

test('navigator changes screens and notifies subscribers', () => {
  const navigator = createNavigator();
  let event;
  navigator.subscribe((next) => { event = next; });
  navigator.go(screens.COURSE, { language: 'dutch' });
  assert.equal(navigator.current, screens.COURSE);
  assert.deepEqual(event, { screen: screens.COURSE, detail: { language: 'dutch' } });
});

test('navigator rejects unknown screens', () => {
  assert.throws(() => createNavigator().go('missing'), RangeError);
});

