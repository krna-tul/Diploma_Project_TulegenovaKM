export const SLIDER_BREAKPOINTS = { single: 760, double: 1100 };

export function getVisibleCount(viewportWidth) {
  if (viewportWidth <= SLIDER_BREAKPOINTS.single) return 1;
  if (viewportWidth <= SLIDER_BREAKPOINTS.double) return 2;
  return 3;
}

export function getSliderState({ index, total, visible }) {
  const maxIndex = Math.max(0, total - visible);
  const activeIndex = Math.min(Math.max(0, index), maxIndex);
  return {
    activeIndex,
    maxIndex,
    canGoPrev: activeIndex > 0,
    canGoNext: activeIndex < maxIndex,
    counter: total ? `${activeIndex + 1} / ${total}` : '0 / 0',
  };
}

export function parseDetails(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split('\n').map((line) => line.trim());
      if (lines.every((line) => line.startsWith('•')))
        return { type: 'list', items: lines.map((line) => line.replace(/^•\s*/, '')) };
      if (lines.length === 1 && chunk.length <= 60 && chunk.endsWith(':'))
        return { type: 'heading', text: chunk };
      return { type: 'paragraph', text: chunk };
    });
}
