import { getSliderState, getVisibleCount } from './slider-math.js';

const sliders = new Set();
const SWIPE_THRESHOLD = 40;

function visibleCards(slider) {
  return [...slider.querySelectorAll('.slider-card')].filter((card) => !card.hidden);
}

function update(slider) {
  const track = slider.querySelector('.slider-track');
  const cards = visibleCards(slider);
  const visible = getVisibleCount(window.innerWidth);
  const state = getSliderState({
    index: Number(slider.dataset.index || 0),
    total: cards.length,
    visible,
  });
  slider.dataset.index = String(state.activeIndex);
  track.style.setProperty('--slide-index', String(state.activeIndex));
  const offset = cards[state.activeIndex]?.offsetLeft ?? 0;
  track.style.setProperty('--slide-offset', `${-offset}px`);
  const prev = slider.querySelector('[data-slider-prev]');
  const next = slider.querySelector('[data-slider-next]');
  prev.disabled = !state.canGoPrev;
  next.disabled = !state.canGoNext;
  const [current, total] = state.counter.split(' / ');
  slider.querySelector('[data-slider-counter]').innerHTML =
    `<b>${current}</b><span class="slider-counter-total"> / ${total}</span>`;
  slider.querySelector('.slider-nav').hidden = cards.length <= visible;
}

function go(slider, step) {
  slider.dataset.index = String(Number(slider.dataset.index || 0) + step);
  update(slider);
}

function mount(slider) {
  if (slider.dataset.mounted) return update(slider);
  slider.dataset.mounted = 'true';
  sliders.add(slider);
  slider.querySelector('[data-slider-prev]').addEventListener('click', () => go(slider, -1));
  slider.querySelector('[data-slider-next]').addEventListener('click', () => go(slider, 1));
  slider.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowLeft') go(slider, -1);
    if (event.key === 'ArrowRight') go(slider, 1);
  });
  let startX = null;
  const viewport = slider.querySelector('.slider-viewport');
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') startX = event.clientX;
  });
  viewport.addEventListener('pointerup', (event) => {
    if (startX === null) return;
    const delta = event.clientX - startX;
    startX = null;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) go(slider, delta < 0 ? 1 : -1);
  });
  viewport.addEventListener('pointercancel', () => (startX = null));
  viewport.addEventListener('focusin', (event) => {
    const card = event.target.closest('.slider-card');
    const cards = visibleCards(slider);
    const position = cards.indexOf(card);
    const index = Number(slider.dataset.index || 0);
    const visible = getVisibleCount(window.innerWidth);
    if (position >= 0 && (position < index || position >= index + visible)) {
      slider.dataset.index = String(position < index ? position : position - visible + 1);
      viewport.scrollLeft = 0;
      update(slider);
    }
  });
  update(slider);
}

export function refreshCardSliders(root = document) {
  root.querySelectorAll('[data-slider]').forEach((slider) => {
    slider.dataset.index = '0';
    if (slider.dataset.mounted) update(slider);
  });
}

export function mountCardSliders(root = document) {
  for (const slider of sliders) if (!slider.isConnected) sliders.delete(slider);
  root.querySelectorAll('[data-slider]').forEach(mount);
}

let resizeFrame = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() =>
    sliders.forEach((slider) => slider.isConnected && update(slider)),
  );
});
