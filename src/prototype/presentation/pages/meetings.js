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
import { meetingFormats, changeTypes } from '../../domain/demo/records.js';

export const roleLabels = {
  mentee: 'Mentee',
  mentor: 'Mentor',
  school: 'School coordinator',
  umo: 'Program administrator',
  tech: 'Technical administrator',
};
export const formatTime = (iso) =>
  String(iso || '')
    .slice(0, 16)
    .replace('T', ' ');
const userText = (text) => `<span data-no-translate>${escapeHtml(text)}</span>`;
const options = (values) => values.map((value) => [value, value]);

export function renderMeetingsPage({ state }) {
  const meetings = state.records.meetings;
  const confirmed = meetings.filter((meeting) => meeting.confirmed).length;
  return html`
    ${renderHeading('F-05 / MEETING JOURNAL', 'Meeting journal', 'Record each meeting briefly. The other participant confirms the record.')}
    <div class="grid3">
      <div class="stats-card">
        <small>MEETINGS RECORDED</small>
        <strong>${String(meetings.length).padStart(2, '0')}</strong>
      </div>
      <div class="stats-card">
        <small>CONFIRMED</small>
        <strong>${String(confirmed).padStart(2, '0')}</strong>
      </div>
      <div class="stats-card">
        <small>RECOMMENDED RHYTHM</small>
        <strong class="stats-text">Every two weeks</strong>
      </div>
    </div>
    <div class="columns record-columns">
      <form class="panel" data-form="record" data-kind="meetings">
        <small>NEW RECORD</small>
        <h2>Add a meeting</h2>
        <div class="field-grid">
          ${renderInput('date', 'Date', '', 'date')}
          ${renderSelect('format', 'Format', options(meetingFormats), meetingFormats[0])}
        </div>
        ${renderInput('topic', 'Topic')} ${renderTextarea('result', 'Short result')}
        ${renderSelect(
          'planItem',
          'Linked plan item',
          state.plan.items.map((item, index) => [String(index + 1), item.task]),
          '1',
        )}
        <div class="actions"><button type="submit">Save meeting record${arrowIcon}</button></div>
      </form>
      <div class="record-list">
        <h2>Recorded meetings</h2>
        ${meetings
          .map(
            (meeting, index) => html`
              <article class="record-card">
                <div class="record-meta">
                  <span>${escapeHtml(meeting.date)}</span>
                  <span class="badge">${escapeHtml(meeting.format)}</span>
                  <span class="badge ${meeting.confirmed ? 'is-ok' : 'is-wait'}">
                    ${meeting.confirmed ? 'Confirmed' : 'Awaiting confirmation'}
                  </span>
                </div>
                <h3>${userText(meeting.topic)}</h3>
                <p>${userText(meeting.result)}</p>
                <p class="helper">
                  <span>Plan item</span>
                  ${escapeHtml(meeting.planItem)} ·
                  <span>${escapeHtml(meeting.author)}</span>
                  · ${formatTime(meeting.at)}
                </p>
                ${meeting.confirmed ? '' : renderButton('Confirm record', 'confirm-meeting', true, `data-id="${index}"`)}
              </article>
            `,
          )
          .join('')}
      </div>
    </div>
    <p class="demo-note">
      Meeting notes stay within the pair. Reports include only the number of meetings.
    </p>
  `;
}

export function renderInterimPage({ state }) {
  const list = state.records.interim;
  return html`
    ${renderHeading('F-06 / INTERIM FEEDBACK', 'Interim feedback', 'A short check-in in the middle of the period to adjust the plan together.')}
    <div class="columns record-columns">
      <form class="panel" data-form="record" data-kind="interim">
        <small>MID-PERIOD CHECK-IN</small>
        <h2>How is it going?</h2>
        ${renderTextarea('working', 'What is working well')}
        ${renderTextarea('difficulties', 'Difficulties or open questions', '', false)}
        ${renderTextarea('adjustments', 'Agreed plan adjustments')}
        <label class="check">
          <input type="checkbox" name="agreed" required />
          <span>Discussed and agreed by the mentor and the mentee</span>
        </label>
        <div class="actions"><button type="submit">Save interim feedback${arrowIcon}</button></div>
      </form>
      <div class="record-list">
        <h2>Previous check-ins</h2>
        ${
          list.length
            ? list
                .map(
                  (item) => html`
                    <article class="record-card">
                      <div class="record-meta"><span>${formatTime(item.at)}</span></div>
                      <h3>What is working well</h3>
                      <p>${userText(item.working)}</p>
                      <h3>Agreed plan adjustments</h3>
                      <p>${userText(item.adjustments)}</p>
                    </article>
                  `,
                )
                .join('')
            : '<p class="helper">No interim feedback yet.</p>'
        }
        <div class="blue side-tip">
          <small>WHEN</small>
          <p>Halfway through the program period. Keep it short: what works, what to change.</p>
        </div>
      </div>
    </div>
  `;
}

export function renderChangesPage({ state, role }) {
  const list = state.records.changes;
  const reviewer = role === 'school';
  return html`
    ${renderHeading('F-07 / PROGRAM CHANGES', reviewer ? 'Program changes' : 'Request a change', 'Replacement, extension, shortening or early completion. The School reviews each request.')}
    <div class="columns record-columns">
      ${
        reviewer
          ? ''
          : html`
              <form class="panel" data-form="record" data-kind="changes">
                <small>NEW REQUEST</small>
                <h2>What should change?</h2>
                ${renderSelect('type', 'Type of change', options(changeTypes), changeTypes[0])}
                ${renderInput('date', 'Proposed date', '', 'date', false)}
                ${renderTextarea('reason', 'Reason for change')}
                <p class="helper">
                  A change request is not treated as a conflict or a professional failure.
                </p>
                <div class="actions">
                  <button type="submit">Submit change request${arrowIcon}</button>
                </div>
              </form>
            `
      }
      <div class="record-list ${reviewer ? 'wide' : ''}">
        <h2>${reviewer ? 'Requests to review' : 'My change requests'}</h2>
        ${
          list.length
            ? list
                .map(
                  (item, index) => html`
                    <article class="record-card">
                      <div class="record-meta">
                        <span>${formatTime(item.at)}</span>
                        <span class="badge">${escapeHtml(item.type)}</span>
                        <span
                          class="badge ${item.status === 'Approved' ? 'is-ok' : item.status === 'Declined' ? 'is-error' : 'is-wait'}"
                        >
                          ${escapeHtml(item.status)}
                        </span>
                      </div>
                      <p>${userText(item.reason)}</p>
                      ${
                        reviewer && item.status === 'Submitted'
                          ? `<div class="actions">${renderButton('Approve', 'decide-change', false, `data-id="${index}" data-decision="Approved"`)}${renderButton('Decline', 'decide-change', true, `data-id="${index}" data-decision="Declined"`)}</div>`
                          : ''
                      }
                    </article>
                  `,
                )
                .join('')
            : '<p class="helper">No change requests yet.</p>'
        }
      </div>
    </div>
  `;
}

export function renderConfidentialPage({ state }) {
  const list = state.records.confidential;
  return html`
    ${renderHeading('F-11 / CONFIDENTIAL REQUEST', 'Confidential request', 'For sensitive situations that need institutional support. Access is restricted.')}
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
        Only you and the authorized reviewer can see this request. It is excluded from reports,
        analytics and exports.
      </p>
    </div>
    <div class="columns record-columns">
      <form class="panel" data-form="record" data-kind="confidential">
        <small>RESTRICTED ACCESS</small>
        <h2>Describe the situation</h2>
        ${renderSelect(
          'topic',
          'Reason',
          options([
            'Safety of students or staff',
            'Academic integrity or ethics',
            'Discrimination',
            'Request to involve the School director',
            'Beyond the mentor’s competence',
          ]),
          'Request to involve the School director',
        )}
        ${renderTextarea('message', 'Message')}
        <label class="check">
          <input type="checkbox" name="consent" />
          <span>I agree that the School director may be informed</span>
        </label>
        <div class="actions">
          <button type="submit">Send confidential request${arrowIcon}</button>
        </div>
      </form>
      <div class="record-list">
        <h2>My confidential requests</h2>
        ${
          list.length
            ? list
                .map(
                  (item) => html`
                    <article class="record-card">
                      <div class="record-meta">
                        <span>${formatTime(item.at)}</span>
                        <span class="badge is-error">Restricted</span>
                      </div>
                      <h3>${escapeHtml(item.topic)}</h3>
                      <p class="helper">Content hidden in the list for privacy.</p>
                    </article>
                  `,
                )
                .join('')
            : '<p class="helper">No confidential requests.</p>'
        }
        <div class="blue side-tip">
          <small>CONFIDENTIALITY</small>
          <p>The mentor does not share details of the mentee’s difficulties without consent.</p>
        </div>
      </div>
    </div>
  `;
}
