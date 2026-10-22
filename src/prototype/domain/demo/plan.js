export const PlanStatus = Object.freeze({
  DRAFT: 'Draft',
  IN_REVIEW: 'Needs review',
  APPROVED: 'Approved',
  RETURNED: 'Returned for revision',
});
const PROGRAM_START = '2026-10-01';
const PROGRAM_END = '2026-12-31';
function recordPreviousVersion(plan) {
  const { history, ...snapshot } = plan;
  history.push(structuredClone(snapshot));
  plan.version++;
}
export function savePlanDraft(plan) {
  if ([PlanStatus.APPROVED, PlanStatus.IN_REVIEW].includes(plan.status))
    recordPreviousVersion(plan);
  plan.status = PlanStatus.DRAFT;
}
export function addPlanActivity(plan, activity) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(activity.date) ||
    activity.date < PROGRAM_START ||
    activity.date > PROGRAM_END ||
    new Date(activity.date + 'T00:00:00Z').toISOString().slice(0, 10) !== activity.date
  )
    throw new Error('Choose a date within October–December 2026.');
  recordPreviousVersion(plan);
  plan.items.push({
    ...activity,
  });
  plan.status = PlanStatus.DRAFT;
}
export function submitPlan(plan) {
  if (!plan.items.length) throw new Error('Add at least one activity.');
  plan.status = PlanStatus.IN_REVIEW;
}
export function reviewPlan(plan, decision, comment) {
  if (plan.status !== PlanStatus.IN_REVIEW) throw new Error('Submit a plan before reviewing it.');
  if (![PlanStatus.APPROVED, PlanStatus.RETURNED].includes(decision))
    throw new Error('Choose a review decision.');
  if (decision === PlanStatus.RETURNED && !comment.trim())
    throw new Error('Add a helpful comment before returning the plan.');
  plan.status = decision;
  plan.comment = comment;
}
