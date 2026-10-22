import { requireNonEmptyValue, requireScenarioRole, findRecord } from '../validation.js';
export function eventEnroll({ nextState, data, role, entityId, createId }) {
  requireScenarioRole(role, 'teacher');
  const event = findRecord(nextState.events, entityId);
  requireNonEmptyValue(data.name, 'Имя для записи');
  if (
    nextState.enrollments.some(
      (record) =>
        record.eventId === entityId &&
        record.name.trim().toLowerCase() === data.name.trim().toLowerCase(),
    )
  )
    throw new Error('Вы уже записаны на это мероприятие.');
  if (
    nextState.enrollments.filter((record) => record.eventId === entityId).length >= event.capacity
  )
    throw new Error('Свободных мест нет.');
  nextState.enrollments.push({
    id: createId(),
    eventId: entityId,
    name: data.name,
  });
}
