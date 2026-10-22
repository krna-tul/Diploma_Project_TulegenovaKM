import { getProgramSummaries } from '../domain/demo/programs.js';
function escapeCsvCell(value) {
  const text = String(value);
  const safeText = /^[=+@\-]/.test(text) ? `'${text}` : text;
  return '"' + safeText.replace(/"/g, '""') + '"';
}
export function buildProgramReportCsv(state) {
  const rows = [
    ['Program', 'School', 'Status', 'Documents'],
    ...getProgramSummaries(state).map((program) => [
      program.name,
      program.school,
      program.status,
      program.docs,
    ]),
  ];
  return '\uFEFF' + rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}
