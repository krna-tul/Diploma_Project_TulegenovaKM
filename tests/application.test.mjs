import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../src/prototype/domain/demo/initial-state.js';
import { createStateStore } from '../src/prototype/application/state-store.js';
import { createMentoringService } from '../src/prototype/application/mentoring-service.js';
import { buildProgramReportCsv } from '../src/prototype/application/export-program-report.js';
import { createJsonStorageRepository } from '../src/prototype/infrastructure/json-storage-repository.js';
import { createModelRepository } from '../src/prototype/infrastructure/model-repository.js';
import { createTranslator } from '../src/prototype/application/localization/translator.js';
import russian from '../src/prototype/locales/ru.js';
import kazakh from '../src/prototype/locales/kk.js';
import { rankMentors } from '../src/prototype/domain/matching/rank-mentors.js';
function createService(save = () => {}) {
  const store = createStateStore({
    load: createInitialState,
    save,
  });
  return createMentoringService({
    store,
    now: () => '2026-10-22T00:00:00.000Z',
  });
}
test('failed persistence leaves the live state untouched', () => {
  const service = createService(() => {
    throw new Error('storage full');
  });
  const previous = service.getState();
  assert.throws(() => service.chooseMentor(2), /storage full/);
  assert.deepEqual(service.getState(), previous);
});
test('snapshots cannot mutate the application state', () => {
  const service = createService();
  const snapshot = service.getState();
  snapshot.plan.items.length = 0;
  assert.equal(service.getState().plan.items.length, 3);
});
test('plan review, required comment, and edit invalidate approval while preserving history', () => {
  const service = createService();
  service.submitPlan();
  assert.throws(() => service.reviewPlan('Returned for revision', '  '), /comment/);
  assert.equal(service.getState().plan.status, 'Needs review');
  service.reviewPlan('Approved', 'Ready');
  service.addActivity({
    task: 'New activity',
    note: 'A focus',
    date: '2026-11-20',
    result: 'Evidence',
  });
  const { plan } = service.getState();
  assert.equal(plan.status, 'Draft');
  assert.equal(plan.version, 2);
  assert.equal(plan.history[0].status, 'Approved');
  assert.equal(plan.history[0].items.length, 3);
  assert.equal(plan.items.length, 4);
});
test('invalid dates and decisions do not change state', () => {
  const service = createService();
  assert.throws(() =>
    service.addActivity({
      date: '2026-11-31',
    }),
  );
  service.submitPlan();
  assert.throws(() => service.reviewPlan('surprise', 'text'));
  assert.equal(service.getState().plan.status, 'Needs review');
});
test('reflection requires observation and timestamps are validated', () => {
  const service = createService();
  assert.throws(
    () =>
      service.saveVisit('reflection', {
        plus: 'Good',
      }),
    /observation/,
  );
  assert.throws(
    () =>
      service.saveVisit('observation', {
        timestamp: '10:99',
      }),
    /mm:ss/,
  );
  service.saveVisit('observation', {
    timestamp: '10:05',
    observation: 'PRIVATE NOTE',
  });
  service.saveVisit('reflection', {
    plus: 'PRIVATE REFLECTION',
  });
  const report = buildProgramReportCsv(service.getState());
  assert.ok(report.includes('Documents'));
  assert.ok(!report.includes('PRIVATE'));
});
test('existing browser state loads, malformed JSON falls back, and write errors propagate', () => {
  const existing = createInitialState();
  existing.request.goal = 'Existing draft';
  let saved = JSON.stringify(existing);
  const storage = {
    getItem: () => saved,
    setItem: (_, value) => {
      saved = value;
    },
  };
  const repository = createJsonStorageRepository({
    storage,
    key: 'same-key',
    createDefault: createInitialState,
  });
  assert.equal(repository.load().request.goal, 'Existing draft');
  saved = 'broken';
  assert.equal(repository.load().plan.status, 'Draft');
  storage.setItem = () => {
    throw new Error('quota');
  };
  assert.throws(() => repository.save(existing), /not been saved/);
});
test('ranking respects changed and unassigned course ownership', () => {
  const model = {
    skills: [
      {
        id: 1,
        label: 'teaching',
        vector: {
          0: 1,
        },
      },
    ],
    courses: [
      {
        id: 2,
        title: 'teaching',
        content: 'teaching',
        titleVector: {
          0: 1,
        },
        contentVector: {
          0: 1,
        },
        mentor: 0,
      },
    ],
    mean: [0, 0, 0, 0, 0],
    scale: [1, 1, 1, 1, 1],
    coef: [1, 1, 1, 1, 1],
    intercept: 0,
    threshold: 0.55,
  };
  const options = {
    mentors: [
      {
        name: 'A',
      },
      {
        name: 'B',
      },
    ],
    model,
    skillId: 1,
    assignments: {},
  };
  assert.equal(rankMentors(options)[0].id, 0);
  assert.equal(
    rankMentors({
      ...options,
      assignments: {
        2: 1,
      },
    })[0].id,
    1,
  );
  assert.ok(
    rankMentors({
      ...options,
      assignments: {
        2: -1,
      },
    }).every((mentor) => mentor.best === null),
  );
});
test('model repository rejects failed responses and invalid scaling', async () => {
  await assert.rejects(
    createModelRepository(async () => ({
      ok: false,
      status: 404,
    })).load(),
    /404/,
  );
  await assert.rejects(
    createModelRepository(async () => ({
      ok: true,
      json: async () => ({
        skills: [{}],
        courses: [{}],
        coef: [1, 1, 1, 1, 1],
        mean: [0, 0, 0, 0, 0],
        scale: [0, 1, 1, 1, 1],
        intercept: 0,
        threshold: 0.55,
      }),
    })).load(),
    /Invalid/,
  );
});
test('translator handles both languages, dynamic counts, and preserves source data', () => {
  const translator = createTranslator({
    ru: russian,
    kk: kazakh,
  });
  translator.setLanguage('ru');
  assert.equal(translator.translate('Save draft'), 'Сохранить черновик');
  assert.equal(translator.translate('3 mentors shown'), 'Показано наставников: 3');
  translator.setLanguage('kk');
  assert.equal(translator.translate('Save draft'), 'Жобаны сақтау');
  assert.equal(
    translator.translate('An unchanged UniSkill course title'),
    'An unchanged UniSkill course title',
  );
  translator.setLanguage('en');
  assert.equal(translator.translate('Save draft'), 'Save draft');
});
