import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getVisibleCount,
  getSliderState,
  parseDetails,
} from '../prototype/presentation/components/slider-math.js';
import { demoEvents } from '../prototype/domain/demo/catalog.js';
import russian from '../prototype/locales/ru.js';
import kazakh from '../prototype/locales/kk.js';

test('visible card count follows the 760 / 1100 px breakpoints', () => {
  assert.equal(getVisibleCount(375), 1);
  assert.equal(getVisibleCount(760), 1);
  assert.equal(getVisibleCount(761), 2);
  assert.equal(getVisibleCount(1100), 2);
  assert.equal(getVisibleCount(1440), 3);
});

test('slider index is clamped to the last full page', () => {
  assert.deepEqual(getSliderState({ index: 0, total: 4, visible: 3 }), {
    activeIndex: 0,
    maxIndex: 1,
    canGoPrev: false,
    canGoNext: true,
    counter: '1 / 4',
  });
  const end = getSliderState({ index: 5, total: 4, visible: 3 });
  assert.equal(end.activeIndex, 1);
  assert.equal(end.canGoNext, false);
  assert.equal(end.counter, '2 / 4');
  assert.equal(getSliderState({ index: 3, total: 4, visible: 1 }).activeIndex, 3);
  assert.equal(getSliderState({ index: 3, total: 4, visible: 3 }).activeIndex, 1);
  assert.equal(getSliderState({ index: -2, total: 4, visible: 1 }).activeIndex, 0);
  assert.equal(getSliderState({ index: 0, total: 0, visible: 3 }).counter, '0 / 0');
});

test('details text becomes paragraphs, subheadings and lists', () => {
  assert.deepEqual(
    parseDetails('Intro text.\n\nWhat you will do:\n\n• One\n• Two\n\nFormat: 60 minutes.'),
    [
      { type: 'paragraph', text: 'Intro text.' },
      { type: 'heading', text: 'What you will do:' },
      { type: 'list', items: ['One', 'Two'] },
      { type: 'paragraph', text: 'Format: 60 minutes.' },
    ],
  );
  assert.deepEqual(parseDetails(''), []);
});

test('every event has details and every detail line is translated', () => {
  assert.ok(demoEvents.length >= 4, 'the landing slider needs at least four cards');
  for (const event of demoEvents) {
    const blocks = parseDetails(event.details);
    assert.ok(blocks.length > 0, `${event.title} has no details`);
    const strings = blocks.flatMap((block) => block.items || [block.text]);
    const { card } = event;
    assert.ok(card?.preview, `${event.title} has no card preview`);
    strings.push(
      card.preview,
      ...(card.blocks || []).flatMap((block) => [block.title, block.text]),
      ...[card.emphasizedTitle, card.footerText, card.footerNotice, card.scheduleText].filter(
        Boolean,
      ),
      ...(card.bullets || []),
    );
    for (const text of [event.type, event.title, event.description, event.tags, ...strings]) {
      assert.ok(Object.hasOwn(russian, text), `missing Russian translation: ${text}`);
      assert.ok(Object.hasOwn(kazakh, text), `missing Kazakh translation: ${text}`);
    }
  }
});

test('scene progress runs from 0 below the viewport to 1 above it', async () => {
  const { getSceneProgress, getFlagStrips, FLAG_STRIPS, createSparkles } =
    await import('../prototype/presentation/components/scene-progress.js');
  assert.deepEqual(getSceneProgress({ top: 900, height: 400, viewport: 800 }), {
    scroll: 0,
    reveal: 0,
    leave: 0,
  });
  assert.equal(getSceneProgress({ top: 200, height: 400, viewport: 800 }).reveal, 1);
  assert.equal(getSceneProgress({ top: -500, height: 400, viewport: 800 }).scroll, 1);
  assert.equal(getSceneProgress({ top: 0, height: 400, viewport: 800 }).leave, 0);
  assert.equal(getSceneProgress({ top: -200, height: 400, viewport: 800 }).leave, 0.5);
  const strips = getFlagStrips();
  assert.equal(strips.length, FLAG_STRIPS);
  assert.equal(strips[0].left, 0);
  assert.equal(strips.at(-1).position, 100);
  const sparkles = createSparkles(20, 3);
  assert.deepEqual(sparkles, createSparkles(20, 3));
  assert.ok(sparkles.every((s) => s.left >= 0 && s.left <= 100 && s.depth > 0 && s.depth <= 1));
});
