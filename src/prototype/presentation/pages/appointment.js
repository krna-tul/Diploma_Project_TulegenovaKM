import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderSelect,
  renderButton,
  escapeHtml,
  arrowIcon,
} from '../components/html.js';
import { demoMentors } from '../../domain/demo/catalog.js';
import {
  getMentorWorkload,
  demoMenteeQueue,
  MENTOR_LIMIT,
  HOURS_PER_MENTEE,
} from '../../domain/demo/records.js';

const name = (text) => `<span data-no-translate>${escapeHtml(text)}</span>`;

export function renderWorkloadTable(state) {
  return html`
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>MENTOR</th>
            <th>SCHOOL</th>
            <th>MENTEES</th>
            <th>HOURS PER TRIMESTER</th>
            <th>AVAILABILITY</th>
          </tr>
        </thead>
        <tbody>
          ${getMentorWorkload(demoMentors, state.appointments)
            .map(
              (mentor) =>
                `<tr><td>${name(mentor.name)}</td><td class="helper">${mentor.school}</td><td><span class="load-meter" style="--load:${Math.min(mentor.mentees / MENTOR_LIMIT, 1)}"></span> ${mentor.mentees} / ${MENTOR_LIMIT}</td><td>${mentor.hours}</td><td><span class="badge ${mentor.available ? 'is-ok' : 'is-error'}">${mentor.available ? 'Available' : 'Limit reached'}</span></td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function renderWorkloadPage({ state }) {
  return html`
    ${renderHeading('MENTOR WORKLOAD', 'Mentor workload', 'One mentor supports no more than two mentees at a time. Each mentee counts as 15 hours per trimester.')}
    <div class="grid3">
      <div class="stats-card">
        <small>LIMIT PER MENTOR</small>
        <strong>0${MENTOR_LIMIT}</strong>
      </div>
      <div class="stats-card">
        <small>HOURS PER MENTEE</small>
        <strong>${HOURS_PER_MENTEE}</strong>
      </div>
      <div class="stats-card">
        <small>ACTIVE APPOINTMENTS</small>
        <strong>${String(state.appointments.length).padStart(2, '0')}</strong>
      </div>
    </div>
    <div class="section-heading"><h2>Current workload</h2></div>
    ${renderWorkloadTable(state)}
    <p class="demo-note">
      A higher number of mentees is possible only with the School director’s approval.
    </p>
  `;
}

export function renderAppointmentPage({ state }) {
  const appointment = state.appointment;
  const workload = getMentorWorkload(demoMentors, state.appointments);
  return html`
    ${renderHeading('F-03 / MENTOR APPOINTMENT', 'Mentor appointment', 'Agree the mentor with both sides, check the workload and prepare the appointment order.')}
    <div class="stage-flow">
      ${['Request received', 'Both sides agree', 'Director submits', 'Vice-rector order']
        .map(
          (step, index) =>
            `<div class="${index < (appointment.status === 'Confirmed' ? 4 : appointment.status === 'Pending' ? 3 : 1) ? 'is-done' : ''}"><strong>0${index + 1}</strong><span>${step}</span></div>`,
        )
        .join('')}
    </div>
    <div class="columns record-columns">
      <form class="panel" data-form="appointment">
        <small>APPOINTMENT DRAFT</small>
        <h2>Assign a mentor</h2>
        ${renderSelect(
          'mentee',
          'Mentee',
          demoMenteeQueue.map((mentee) => [mentee.name, `${mentee.name} — ${mentee.school}`]),
          appointment.mentee || demoMenteeQueue[0].name,
        )}
        ${renderSelect(
          'mentor',
          'Mentor',
          workload.map((mentor) => [mentor.id, `${mentor.name} — ${mentor.school}`]),
          appointment.mentor ?? state.request.mentor ?? 0,
        )}
        ${renderSelect(
          'basis',
          'Basis',
          [
            ['Mentee preference', 'Mentee preference'],
            ['School selection', 'School selection'],
          ],
          appointment.basis || 'Mentee preference',
        )}
        <label class="check">
          <input type="checkbox" name="consent" required />
          <span>The mentor and the mentee have both agreed</span>
        </label>
        <label class="check">
          <input type="checkbox" name="approval" />
          <span>Director approval to exceed the limit of two mentees</span>
        </label>
        <div class="actions">
          <button type="submit">Submit for the appointment order${arrowIcon}</button>
          ${appointment.status === 'Pending' ? renderButton('Record the signed order', 'confirm-appointment', true) : ''}
        </div>
      </form>
      <div class="record-list">
        <div class="blue side-tip">
          <small>APPOINTMENT STATUS</small>
          <p>${escapeHtml(appointment.status)}</p>
        </div>
        <h2>Workload check</h2>
        ${workload
          .map(
            (mentor) =>
              `<div class="load-row"><span>${name(mentor.name)}</span><span class="load-meter" style="--load:${Math.min(mentor.mentees / MENTOR_LIMIT, 1)}"></span><span class="badge ${mentor.available ? 'is-ok' : 'is-error'}">${mentor.available ? 'Available' : 'Limit reached'}</span></div>`,
          )
          .join('')}
        <p class="helper">The plan must be agreed within ten working days after the appointment.</p>
      </div>
    </div>
  `;
}
