import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderInput,
  renderTextarea,
  renderSelect,
  renderButton,
  escapeHtml,
  arrowIcon,
} from '../components/html.js';
import {
  programStages,
  getProgramStage,
  demoNotifications,
  integrations,
  deliveryErrors,
  technicalLogs,
} from '../../domain/demo/records.js';
import { formatTime } from './meetings.js';

export function renderStatusPage({ state }) {
  const current = getProgramStage(state);
  const index = programStages.findIndex(([stage]) => stage === current);
  return html`
    ${renderHeading('MY PROGRAM / STATUS', 'Program status', 'Every program moves through the same stages. Here is where yours is now.')}
    <div class="blue row status-banner">
      <div>
        <small>CURRENT STAGE</small>
        <h2>${current}</h2>
      </div>
      <span class="badge">${String(index + 1).padStart(2, '0')} / ${programStages.length}</span>
    </div>
    <ol class="status-timeline">
      ${programStages
        .map(
          ([stage, owner], position) =>
            `<li class="${position < index ? 'is-done' : position === index ? 'is-current' : ''}"><strong>${String(position + 1).padStart(2, '0')}</strong><span>${stage}</span><small>${owner}</small></li>`,
        )
        .join('')}
    </ol>
  `;
}

export function renderNotificationsPage({ state }) {
  const items = [
    ['Today', 'Request', state.request.status],
    ['Today', 'Plan', state.plan.status],
  ];
  return html`
    ${renderHeading('NOTIFICATIONS', 'Notifications', 'Reminders and status changes for your program.')}
    <div class="section-heading">
      <h2>Recent</h2>
      ${state.notificationsRead ? '' : renderButton('Mark all as read', 'read-notifications', true)}
    </div>
    <div class="notice-list">
      ${items
        .map(
          ([date, kind, status]) =>
            `<article class="notice-item ${state.notificationsRead ? '' : 'is-unread'}"><span class="badge">${kind}</span><p><span>${kind}</span>: <span>${escapeHtml(status)}</span></p><small>${date}</small></article>`,
        )
        .join('')}
      ${demoNotifications
        .map(
          ([date, kind, text]) =>
            `<article class="notice-item ${state.notificationsRead ? '' : 'is-unread'}"><span class="badge">${kind}</span><p>${text}</p><small>${date}</small></article>`,
        )
        .join('')}
    </div>
    <p class="demo-note">Notification channels can be changed in your profile.</p>
  `;
}

export function renderProfilePage({ state, role }) {
  const profile = state.profile;
  return html`
    ${renderHeading('MY ACCOUNT', 'Profile', 'Your details come from the HR system. You can change your contact preferences.')}
    <div class="columns record-columns">
      <div class="panel profile-card">
        <span class="profile-avatar">AK</span>
        <h2><span data-no-translate>${escapeHtml(profile.name)}</span></h2>
        <p>${escapeHtml(profile.position)}</p>
        <p class="helper">${escapeHtml(profile.school)}</p>
        <p class="helper"><span data-no-translate>${escapeHtml(profile.email)}</span></p>
        <small>DEMO ROLE</small>
        <p>
          ${{ mentee: 'Mentee', mentor: 'Mentor', school: 'School coordinator', umo: 'Program administrator', tech: 'Technical administrator' }[role]}
        </p>
      </div>
      <form class="panel" data-form="profile">
        <small>PREFERENCES</small>
        <h2>Contact preferences</h2>
        ${renderSelect(
          'channel',
          'Notification channel',
          [
            ['Email and in-app', 'Email and in-app'],
            ['In-app only', 'In-app only'],
          ],
          profile.channel,
        )}
        ${renderInput('phone', 'Office phone', profile.phone || '', 'tel', false)}
        <p class="helper">Name, position and School are updated through the HR system.</p>
        <div class="actions"><button type="submit">Save preferences${arrowIcon}</button></div>
      </form>
    </div>
  `;
}

export function renderSupportPage({ state }) {
  const list = state.records.support;
  return html`
    ${renderHeading('TECHNICAL SUPPORT', 'Technical support', 'Report access problems or errors. Do not include confidential mentoring details.')}
    <div class="columns record-columns">
      <form class="panel" data-form="record" data-kind="support">
        <small>NEW REQUEST</small>
        <h2>What went wrong?</h2>
        ${renderSelect(
          'category',
          'Category',
          ['Sign-in and access', 'Notifications', 'Data error', 'Other'].map((value) => [
            value,
            value,
          ]),
          'Sign-in and access',
        )}
        ${renderTextarea('description', 'Description')}
        <div class="actions"><button type="submit">Send to support${arrowIcon}</button></div>
      </form>
      <div class="record-list">
        <h2>My support requests</h2>
        ${
          list.length
            ? list
                .map(
                  (item) =>
                    `<article class="record-card"><div class="record-meta"><span>${formatTime(item.at)}</span><span class="badge">${escapeHtml(item.category)}</span><span class="badge is-wait">${escapeHtml(item.status)}</span></div><p><span data-no-translate>${escapeHtml(item.description)}</span></p></article>`,
                )
                .join('')
            : '<p class="helper">No support requests yet.</p>'
        }
      </div>
    </div>
  `;
}

export function renderTechPage() {
  return html`
    ${renderHeading('TECHNICAL ADMINISTRATION', 'System status', 'Integrations and notification delivery. Mentoring content is not available in this role.')}
    <div class="restricted-banner">
      <img
        class="icon"
        src="assets/icons/lock.png"
        alt=""
        aria-hidden="true"
        width="24"
        height="24"
      />
      <p>
        Technical administrators have no access to requests, plans, meeting notes or confidential
        requests.
      </p>
    </div>
    <div class="section-heading"><h2>Integrations</h2></div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SERVICE</th>
            <th>STATUS</th>
            <th>LAST CHECK</th>
          </tr>
        </thead>
        <tbody>
          ${integrations
            .map(
              ([service, status, checked]) =>
                `<tr><td>${service}</td><td><span class="badge ${status === 'Connected' ? 'is-ok' : status === 'Not configured' ? 'is-wait' : 'is-error'}">${status}</span></td><td class="helper">${checked}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="section-heading"><h2>Notification delivery errors</h2></div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TIME</th>
            <th>CHANNEL</th>
            <th>RECIPIENT</th>
            <th>ERROR</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${deliveryErrors
            .map(
              ([at, channel, recipient, error], index) =>
                `<tr><td>${at}</td><td>${channel}</td><td><span data-no-translate>${recipient}</span></td><td>${error}</td><td>${renderButton('Retry', 'retry-delivery', true, `data-id="${index}"`)}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function renderTechLogsPage() {
  return html`
    ${renderHeading('TECHNICAL ADMINISTRATION', 'Technical logs', 'Service events without personal or mentoring content.')}
    <div class="table-wrap">
      <table class="log-table">
        <thead>
          <tr>
            <th>TIME</th>
            <th>LEVEL</th>
            <th>COMPONENT</th>
            <th>EVENT</th>
          </tr>
        </thead>
        <tbody>
          ${technicalLogs
            .map(
              ([at, level, component, message]) =>
                `<tr><td>${at}</td><td><span class="badge ${level === 'ERROR' ? 'is-error' : level === 'WARN' ? 'is-wait' : 'is-ok'}">${level}</span></td><td><code data-no-translate>${component}</code></td><td>${message}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
