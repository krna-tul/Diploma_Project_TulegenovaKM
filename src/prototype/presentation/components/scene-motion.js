import { getSceneProgress } from './scene-progress.js';

const scenes = new Map();
let frame = 0;

const revealObserver =
  'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }),
        { threshold: 0.25 },
      )
    : null;

function write(scene, cache, name, value) {
  const text = value.toFixed(3);
  if (cache[name] === text) return;
  cache[name] = text;
  scene.style.setProperty(name, text);
}

function measure() {
  frame = 0;
  const viewport = window.innerHeight;
  for (const [scene, cache] of scenes) {
    if (!scene.isConnected) {
      scenes.delete(scene);
      continue;
    }
    const { top, height } = scene.getBoundingClientRect();
    if (top > viewport * 1.5 || top + height < -viewport * 0.5) continue;
    const { reveal, scroll } = getSceneProgress({ top, height, viewport });
    if (scene.dataset.scene === 'skyline') write(scene, cache, '--scroll', scroll);
    else write(scene, cache, '--reveal', reveal);
  }
}

function requestMeasure() {
  if (!frame) frame = requestAnimationFrame(measure);
}

export function mountScenes(root = document) {
  root.querySelectorAll('[data-scene]').forEach((scene) => {
    if (!scenes.has(scene)) scenes.set(scene, {});
  });
  root.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((element) => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('is-visible');
  });
  requestMeasure();
}

window.addEventListener('scroll', requestMeasure, { passive: true });
window.addEventListener('resize', requestMeasure);
