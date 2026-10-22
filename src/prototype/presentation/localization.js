import { html } from './components/html-template.js';
import russian from '../locales/ru.js';
import kazakh from '../locales/kk.js';
import { createTranslator } from '../application/localization/translator.js';
import { createLanguagePreferenceRepository } from '../infrastructure/language-preferences.js';
const preferenceRepository = createLanguagePreferenceRepository();
let currentLanguage = preferenceRepository.load();
const translator = createTranslator(
  {
    ru: russian,
    kk: kazakh,
  },
  currentLanguage,
);
const translate = translator.translate;
export { translate as t };
export const getLanguage = translator.getLanguage;
const sources = new WeakMap();
const ignore =
  '[data-no-translate],script,style,textarea,input,[name="skill"],#skill-description,.course-title';
function translateText(node) {
  if (node.parentElement?.closest(ignore)) return;
  const previous = sources.get(node);
  const source = previous && node.nodeValue === previous.last ? previous.source : node.nodeValue;
  const translated = translate(source);
  sources.set(node, {
    source,
    last: translated,
  });
  if (node.nodeValue !== translated) node.nodeValue = translated;
}
const attributes = new WeakMap();
export function localize(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) translateText(node);
  for (const el of root.querySelectorAll('[placeholder],[aria-label],[title],[alt]')) {
    if (el.closest('[data-no-translate]')) continue;
    let record = attributes.get(el) || {};
    for (const name of ['placeholder', 'aria-label', 'title', 'alt']) {
      if (!el.hasAttribute(name)) continue;
      const value = el.getAttribute(name),
        prior = record[name],
        source = prior && value === prior.last ? prior.source : value,
        last = translate(source);
      record[name] = {
        source,
        last,
      };
      if (last !== value) el.setAttribute(name, last);
    }
    attributes.set(el, record);
  }
  document.documentElement.lang = currentLanguage;
  for (const el of document.querySelectorAll('[data-language]')) {
    el.setAttribute('aria-pressed', String(el.dataset.language === currentLanguage));
    el.classList.toggle('active', el.dataset.language === currentLanguage);
  }
}
export function setLanguage(next) {
  if (!['en', 'ru', 'kk'].includes(next)) return;
  translator.setLanguage(next);
  currentLanguage = next;
  try {
    preferenceRepository.save(next);
  } catch {}
  localize();
  document.dispatchEvent(new Event('languagechange'));
}
export function languageSwitcher() {
  return html`
    <div class="language-switcher" role="group" aria-label="Language / Язык / Тіл">
      ${[
        ['en', 'EN', 'English'],
        ['kk', 'KZ', 'Қазақша'],
        ['ru', 'RU', 'Русский'],
      ]
        .map(
          ([code, label, title]) =>
            `<button type="button" data-language="${code}" lang="${code}" title="${title}" aria-pressed="${currentLanguage === code}" class="${currentLanguage === code ? 'active' : ''}">${label}</button>`,
        )
        .join('')}
    </div>
  `;
}
export function startLocalization() {
  localize();
  new MutationObserver((records) => {
    const roots = new Set();
    for (const record of records) {
      if (record.type === 'characterData') translateText(record.target);
      else
        for (const added of record.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) translateText(added);
          else if (added.nodeType === Node.ELEMENT_NODE) roots.add(added);
        }
    }
    for (const root of roots) localize(root);
  }).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-language]');
    if (button) setLanguage(button.dataset.language);
  });
}
