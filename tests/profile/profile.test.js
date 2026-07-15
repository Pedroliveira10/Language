import test from 'node:test';
import assert from 'node:assert/strict';
import {
  awardAchievements,
  createProfile,
  recordStudySession,
  setEnrollment
} from '../../src/app/profile/index.js';

test('course enrolment is unique and removable', () => {
  let profile = createProfile();
  profile = setEnrollment(profile, 'dutch', true);
  profile = setEnrollment(profile, 'dutch', true);
  assert.deepEqual(profile.enrolled, ['dutch']);
  assert.deepEqual(setEnrollment(profile, 'dutch', false).enrolled, []);
});

test('study sessions update totals and enrol the course', () => {
  const profile = recordStudySession(createProfile(), {
    language: 'polish',
    seconds: 125,
    date: '2026-07-15'
  });
  assert.equal(profile.stats.sessions, 1);
  assert.equal(profile.stats.seconds, 125);
  assert.deepEqual(profile.stats.studyDates, ['2026-07-15']);
  assert.deepEqual(profile.enrolled, ['polish']);
  assert.deepEqual(profile.stats.byLanguage.polish, { sessions: 1, seconds: 125 });
});

test('achievements are awarded once with stable timestamps', () => {
  const now = new Date('2026-07-15T12:00:00.000Z');
  const profile = recordStudySession(createProfile(), {
    language: 'dutch',
    seconds: 10,
    date: '2026-07-15'
  });
  const awarded = awardAchievements(profile, 1, now);
  assert.equal(awarded.achievements['first-course'], now.toISOString());
  assert.equal(awarded.achievements['first-module'], now.toISOString());
  const later = awardAchievements(awarded, 1, new Date('2026-07-16T12:00:00.000Z'));
  assert.equal(later.achievements['first-course'], now.toISOString());
});

