import { requireNonEmptyValue, requireScenarioRole, findRecord } from '../validation.js';
export function changeRequest({ data, role, createId, getPair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getPair();
  if (['completed', 'ended'].includes(mentoringPair.status))
    throw new Error('Программа уже завершена.');
  requireNonEmptyValue(data.reason, 'Причина обращения');
  mentoringPair.changeRequests.push({
    id: createId(),
    reason: data.reason,
    type: data.type,
    status: 'pending',
    author: role,
  });
}
export function changeResolve({ nextState, data, role, getPair }) {
  requireScenarioRole(role, 'director');
  const mentoringPair = getPair();
  const changeRequest = findRecord(mentoringPair.changeRequests, data.changeId);
  if (changeRequest.status !== 'pending') throw new Error('Обращение уже рассмотрено.');
  requireNonEmptyValue(data.reason, 'Решение Школы');
  changeRequest.status = 'resolved';
  changeRequest.decision = data.reason;
  if (data.end) {
    mentoringPair.status = 'ended';
    findRecord(nextState.requests, mentoringPair.requestId).status = 'submitted';
  }
}
