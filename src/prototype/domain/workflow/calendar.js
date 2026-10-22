import { requireValidDate } from './validation.js';
export function addWorkingDays(date, days, holidays = []) {
  requireValidDate(date, 'Дата назначения');
  const calendarDate = new Date(date + 'T12:00:00Z');
  for (let elapsedWorkingDays = 0; elapsedWorkingDays < days;) {
    calendarDate.setUTCDate(calendarDate.getUTCDate() + 1);
    if (
      ![0, 6].includes(calendarDate.getUTCDay()) &&
      !holidays.includes(calendarDate.toISOString().slice(0, 10))
    )
      elapsedWorkingDays++;
  }
  return calendarDate.toISOString().slice(0, 10);
}
