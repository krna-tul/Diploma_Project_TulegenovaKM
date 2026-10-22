export function requireNonEmptyValue(value, label) {
  if (!String(value ?? '').trim()) throw new Error(`Заполните поле «${label}».`);
}
export function requireScenarioRole(role, expected) {
  if (role !== expected) throw new Error('Переключитесь на соответствующую роль сценария.');
}
export function findRecord(list, entityId) {
  const row = list.find((record) => record.id === entityId);
  if (!row) throw new Error('Запись не найдена.');
  return row;
}
export function isValidDate(value) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value
  );
}
export function requireValidDate(value, label) {
  requireNonEmptyValue(value, label);
  if (!isValidDate(value)) throw new Error(`Некорректная дата: ${label}.`);
}
