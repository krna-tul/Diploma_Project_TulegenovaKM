import { demoMentors } from './catalog.js';
export function getProgramSummaries(state) {
  return [
    {
      name: 'Alina K. / ' + (demoMentors[state.request.mentor]?.name || 'Not selected'),
      school: 'Computing',
      status: state.plan.status,
      docs: state.plan.status === 'Approved' ? '5 of 5' : '4 of 5',
    },
    {
      name: 'Timur A. / Daniyar N.',
      school: 'Engineering',
      status: 'Active',
      docs: '5 of 5',
    },
    {
      name: 'Dana M. / Madina K.',
      school: 'Computing',
      status: 'Final review',
      docs: '7 of 8',
    },
  ];
}
