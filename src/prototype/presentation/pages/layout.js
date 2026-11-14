import { html } from '../components/html-template.js';
import { languageSwitcher } from '../../i18n.js';
import { renderLink, renderIcon } from '../components/html.js';
export function renderHeader(viewContext, publicPage) {
  const { role } = viewContext;
  return html`
    <header>
      <a class="brand" href="#landing" aria-label="AITU Faculty Mentoring home">
        <span class="logo">
          <img class="symbol" src="assets/logo-symbol.svg" alt="" />
          <img class="wordmark" src="assets/logo-text.svg" alt="Astana IT University" />
        </span>
        <span class="brand-title">Faculty Mentoring</span>
      </a>
      ${
        publicPage
          ? `<div class="public-nav"><a href="#about">ABOUT THE PROGRAM</a><a href="#events">EVENTS</a><span class="language-wrap">${renderIcon('globe')}${languageSwitcher()}</span></div>`
          : `<div class="header-right"><span class="language-wrap">${renderIcon('globe')}${languageSwitcher()}</span><button data-action="notifications" class="notifications-button">${renderIcon('bell')}<span>Notifications</span></button><span class="avatar" title="Switch demo workspace">AK<select id="role" aria-label="Demo workspace">${[
              ['mentee', 'Mentee'],
              ['mentor', 'Mentor'],
              ['school', 'School coordinator'],
              ['umo', 'Program administrator'],
              ['tech', 'Technical administrator'],
            ]
              .map(
                ([value, label]) =>
                  `<option value="${value}" ${role === value ? 'selected' : ''}>${label}</option>`,
              )
              .join('')}</select></span></div>`
      }
    </header>
  `;
}
const sidebarIcons = [
  [/overview|system status/i, 'home'],
  [/program status/i, 'growth-chart'],
  [/journal/i, 'calendar-clock'],
  [/observation/i, 'observation'],
  [/interim/i, 'chat'],
  [/final|checklist/i, 'star'],
  [/confidential/i, 'lock'],
  [/change request/i, 'edit'],
  [/appointment/i, 'people'],
  [/workload/i, 'clock'],
  [/reference/i, 'filter'],
  [/import/i, 'download'],
  [/analytics/i, 'growth-chart'],
  [/audit|logs/i, 'eye'],
  [/profile/i, 'user'],
  [/support/i, 'help'],
  [/find a mentor|mentor directory/i, 'search'],
  [/request/i, 'document'],
  [/plans? for review/i, 'check-circle'],
  [/development plan/i, 'target'],
  [/meetings|visit/i, 'calendar'],
  [/feedback/i, 'chat'],
  [/mentor profile/i, 'user'],
  [/mentees/i, 'people'],
  [/changes/i, 'edit'],
  [/report|export/i, 'download'],
  [/archive/i, 'archive'],
  [/settings/i, 'settings'],
  [/programs/i, 'document'],
];
const sidebarIcon = (label) =>
  sidebarIcons.find(([pattern]) => pattern.test(label))?.[1] || 'document';
export function renderSidebar(viewContext) {
  const { role, page } = viewContext;
  const items = {
    school: [
      ['umo', 'School overview'],
      ['requests', 'Requests & assignments'],
      ['appointment', 'Mentor appointment'],
      ['workload', 'Mentor workload'],
      ['review', 'Plans for review'],
      ['changes', 'Program changes'],
      ['final', 'Final checklists'],
      ['umo', 'School reports'],
    ],
    umo: [
      ['umo', 'Program overview'],
      ['programs', 'Programs'],
      ['mentors', 'Mentor directory'],
      ['references', 'Reference lists'],
      ['import', 'Import staff list'],
      ['analytics', 'Analytics'],
      ['reports', 'Reports & exports'],
      ['archive', 'Archive'],
      ['audit', 'Audit log'],
      ['settings', 'Program settings'],
    ],
    tech: [
      ['tech', 'System status'],
      ['tech-logs', 'Technical logs'],
      ['support', 'Support requests'],
    ],
    mentor: [
      ['overview', 'Overview'],
      ['mentor-form', 'Mentor profile'],
      ['programs', 'My mentees'],
      ['plan', 'Development plans'],
      ['meetings', 'Meeting journal'],
      ['visit', 'Meetings & visits'],
      ['observation', 'Observation form'],
      ['interim', 'Interim feedback'],
      ['final', 'Final review'],
      ['workload', 'My workload'],
      ['changes', 'Change request'],
      ['confidential', 'Confidential request'],
      ['profile', 'Profile'],
    ],
    mentee: [
      ['overview', 'Overview'],
      ['status', 'Program status'],
      ['mentors', 'Find a mentor'],
      ['request', 'My request'],
      ['plan', 'Development plan'],
      ['meetings', 'Meeting journal'],
      ['visit', 'Meetings & visits'],
      ['interim', 'Interim feedback'],
      ['final', 'Final reflection'],
      ['changes', 'Change request'],
      ['confidential', 'Confidential request'],
      ['profile', 'Profile'],
    ],
  }[role];
  return html`
    <aside>
      <small>
        WORKSPACE /
        ${
          {
            mentee: 'MENTEE',
            mentor: 'MENTOR',
            school: 'SCHOOL COORDINATOR',
            umo: 'PROGRAM ADMINISTRATOR',
            tech: 'TECHNICAL ADMINISTRATOR',
          }[role]
        }
      </small>
      <nav aria-label="Workspace">
        ${items.map(([routeName, label]) => `<a href="#${routeName}" class="${page() === routeName ? 'active' : ''}">${renderIcon(sidebarIcon(label))}<span>${label}</span></a>`).join('')}
      </nav>
      <div class="sidebar-note">
        <h3>A space for growth.</h3>
        <p>
          Your conversations stay
          <br />
          confidential.
        </p>
      </div>
    </aside>
  `;
}
export const renderFooter = (viewContext) => {
  return html`
    <footer>
      <span>AITU Faculty Mentoring</span>
      <div class="link-row">
        <a href="#support">Technical support</a>
        <a href="#help">Support · Privacy · Guidelines</a>
        <a href="#demo">Demo workspaces</a>
      </div>
    </footer>
  `;
};
