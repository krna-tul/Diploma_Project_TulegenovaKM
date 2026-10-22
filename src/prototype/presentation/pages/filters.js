import { queryElement } from '../dom.js';
import { demoEvents } from '../../domain/demo/catalog.js';
export function updateSkillDescription(viewContext) {
  const { model } = viewContext;
  const selectedSkill = model?.skills.find(
    (skill) => skill.id === Number(queryElement('[name=skill]')?.value),
  );
  if (queryElement('#skill-description'))
    queryElement('#skill-description').textContent =
      selectedSkill?.description || 'Select a skill from UniSkill.';
}
export function updateEventFilters(viewContext) {
  const { t: translate } = viewContext;
  const searchQuery = (queryElement('[name=event-search]')?.value || '').toLowerCase(),
    selectedFormat = queryElement('[name=event-format]')?.value,
    selectedSkill = queryElement('[name=event-skill]')?.value;
  let count = 0;
  document.querySelectorAll('[data-event]').forEach((el) => {
    const event = demoEvents[Number(el.dataset.event)],
      show =
        (!searchQuery ||
          `${event.title} ${event.tags} ${event.description} ${translate(event.title)} ${translate(event.tags)} ${translate(event.description)}`
            .toLowerCase()
            .includes(searchQuery)) &&
        (!selectedFormat || event.type === selectedFormat) &&
        (!selectedSkill || event.tags.includes(selectedSkill));
    el.hidden = !show;
    count += Number(show);
  });
  if (queryElement('#event-empty')) queryElement('#event-empty').hidden = count > 0;
}
