import {
  requireNonEmptyValue,
  requireScenarioRole,
  findRecord,
  requireValidDate,
} from '../validation.js';
export function planSave({ data, getPair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getPair();
  if (!['planning', 'active'].includes(mentoringPair.status))
    throw new Error('План доступен после назначения.');
  for (const [fieldName, fieldLabel] of Object.entries({
    goal: 'Цель плана',
    frequency: 'Периодичность встреч',
    format: 'Формат встреч',
  }))
    requireNonEmptyValue(data[fieldName], fieldLabel);
  if (mentoringPair.plan.approved) {
    mentoringPair.planHistory ??= [];
    mentoringPair.planHistory.push(structuredClone(mentoringPair.plan));
  }
  mentoringPair.plan = {
    ...mentoringPair.plan,
    version: mentoringPair.plan.version + 1,
    goal: data.goal,
    frequency: data.frequency,
    format: data.format,
    approved: false,
    consents: {
      mentor: false,
      mentee: false,
    },
  };
  mentoringPair.status = 'planning';
}
export function planItem({ data, createId, getPair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getPair();
  if (!['planning', 'active'].includes(mentoringPair.status)) throw new Error('План недоступен.');
  for (const [fieldName, fieldLabel] of Object.entries({
    task: 'Задача',
    support: 'Поддержка наставника',
    expected: 'Ожидаемый результат',
    evidence: 'Фиксация прогресса',
  }))
    requireNonEmptyValue(data[fieldName], fieldLabel);
  requireValidDate(data.due, 'Срок задачи');
  if (data.due < mentoringPair.appointment.date || data.due > mentoringPair.appointment.end)
    throw new Error('Срок задачи должен попадать в период наставничества.');
  if (mentoringPair.plan.approved) {
    mentoringPair.planHistory ??= [];
    mentoringPair.planHistory.push(structuredClone(mentoringPair.plan));
  }
  mentoringPair.plan.items.push({
    ...data,
    id: createId(),
    done: false,
  });
  mentoringPair.plan.version++;
  mentoringPair.plan.consents = {
    mentor: false,
    mentee: false,
  };
  mentoringPair.plan.approved = false;
  mentoringPair.status = 'planning';
}
export function planConsent({ role, getPair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getPair();
  if (
    mentoringPair.status !== 'planning' ||
    !mentoringPair.plan.goal ||
    !mentoringPair.plan.items.length
  )
    throw new Error('Добавьте цель и хотя бы одну задачу.');
  mentoringPair.plan.consents[role] = true;
}
export function planApprove({ role, getPair }) {
  requireScenarioRole(role, 'director');
  const mentoringPair = getPair();
  if (
    mentoringPair.status !== 'planning' ||
    !mentoringPair.plan.consents.mentor ||
    !mentoringPair.plan.consents.mentee
  )
    throw new Error('Нужны согласия обеих сторон на текущую версию.');
  mentoringPair.plan.approved = true;
  mentoringPair.plan.approvedAt = new Date().toISOString();
  mentoringPair.status = 'active';
}
export function itemComplete({ data, getActivePair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getActivePair();
  const item = findRecord(mentoringPair.plan.items, data.itemId);
  requireNonEmptyValue(data.result, 'Достигнутый результат');
  item.done = true;
  item.result = data.result;
}
export function meetingAdd({ data, role, createId, getActivePair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getActivePair();
  requireValidDate(data.date, 'Дата встречи');
  requireNonEmptyValue(data.format, 'Формат');
  requireNonEmptyValue(data.result, 'Результат');
  if (data.date < mentoringPair.appointment.date || data.date > mentoringPair.appointment.end)
    throw new Error('Встреча должна быть в периоде наставничества.');
  mentoringPair.meetings.push({
    ...data,
    id: createId(),
    author: role,
    confirmedBy: null,
  });
}

export function planReturn({ data, role, getPair, now }) {
  requireScenarioRole(role, 'director');
  const mentoringPair = getPair();
  if (mentoringPair.status !== 'planning')
    throw new Error('Возврат доступен для плана на согласовании.');
  requireNonEmptyValue(data.reason, 'Комментарий возврата');
  mentoringPair.plan.returns ??= [];
  mentoringPair.plan.returns.push({
    version: mentoringPair.plan.version,
    reason: data.reason,
    at: now(),
  });
  mentoringPair.plan.consents = { mentor: false, mentee: false };
}
export function meetingConfirm({ data, role, getActivePair, requireParticipant, now }) {
  requireParticipant();
  const meeting = findRecord(getActivePair().meetings, data.meetingId);
  if (!meeting.author) throw new Error('Старая запись не содержит автора; создайте новую встречу.');
  if (meeting.author === role) throw new Error('Встречу подтверждает второй участник.');
  if (meeting.confirmedBy) throw new Error('Встреча уже подтверждена.');
  meeting.confirmedBy = role;
  meeting.confirmedAt = now();
}
