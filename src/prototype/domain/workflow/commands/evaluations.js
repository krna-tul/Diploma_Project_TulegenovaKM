import { requireNonEmptyValue } from '../validation.js';
export function evaluationSave({ data, role, getActivePair, requireParticipant }) {
  requireParticipant();
  const mentoringPair = getActivePair();
  if (!['start', 'middle', 'final'].includes(data.stage))
    throw new Error('Неизвестный этап оценки.');
  requireNonEmptyValue(data.text, 'Рефлексия или отзыв');
  mentoringPair.evaluations[data.stage] ??= {};
  mentoringPair.evaluations[data.stage][role] = data.text;
}
