import {
  requireNonEmptyValue,
  requireScenarioRole,
  findRecord,
  requireValidDate,
} from '../validation.js';
export function mentorSubmit({ nextState, data, role, createId }) {
  requireScenarioRole(role, 'teacher');
  for (const [fieldName, fieldLabel] of Object.entries({
    name: 'Имя',
    school: 'Школа',
    qualification: 'Квалификация',
    evidence: 'Подтвержденные результаты',
    expertise: 'Экспертиза',
    formats: 'Форматы',
    availability: 'Доступность',
  }))
    requireNonEmptyValue(data[fieldName], fieldLabel);
  if (!Number.isFinite(Number(data.experience)) || Number(data.experience) < 3)
    throw new Error('Для кандидата в наставники нужен стаж не менее 3 лет.');
  if (!data.skills?.length) throw new Error('Выберите хотя бы один навык.');
  if (!data.consent) throw new Error('Подтвердите готовность и согласие.');
  nextState.mentors.push({
    ...data,
    id: createId(),
    status: 'review',
    trained: false,
  });
}
export function mentorReview({ nextState, data, role, entityId }) {
  requireScenarioRole(role, 'director');
  const mentor = findRecord(nextState.mentors, entityId);
  if (mentor.status !== 'review') throw new Error('Карточка уже рассмотрена.');
  if (!data.verified) throw new Error('Подтвердите проверку критериев положения.');
  mentor.status = 'training';
}
export function mentorReturn({ nextState, data, role, entityId }) {
  requireScenarioRole(role, 'director');
  requireNonEmptyValue(data.reason, 'Причина возврата');
  const mentor = findRecord(nextState.mentors, entityId);
  if (!['review', 'training'].includes(mentor.status)) throw new Error('Возврат недоступен.');
  mentor.status = 'returned';
  mentor.reason = data.reason;
}
export function mentorTraining({ nextState, data, role, entityId }) {
  requireScenarioRole(role, 'department');
  const mentor = findRecord(nextState.mentors, entityId);
  if (mentor.status !== 'training') throw new Error('Сначала проверка Школы.');
  requireValidDate(data.date, 'Дата инструктажа');
  mentor.trained = true;
  mentor.trainingDate = data.date;
  mentor.status = 'published';
}
