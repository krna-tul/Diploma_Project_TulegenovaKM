import { html } from '../components/html-template.js';
import { queryElement, readFormValues } from '../dom.js';
import { escapeHtml } from '../components/html.js';
export function bindInterfaceEvents({
  actions,
  forms,
  service,
  session,
  render,
  navigate,
  notify,
  refreshMentors,
  refreshCourses,
  refreshEvents,
  refreshSkillDescription,
}) {
  function safely(action) {
    try {
      action();
    } catch (error) {
      notify(error.message);
    }
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (button && Object.hasOwn(actions, button.dataset.action))
      safely(() => actions[button.dataset.action](button));
  });
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.dataset.form) return;
    event.preventDefault();
    if (Object.hasOwn(forms, form.dataset.form))
      safely(() => forms[form.dataset.form](readFormValues(form), event));
  });
  const inputHandlers = {
    'mentor-search': refreshMentors,
    'event-search': refreshEvents,
    'course-search': refreshCourses,
    'skill-search'(input) {
      if (!session.model) return;
      const search = input.value.toLowerCase();
      const skillSelect = queryElement('[name=skill]');
      const previousSkillId = skillSelect.value;
      const skills = session.model.skills.filter((skill) =>
        skill.label.toLowerCase().includes(search),
      );
      skillSelect.innerHTML = skills
        .map(
          (skill) => html`
            <option value="${skill.id}">${escapeHtml(skill.label)}</option>
          `,
        )
        .join('');
      if (skills.some((skill) => String(skill.id) === previousSkillId))
        skillSelect.value = previousSkillId;
      queryElement('[data-action=recommend]').disabled = !skills.length;
      refreshSkillDescription();
    },
  };
  const changeHandlers = {
    school: refreshMentors,
    expertise: refreshMentors,
    'event-format': refreshEvents,
    'event-skill': refreshEvents,
    skill: refreshSkillDescription,
    'course-mentor': refreshCourses,
  };
  document.addEventListener('input', (event) => {
    const handler = inputHandlers[event.target.name];
    if (handler) safely(() => handler(event.target));
  });
  document.addEventListener('change', (event) =>
    safely(() => {
      const input = event.target;
      if (input.id === 'role') {
        session.role = input.value;
        navigate(
          {
            mentee: 'overview',
            mentor: 'mentor-form',
            school: 'review',
            umo: 'umo',
          }[session.role],
        );
        render();
      }
      const handler = changeHandlers[input.name];
      if (handler) handler();
      if (input.dataset.course) {
        service.assignCourse(
          input.dataset.course,
          input.checked ? Number(queryElement('[name=course-mentor]').value) : -1,
        );
        notify('Course assignment saved.');
        refreshCourses();
      }
    }),
  );
}
