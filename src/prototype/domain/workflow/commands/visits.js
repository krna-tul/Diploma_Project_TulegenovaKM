import {
  requireNonEmptyValue,
  requireScenarioRole,
  findRecord,
  requireValidDate,
} from '../validation.js';
export function visitPrepare({ data, createId, getActivePair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getActivePair();
  for (const [fieldName, fieldLabel] of Object.entries({
    purpose: 'Цель визита',
    course: 'Дисциплина',
    topic: 'Тема',
    time: 'Время',
    location: 'Место',
    lessonType: 'Тип занятия',
    objectives: 'Цели занятия',
    outcomes: 'Результаты обучения',
    group: 'Особенности группы',
    focus: 'Фокус наблюдения',
  }))
    requireNonEmptyValue(data[fieldName], fieldLabel);
  requireValidDate(data.date, 'Дата визита');
  if (data.date < mentoringPair.appointment.date || data.date > mentoringPair.appointment.end)
    throw new Error('Визит должен быть в периоде наставничества.');
  if (!Number.isInteger(Number(data.students)) || Number(data.students) < 1)
    throw new Error('Укажите число обучающихся.');
  if (!data.criteriaShared) throw new Error('Ознакомьте наставляемого с критериями карты.');
  mentoringPair.visits.push({
    ...data,
    id: createId(),
    status: 'observation',
    observations: [],
  });
}
export function visitObserve({ data, role, createId, getActivePair }) {
  requireScenarioRole(role, 'mentor');
  const visit = findRecord(getActivePair().visits, data.visitId);
  if (visit.status === 'complete') throw new Error('Визит уже завершен.');
  if (!/^\d{1,3}:[0-5]\d$/.test(data.timestamp || ''))
    throw new Error('Таймкод должен иметь формат мм:сс.');
  for (const fieldName of ['teacherAction', 'studentAction', 'criterion'])
    requireNonEmptyValue(data[fieldName], fieldName);
  visit.observations.push({
    ...data,
    id: createId(),
  });
}
export function visitReflect({ data, getActivePair, requireParticipant }) {
  requireParticipant();
  const visit = findRecord(getActivePair().visits, data.visitId);
  if (!visit.observations.length) throw new Error('Сначала добавьте наблюдаемые факты.');
  for (const [fieldName, fieldLabel] of Object.entries({
    selfAnalysis: 'Самоанализ',
    plus: 'Сильные стороны',
    question: 'Вопрос',
    recommendation: 'Рекомендация',
    change: 'Изменения следующего занятия',
    measurement: 'Как измерить',
    observerReflection: 'Рефлексия наблюдателя',
  }))
    requireNonEmptyValue(data[fieldName], fieldLabel);
  if (!data.shared) throw new Error('Подтвердите обсуждение карты с наставляемым.');
  visit.reflection = {
    ...data,
  };
  visit.status = 'complete';
}
