import { html } from '../components/html-template.js';
import { escapeHtml, renderHeading, renderButton } from '../components/html.js';
export function renderProgramTable(viewContext) {
  const { getProgramSummaries } = viewContext;
  return html`
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>PROGRAM</th>
            <th>SCHOOL</th>
            <th>STATUS</th>
            <th>DOCUMENTS</th>
          </tr>
        </thead>
        <tbody>
          ${getProgramSummaries()
            .map(
              (program) =>
                `<tr><td>${escapeHtml(program.name)}</td><td class="helper">${program.school}</td><td><span class="badge">${escapeHtml(program.status)}</span></td><td>${program.docs}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
export function renderAdministrationPage(viewContext) {
  const { state } = viewContext;
  return html`
    ${renderHeading('UNIVERSITY WORKSPACE / PROGRAM ADMINISTRATION', 'A clear view of the program', 'Monitor participation, document completeness and progress across AITU.')}
    <div class="grid3">
      ${[
        ['ACTIVE PROGRAMS', 24 + (state.plan.status === 'Approved' ? 1 : 0)],
        ['AWAITING APPROVAL', 6 + (state.plan.status === 'Needs review' ? 1 : 0)],
        ['COMPLETED PROGRAMS', 18],
      ]
        .map(
          ([label, value]) =>
            `<div class="stats-card"><small>${label}</small><strong>${String(value).padStart(2, '0')}</strong></div>`,
        )
        .join('')}
    </div>
    <div class="section-heading">
      <h2>Programs requiring attention</h2>
      <a href="#programs">View all programs →</a>
    </div>
    ${renderProgramTable(viewContext)}
    <div class="blue row report-banner">
      <p>
        Reports include authorized program data. Confidential consultation details are excluded.
      </p>
      ${renderButton('Export report', 'export')}
    </div>
    <p class="demo-note">
      Illustrative prototype data · Export activity is recorded in the local audit log.
    </p>
  `;
}
