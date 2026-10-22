import { queryElement } from './dom.js';
export function createPhotoObserver() {
  const source = {
    width: 1440,
    height: 1920,
    photoX: 630,
    photoY: 88,
    photoWidth: 810,
    photoHeight: 570,
  };
  return new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const width = target.clientWidth,
        height = target.clientHeight;
      const scale = Math.max(width / source.photoWidth, height / source.photoHeight);
      target.style.backgroundSize = `${source.width * scale}px ${source.height * scale}px`;
      target.style.backgroundPosition = `${-source.photoX * scale + (width - source.photoWidth * scale) / 2}px ${-source.photoY * scale + (height - source.photoHeight * scale) / 2}px`;
    }
  });
}
export function createNotifications(localize) {
  let timeout;
  return (message) => {
    const notice = queryElement('#notice');
    notice.textContent = message;
    localize(notice);
    notice.style.display = 'block';
    clearTimeout(timeout);
    timeout = setTimeout(() => (notice.style.display = 'none'), 5500);
  };
}
export function openDialog(markup) {
  queryElement('#dialog-body').innerHTML = markup;
  queryElement('#dialog').showModal();
}
export function closeDialog() {
  queryElement('#dialog').close();
}
