import { readFileSync } from 'node:fs';
import { createInitialState, withDefaults } from '../prototype/domain/demo/initial-state.js';
import { routes } from '../prototype/presentation/router.js';
import { renderSidebar, renderFooter } from '../prototype/presentation/pages/layout.js';
import { renderArchiveRecord } from '../prototype/presentation/components/dialogs.js';
import {
  validateImportRows,
  demoImportRows,
  existingStaffEmails,
} from '../prototype/domain/demo/records.js';

export const newScreens = [
  'status',
  'meetings',
  'observation',
  'interim',
  'changes',
  'confidential',
  'final',
  'appointment',
  'workload',
  'references',
  'import',
  'archive',
  'analytics',
  'audit',
  'notifications',
  'profile',
  'support',
  'tech',
  'tech-logs',
];
const roles = ['mentee', 'mentor', 'school', 'umo', 'tech'];

function filledState() {
  const state = withDefaults(createInitialState());
  const at = '2026-11-05T10:00:00.000Z';
  state.records.interim.push({ working: 'x', adjustments: 'y', at });
  for (const status of ['Submitted', 'Approved', 'Declined'])
    state.records.changes.push({ type: 'Program extension', reason: 'x', status, at });
  state.records.confidential.push({ topic: 'Discrimination', message: 'x', at });
  state.records.support.push({ category: 'Other', description: 'x', status: 'Open', at });
  state.imported = [{}];
  return state;
}

const stripHidden = (markup) =>
  markup
    .replace(/<(\w+)[^>]*data-no-translate[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<textarea[^>]*>[\s\S]*?<\/textarea>/g, '');

function textOf(markup) {
  const clean = stripHidden(markup);
  const texts = clean.split(/<[^>]+>/).map((part) =>
    part
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'"),
  );
  for (const [, value] of clean.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]*)"/g))
    texts.push(value);
  return texts;
}

const ignored = /^(?:·\s*)?(?:F-\d\d|ARC-\d{4}-\d{3}|INFO|WARN|ERROR|AK|[\w-]+\.xlsx)$/;
const meaningful = (text) => /[A-Za-z]{2}/.test(text) && !ignored.test(text);

function sourceMessages() {
  const files = [
    '../prototype/presentation/controllers/actions.js',
    '../prototype/domain/demo/records.js',
    '../prototype/application/mentoring-service.js',
  ];
  return files.flatMap((file) => {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    return [...source.matchAll(/(?:notify|new Error)\(\s*'([^']+)'/g)].map((match) => match[1]);
  });
}

export function collectScreenText() {
  const texts = [];
  for (const role of roles) {
    const page = () => 'status';
    for (const variant of [withDefaults(createInitialState()), filledState()]) {
      for (const name of newScreens)
        for (const finalTab of name === 'final' ? ['checklist', 'self', 'review'] : [undefined]) {
          const context = {
            state: variant,
            role,
            page,
            finalTab,
            importPreview: validateImportRows(demoImportRows, existingStaffEmails),
          };
          texts.push(...textOf(routes[name](context)));
        }
      variant.appointment = { status: 'Pending' };
      texts.push(...textOf(routes.appointment({ state: variant, role })));
      variant.final.closed = true;
      texts.push(...textOf(routes.final({ state: variant, role, finalTab: 'checklist' })));
    }
    texts.push(...textOf(renderSidebar({ role, page })));
  }
  texts.push(...textOf(renderFooter({})), ...textOf(renderArchiveRecord('ARC-2025-014')));
  texts.push(...sourceMessages());
  return [...new Set(texts.map((text) => text.trim().replace(/\s+/g, ' ')))].filter(meaningful);
}
