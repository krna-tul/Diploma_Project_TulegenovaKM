import { html } from './html-template.js';
export const escapeHtml = (text) =>
  String(text ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );
export const renderLink = (text, to, secondary = false) => html`
  <a class="button ${secondary ? 'secondary' : ''}" href="#${to}">${text}${arrowIcon}</a>
`;
export const renderButton = (text, action, secondary = false, extra = '') => html`
  <button type="button" class="${secondary ? 'secondary' : ''}" data-action="${action}" ${extra}>
    ${text}${arrowIcon}
  </button>
`;
export const renderInput = (name, label, value = '', type = 'text', required = true) => html`
  <label class="field">
    <span>${label}</span>
    <input
      name="${name}"
      type="${type}"
      value="${escapeHtml(value)}"
      ${type === 'search' ? `placeholder="${name === 'mentor-search' ? 'Search by name or expertise' : name === 'event-search' ? 'Search by skill or topic' : 'Type to search'}"` : ''}
      ${required ? 'required' : ''}
    />
  </label>
`;
export const renderTextarea = (name, label, value = '', required = true) => html`
  <label class="field">
    <span>${label}</span>
    <textarea name="${name}" ${required ? 'required' : ''}>${escapeHtml(value)}</textarea>
  </label>
`;
export const renderSelect = (name, label, options, value) => html`
  <label class="field">
    <span>${label}</span>
    <select name="${name}">
      ${options.map(([optionValue, optionLabel]) => `<option value="${escapeHtml(optionValue)}" ${String(value) === String(optionValue) ? 'selected' : ''}>${escapeHtml(optionLabel)}</option>`).join('')}
    </select>
  </label>
`;
export const renderHeading = (eyebrow, title, sub) => html`
  <div class="page-heading">
    <small>${eyebrow}</small>
    <h1>${title}</h1>
    <p class="subtitle">${sub}</p>
  </div>
`;
export const arrowIcon = '<span class="arrow" aria-hidden="true">→</span>';
