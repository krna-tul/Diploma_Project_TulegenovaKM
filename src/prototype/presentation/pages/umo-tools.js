import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderInput,
  renderSelect,
  renderButton,
  escapeHtml,
  arrowIcon,
} from '../components/html.js';
import {
  referenceLists,
  demoArchive,
  seededAudit,
  analyticsBySchool,
  analyticsByArea,
} from '../../domain/demo/records.js';
import { formatTime } from './meetings.js';

const raw = (text) => `<span data-no-translate>${escapeHtml(text)}</span>`;

export function renderReferencesPage({ state }) {
  const added = state.records.references;
  return html`
    ${renderHeading('PROGRAM ADMINISTRATION / REFERENCE LISTS', 'Reference lists', 'Schools, development areas, meeting formats and change types used in the forms.')}
    <div class="reference-grid">
      ${Object.entries(referenceLists)
        .map(
          ([title, values]) => html`
            <div class="panel">
              <small>${title.toUpperCase()}</small>
              <ul class="reference-list">
                ${values.map((value) => `<li>${value}</li>`).join('')}
                ${added
                  .filter((item) => item.list === title)
                  .map((item) => `<li class="is-new">${raw(item.value)}</li>`)
                  .join('')}
              </ul>
            </div>
          `,
        )
        .join('')}
    </div>
    <form class="panel inline-form" data-form="record" data-kind="references">
      <small>ADD AN ENTRY</small>
      <div class="field-grid">
        ${renderSelect(
          'list',
          'List',
          Object.keys(referenceLists).map((title) => [title, title]),
          'Development areas',
        )}
        ${renderInput('value', 'New value')}
      </div>
      <div class="actions"><button type="submit">Add to the list${arrowIcon}</button></div>
    </form>
    <p class="demo-note">Changes to reference lists are recorded in the audit log.</p>
  `;
}

export function renderImportPage({ state, importPreview }) {
  const rows = importPreview || [];
  const valid = rows.filter((row) => row.valid).length;
  return html`
    ${renderHeading('PROGRAM ADMINISTRATION / IMPORT', 'Import staff list', 'Upload an XLSX file, review errors and duplicates, then import only the valid rows.')}
    <div class="panel import-drop">
      <img
        class="icon"
        src="assets/icons/download.png"
        alt=""
        aria-hidden="true"
        width="24"
        height="24"
      />
      <div>
        <h2>staff-2026-autumn.xlsx</h2>
        <p class="helper">Demo file: name, school and corporate email for each person</p>
      </div>
      ${renderButton('Check the file', 'import-preview')}
    </div>
    ${
      rows.length
        ? html`
            <div class="grid3">
              <div class="stats-card">
                <small>ROWS IN FILE</small>
                <strong>${String(rows.length).padStart(2, '0')}</strong>
              </div>
              <div class="stats-card">
                <small>READY TO IMPORT</small>
                <strong>${String(valid).padStart(2, '0')}</strong>
              </div>
              <div class="stats-card">
                <small>ERRORS AND DUPLICATES</small>
                <strong>${String(rows.length - valid).padStart(2, '0')}</strong>
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>LINE</th>
                    <th>NAME</th>
                    <th>SCHOOL</th>
                    <th>EMAIL</th>
                    <th>CHECK</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows
                    .map(
                      (row) =>
                        `<tr class="${row.valid ? '' : 'row-error'}"><td>${row.line}</td><td>${raw(row.name)}</td><td class="helper">${escapeHtml(row.school) || '—'}</td><td>${raw(row.email)}</td><td><span class="badge ${row.valid ? 'is-ok' : 'is-error'}">${row.valid ? 'Valid' : row.issue}</span></td></tr>`,
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
            <div class="row bottom-actions">
              <p class="helper">
                Rows with errors are skipped. Fix them in the file and import again.
              </p>
              ${renderButton('Import valid rows', 'import-apply')}
            </div>
          `
        : ''
    }
    ${state.imported.length ? `<p class="notification"><span>Last import</span>: ${state.imported.length}</p>` : ''}
  `;
}

export function renderArchivePage() {
  return html`
    ${renderHeading('PROGRAM ADMINISTRATION / ARCHIVE', 'Program archive', 'Completed programs are stored with restricted access. Every opening is logged.')}
    <div class="restricted-banner">
      <img
        class="icon"
        src="assets/icons/lock.png"
        alt=""
        aria-hidden="true"
        width="24"
        height="24"
      />
      <p>Opening an archived record adds an entry to the audit log.</p>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>RECORD</th>
            <th>PAIR</th>
            <th>SCHOOL</th>
            <th>ARCHIVED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${demoArchive
            .map(
              ([id, pair, school, date]) =>
                `<tr><td>${id}</td><td>${raw(pair)}</td><td class="helper">${school}</td><td>${date}</td><td>${renderButton('Open', 'open-archive', true, `data-id="${id}"`)}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function renderAnalyticsPage() {
  const max = Math.max(...analyticsByArea.map(([, count]) => count));
  const totals = analyticsBySchool.reduce(
    (sum, [, requests, active, completed]) => [
      sum[0] + requests,
      sum[1] + active,
      sum[2] + completed,
    ],
    [0, 0, 0],
  );
  return html`
    ${renderHeading('PROGRAM ADMINISTRATION / ANALYTICS', 'Program analytics', 'Aggregated figures only: request topics, forms of work and results, without personal details.')}
    <div class="grid3">
      <div class="stats-card">
        <small>REQUESTS</small>
        <strong>${totals[0]}</strong>
      </div>
      <div class="stats-card">
        <small>ACTIVE PAIRS</small>
        <strong>${totals[1]}</strong>
      </div>
      <div class="stats-card">
        <small>COMPLETED PROGRAMS</small>
        <strong>${String(totals[2]).padStart(2, '0')}</strong>
      </div>
    </div>
    <div class="columns record-columns">
      <div class="panel">
        <small>REQUEST TOPICS</small>
        <h2>Most requested support</h2>
        <div class="bar-list">
          ${analyticsByArea
            .map(
              ([area, count]) =>
                `<div class="bar-row"><span>${area}</span><span class="bar" style="--value:${count / max}"></span><strong>${count}</strong></div>`,
            )
            .join('')}
        </div>
      </div>
      <div class="panel">
        <small>BY SCHOOL</small>
        <h2>Participation</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SCHOOL</th>
                <th>REQUESTS</th>
                <th>ACTIVE</th>
                <th>COMPLETED</th>
              </tr>
            </thead>
            <tbody>
              ${analyticsBySchool
                .map(
                  ([school, requests, active, completed]) =>
                    `<tr><td>${school}</td><td>${requests}</td><td>${active}</td><td>${completed}</td></tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="blue row report-banner">
      <p>Confidential requests and meeting notes are never included in analytics.</p>
      ${renderButton('Export analytics', 'export-analytics')}
    </div>
  `;
}

export function renderAuditPage({ state }) {
  const entries = [
    ...state.audit
      .slice()
      .reverse()
      .map((entry) => [formatTime(entry.at), 'Demo user', raw(entry.action)]),
    ...seededAudit.map(([at, actor, action]) => [at, actor, escapeHtml(action)]),
  ];
  return html`
    ${renderHeading('PROGRAM ADMINISTRATION / AUDIT LOG', 'Audit log', 'Who did what and when. Entries cannot be edited or deleted.')}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TIME</th>
            <th>ROLE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          ${entries
            .map(
              ([at, actor, action]) =>
                `<tr><td>${escapeHtml(at)}</td><td class="helper">${escapeHtml(actor)}</td><td>${action}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
