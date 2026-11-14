import test from 'node:test';
import assert from 'node:assert/strict';
import { collectScreenText } from './screen-text.mjs';
import { createTranslator } from '../prototype/application/localization/translator.js';
import russian from '../prototype/locales/ru.js';
import kazakh from '../prototype/locales/kk.js';
import { createInitialState } from '../prototype/domain/demo/initial-state.js';
import { createStateStore } from '../prototype/application/state-store.js';
import { createMentoringService } from '../prototype/application/mentoring-service.js';
import {
  validateImportRows,
  demoImportRows,
  existingStaffEmails,
  getProgramStage,
} from '../prototype/domain/demo/records.js';

const createService = () =>
  createMentoringService({
    store: createStateStore({ load: createInitialState, save: () => {} }),
    now: () => '2026-11-05T10:00:00.000Z',
  });

test('every text on the new workspace screens is translated', () => {
  const translator = createTranslator({ ru: russian, kk: kazakh }, 'ru');
  for (const text of collectScreenText())
    for (const language of ['ru', 'kk']) {
      translator.setLanguage(language);
      assert.notEqual(translator.translate(text), text, `missing ${language}: ${text}`);
    }
});

test('meeting records need the other participant to confirm them', () => {
  const service = createService();
  assert.throws(
    () => service.saveRecord('meetings', { date: '', topic: 'x' }, 'Mentee'),
    /required/,
  );
  service.saveRecord(
    'meetings',
    { date: '2026-11-05', format: 'Online', topic: 'Plan', result: 'Agreed' },
    'Mentee',
  );
  assert.equal(service.getState().records.meetings[0].confirmed, false);
  service.confirmMeeting(0);
  assert.equal(service.getState().records.meetings[0].confirmed, true);
});

test('appointment respects the two-mentee limit unless the director approves', () => {
  const service = createService();
  assert.throws(
    () => service.appointMentor({ mentee: 'Alina K.', mentor: '1' }),
    /Director approval/,
  );
  service.appointMentor({ mentee: 'Alina K.', mentor: '1', approval: 'on' });
  assert.equal(service.getState().appointment.status, 'Pending');
  service.confirmAppointment();
  assert.equal(getProgramStage(service.getState()), 'Plan draft');
});

test('import preview flags missing fields, foreign emails and duplicates', () => {
  const rows = validateImportRows(demoImportRows, existingStaffEmails);
  assert.deepEqual(
    rows.map((row) => row.issue),
    [
      '',
      '',
      'Missing required field',
      'Invalid corporate email',
      'Duplicate record',
      'Duplicate record',
    ],
  );
  assert.equal(rows[0].line, 2);
});

test('the program closes only after both final reviews', () => {
  const service = createService();
  assert.throws(() => service.closeProgram(), /required/);
  service.saveFinal('self', { progress: 'Some progress' });
  service.saveFinal('review', { progress: 'Noticeable progress' });
  service.closeProgram();
  assert.equal(getProgramStage(service.getState()), 'Completed');
});
