import { getFlagStrips, createSparkles } from './scene-progress.js';

const path = (file) => `assets/illustrations/${file}`;

export const illustratedScenes = {
  skyline: {
    base: 'hero-skyline-base.webp',
    animatedOnScroll: true,
    ratio: '2400 / 729',
    label: 'Illustrated Astana skyline',
    banks: [{ file: 'hero-skyline-bank.webp', side: 'left', left: 0, top: 25.103, width: 49.167 }],
    clouds: [
      {
        file: 'hero-skyline-cloud-1.webp',
        left: 0.708,
        top: 14.952,
        width: 16.917,
        drift: 7,
        duration: 46,
        delay: -6,
      },
      {
        file: 'hero-skyline-cloud-2.webp',
        left: 7.25,
        top: 29.63,
        width: 4.958,
        drift: 5,
        duration: 34,
        delay: -18,
      },
      {
        file: 'hero-skyline-cloud-3.webp',
        left: 25.917,
        top: 37.997,
        width: 18.667,
        drift: -6,
        duration: 58,
        delay: -11,
      },
      {
        file: 'hero-skyline-cloud-4.webp',
        left: 48.667,
        top: 43.896,
        width: 5.917,
        drift: 4,
        duration: 29,
        delay: -4,
      },
      {
        file: 'hero-skyline-cloud-5.webp',
        left: 71.375,
        top: 2.195,
        width: 11.375,
        drift: -8,
        duration: 52,
        delay: -22,
      },
    ],
  },
  campus: {
    base: 'campus-base.webp',
    animatedOnScroll: true,
    ratio: '2160 / 1059',
    label: 'Illustrated AITU campus',
    clouds: [
      {
        file: 'campus-cloud-1.webp',
        left: 63.611,
        top: 3.872,
        width: 28.009,
        drift: -6,
        duration: 54,
        delay: -9,
      },
      {
        file: 'campus-cloud-2.webp',
        left: 8.009,
        top: 13.692,
        width: 18.333,
        drift: 7,
        duration: 47,
        delay: -20,
      },
      {
        file: 'campus-cloud-3.webp',
        left: 27.593,
        top: 26.629,
        width: 13.333,
        drift: 5,
        duration: 38,
        delay: -3,
      },
    ],
    flag: {
      file: 'campus-flag-4.webp',
      left: 21.62,
      top: 26.629,
      width: 17.13,
      ratio: '370 / 295',
    },
  },
};

const renderBank = ({ file, side, left, top, width }) =>
  `<span class="scene-bank scene-bank-${side}" style="left:${left}%;top:${top}%;width:${width}%"><img src="${path(file)}" alt="" /></span>`;

const renderCloud = ({ file, left, top, width, drift, duration, delay }) =>
  `<img class="scene-cloud" src="${path(file)}" alt="" style="left:${left}%;top:${top}%;width:${width}%;--drift:${drift};--duration:${duration}s;--delay:${delay}s" />`;

const renderFlag = ({ file, left, top, width, ratio }) =>
  `<div class="scene-flag" style="left:${left}%;top:${top}%;width:${width}%;aspect-ratio:${ratio}">${getFlagStrips()
    .map(
      (strip, _, strips) =>
        `<span style="--i:${strip.index};left:${strip.left}%;width:calc(${100 / strips.length}% + 1px);background-image:url('${path(file)}');background-size:${strips.length * 100}% 100%;background-position:${strip.position}% 0"></span>`,
    )
    .join('')}</div>`;

export function renderIllustratedScene(name, className) {
  const scene = illustratedScenes[name];
  return `<div class="lp-illustration ${className} scene"${scene.animatedOnScroll ? ` data-scene="${name}"` : ''} role="img" aria-label="${scene.label}"><div class="scene-stage" style="aspect-ratio:${scene.ratio}"><img class="scene-base" src="${path(scene.base)}" alt="" />${scene.banks ? `<div class="scene-banks">${scene.banks.map(renderBank).join('')}</div>` : ''}<div class="scene-sky">${scene.clouds.map(renderCloud).join('')}</div>${scene.flag ? renderFlag(scene.flag) : ''}</div></div>`;
}

export const renderSparkles = (count, seed) =>
  `<div class="lp-sparkles" aria-hidden="true">${createSparkles(count, seed)
    .map(
      ({ left, top, size, depth, duration, delay, tone }) =>
        `<i class="sparkle sparkle-${tone}" style="left:${left}%;top:${top}%;--size:${size}px;--depth:${depth};--duration:${duration}s;--delay:${delay}s"><b></b></i>`,
    )
    .join('')}</div>`;
