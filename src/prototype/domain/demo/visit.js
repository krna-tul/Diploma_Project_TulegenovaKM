export const visitStages = ['preparation', 'observation', 'reflection'];
export function saveVisitStage(visit, stage, values) {
  if (!visitStages.includes(stage)) throw new Error('Unknown visit stage.');
  if (stage === 'observation' && !/^\d{1,3}:[0-5]\d$/.test(values.timestamp))
    throw new Error('Use mm:ss for the observation time.');
  if (stage === 'reflection' && !visit.observation)
    throw new Error('Save an observation before completing the reflection.');
  Object.assign(visit, values);
}
