import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  scoreCourseRelevance as score,
  jaccardSimilarity as jac,
} from '../src/prototype/domain/matching/logistic-regression.js';
const model = JSON.parse(
  readFileSync(new URL('../src/prototype/matching/model.json', import.meta.url)),
);
const fixtures = JSON.parse(
  readFileSync(new URL('../research/matching/fixtures.json', import.meta.url)),
);
test('exported logistic regression reproduces 30 Python held-out predictions', () => {
  assert.equal(fixtures.length, 30);
  for (const f of fixtures) {
    const actual = score(
      model,
      {
        label: f.skill,
        vector: f.skillVector,
      },
      {
        title: f.title,
        content: f.content,
        titleVector: f.titleVector,
        contentVector: f.contentVector,
      },
    );
    actual.features.forEach((v, i) => assert.ok(Math.abs(v - f.features[i]) < 1e-12));
    assert.ok(Math.abs(actual.probability - f.probability) < 1e-12);
    assert.equal(actual.match, f.probability >= model.threshold);
  }
});
test('empty lexical overlap is finite and uses the learned model', () => {
  const actual = score(
    model,
    {
      label: '',
      vector: {},
    },
    {
      title: '',
      content: '',
      titleVector: {},
      contentVector: {},
    },
  );
  assert.deepEqual(actual.features, [0, 0, 0, 0, 0]);
  assert.ok(Number.isFinite(actual.probability));
  assert.equal(jac('', ''), 0);
});
