import { requireNonEmptyValue, requireScenarioRole, findRecord } from '../validation.js';
export function requestSubmit({ nextState, data, role, createId }) {
  requireScenarioRole(role, 'teacher');
  for (const [fieldName, fieldLabel] of Object.entries({
    name: 'Имя',
    school: 'Школа',
    need: 'Профессиональный запрос',
    goal: 'Ожидаемый результат',
    format: 'Формат',
    period: 'Период',
  }))
    requireNonEmptyValue(data[fieldName], fieldLabel);
  if (!data.consent) throw new Error('Подтвердите участие и конфиденциальность.');
  if (data.mentorId && findRecord(nextState.mentors, data.mentorId).status !== 'published')
    throw new Error('Этот наставник еще недоступен.');
  nextState.requests.push({
    ...data,
    id: createId(),
    status: 'submitted',
  });
}
