import { html } from '../components/html-template.js';
const escapeHtml = (value) =>
  String(value ?? '').replace(
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
export { escapeHtml as esc };
export const input = (name, label, type = 'text', value = '', required = true) => html`
  <label class="field">
    ${escapeHtml(label)}${required ? ' *' : ''}
    <input
      name="${name}"
      type="${type}"
      value="${escapeHtml(value)}"
      ${required ? 'required' : ''}
      ${type === 'number' ? 'min="0"' : ''}
    />
  </label>
`;
export const textarea = (name, label, value = '', required = true) => html`
  <label class="field wide">
    ${escapeHtml(label)}${required ? ' *' : ''}
    <textarea name="${name}" ${required ? 'required' : ''}>${escapeHtml(value)}</textarea>
  </label>
`;
export const select = (name, label, options, value = '', required = true) => html`
  <label class="field">
    ${escapeHtml(label)}${required ? ' *' : ''}
    <select name="${name}" ${required ? 'required' : ''}>
      ${options.map(([optionValue, optionLabel]) => `<option value="${escapeHtml(optionValue)}" ${optionValue === value ? 'selected' : ''}>${escapeHtml(optionLabel)}</option>`).join('')}
    </select>
  </label>
`;
export const check = (name, label) => html`
  <label class="check">
    <input type="checkbox" name="${name}" />
    ${escapeHtml(label)}
  </label>
`;
export const hidden = (name, value) => html`
  <input type="hidden" name="${name}" value="${escapeHtml(value)}" />
`;
const renderButton = (action, id, text) => html`
  <button data-action="${action}" data-id="${escapeHtml(id)}">${escapeHtml(text)}</button>
`;
export { renderButton as btn };
export const form = (action, body, id = '', label = 'Сохранить') => html`
  <form data-action="${action}">
    ${hidden('id', id)}
    <div class="formgrid">${body}</div>
    <div class="formactions">
      <button class="primary" type="submit">${escapeHtml(label)}</button>
    </div>
  </form>
`;
export const detail = (title, body) => html`
  <details>
    <summary>${escapeHtml(title)}</summary>
    ${body}
  </details>
`;
export const date = (value) =>
  value
    ? new Date(value + 'T12:00:00').toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';
