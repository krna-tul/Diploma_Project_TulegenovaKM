const clamp = (value) => Math.min(1, Math.max(0, value));

export function getSceneProgress({ top, height, viewport }) {
  return {
    scroll: clamp((viewport - top) / (viewport + height)),
    reveal: clamp((viewport - top) / (viewport * 0.75)),
    leave: clamp(-top / Math.max(height, 1)),
  };
}

export const FLAG_STRIPS = 14;

export function getFlagStrips(count = FLAG_STRIPS) {
  return Array.from({ length: count }, (_, index) => ({
    index,
    left: (index / count) * 100,
    position: count > 1 ? (index / (count - 1)) * 100 : 0,
  }));
}

export function createSparkles(count, seed = 7) {
  let state = seed >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    left: Math.round(random() * 1000) / 10,
    top: Math.round(random() * 1000) / 10,
    size: Math.round(7 + random() * 11),
    depth: Math.round((0.2 + random() * 0.8) * 100) / 100,
    duration: Math.round((2.6 + random() * 3.4) * 10) / 10,
    delay: -Math.round(random() * 60) / 10,
    tone: random() < 0.55 ? 'blue' : 'white',
  }));
}
