import { html } from '../components/html-template.js';
import {
  renderHeading,
  renderInput,
  renderSelect,
  escapeHtml,
  renderButton,
  arrowIcon,
} from '../components/html.js';
import { demoMentors } from '../../domain/demo/catalog.js';
import { queryElement } from '../dom.js';
export function renderMentorDirectoryPage(viewContext) {
  const { ranked, model, state } = viewContext;
  return html`
    ${renderHeading('MENTOR DIRECTORY', 'Find the right support', 'Explore colleagues by expertise, School and the professional questions you want to work on.')}
    <div class="filter-row">
      ${renderInput('mentor-search', 'Search', '', 'search', false)}${renderSelect(
        'school',
        'School',
        [
          ['', 'All Schools'],
          ['School of Computing', 'School of Computing'],
          ['School of Engineering', 'School of Engineering'],
        ],
        '',
      )}${renderSelect('expertise', 'Expertise', [['', 'All areas'], ...demoMentors.flatMap((mentor) => mentor.tags).map((label) => [label, label])], '')}
    </div>
    ${ranked ? `<div class="summary">Development focus: ${escapeHtml(model?.skills.find((skill) => skill.id === Number(state.request.skill))?.label || 'Loading…')} <a href="#request">Change skill →</a><p class="helper">Course relevance scores; not a validated measure of mentor suitability.</p></div>` : ''}
    <div class="section-heading">
      <h2>Available mentors</h2>
      <span id="mentor-count"></span>
    </div>
    <div class="cards" id="mentor-cards"></div>
    <p class="demo-note">Profiles shown are illustrative prototype data.</p>
    <div class="link-row">
      <a href="#request">Find recommendations by skill →</a>
      <a href="#courses">Manage demo course assignments →</a>
      <a href="#model">About the matching model →</a>
    </div>
  `;
}
export function updateMentorCards(viewContext) {
  const { getRankedMentors, t: translate, ranked } = viewContext;
  const searchQuery = (queryElement('[name=mentor-search]')?.value || '').toLowerCase(),
    school = queryElement('[name=school]')?.value,
    expertise = queryElement('[name=expertise]')?.value;
  const list = getRankedMentors().filter(
    (mentor) =>
      (!school || mentor.school === school) &&
      (!expertise || mentor.tags.includes(expertise)) &&
      `${mentor.name} ${mentor.tags.join(' ')} ${mentor.tags.map(translate).join(' ')} ${translate(mentor.school)} ${mentor.best?.course.title || ''}`
        .toLowerCase()
        .includes(searchQuery),
  );
  queryElement('#mentor-count').textContent = `${list.length} mentors shown`;
  queryElement('#mentor-cards').innerHTML =
    list
      .map(
        (mentor) => html`
          <article class="card">
            <div class="card-top">
              <span class="initials">${mentor.initials}</span>
              <span class="badge">Available</span>
            </div>
            <div class="card-body">
              <h2>${mentor.name}</h2>
              <p class="school">${mentor.school}</p>
              <div class="tags">
                ${mentor.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
              </div>
              ${ranked ? (mentor.best ? `<p class="score">${mentor.best.match ? 'Matching course found' : 'Below matching threshold'} · ${(mentor.best.probability * 100).toFixed(1)}%</p><div class="bar"><i style="width:${mentor.best.probability * 100}%"></i></div><p class="course-title">${escapeHtml(mentor.best.course.title)}</p>${renderButton('View course evidence', 'evidence', true, `data-id="${mentor.id}"`)}` : '<p>No courses linked to this profile.</p>') : ''}
              <button class="profile-link" data-action="profile" data-id="${mentor.id}">
                View mentor profile${arrowIcon}
              </button>
            </div>
          </article>
        `,
      )
      .join('') || '<p>No mentors meet these filters.</p>';
}
