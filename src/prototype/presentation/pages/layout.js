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
  [/overview/i, 'home'],
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
  let items =
    role === 'school'
      ? [
          ['umo', 'School overview'],
          ['requests', 'Requests & assignments'],
          ['review', 'Plans for review'],
          ['changes', 'Program changes'],
          ['umo', 'School reports'],
        ]
      : role === 'umo'
        ? [
            ['umo', 'Program overview'],
            ['programs', 'Programs'],
            ['mentors', 'Mentor directory'],
            ['reports', 'Reports & exports'],
            ['archive', 'Archive'],
            ['settings', 'Program settings'],
          ]
        : role === 'mentor'
          ? [
              ['overview', 'Overview'],
              ['mentor-form', 'Mentor profile'],
              ['programs', 'My mentees'],
              ['plan', 'Development plans'],
              ['visit', 'Meetings & visits'],
              ['feedback', 'Feedback'],
            ]
          : [
              ['overview', 'Overview'],
              ['mentors', 'Find a mentor'],
              ['request', 'My request'],
              ['plan', 'Development plan'],
              ['visit', 'Meetings & visits'],
              ['feedback', 'Feedback'],
            ];
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
        <a href="#help">Support · Privacy · Guidelines</a>
        <a href="#demo">Demo workspaces</a>
      </div>
    </footer>
  `;
};
