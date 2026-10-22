export const createInitialState = () => ({
  request: {
    area: 'Teaching methods and lesson design',
    goal: 'I would like to make my practical classes more interactive and develop strategies for engaging students with different learning needs.',
    mentor: 0,
    status: 'Not started',
  },
  mentor: {
    name: 'Aigerim S.',
    school: 'School of Computing',
    expertise: 'Active learning · Lesson design · Assessment',
    approach: '',
    format: 'Meetings and Development Visits',
    capacity: '2',
  },
  plan: {
    status: 'Draft',
    version: 1,
    items: [
      {
        task: 'Design an interactive practical class',
        note: 'Active learning and differentiation',
        date: '2026-10-30',
        result: 'Revised lesson plan',
      },
      {
        task: 'Complete a Development Visit',
        note: 'Observe, reflect and discuss',
        date: '2026-11-13',
        result: 'Observation and reflection',
      },
      {
        task: 'Review student feedback',
        note: 'Identify improvements for the next cycle',
        date: '2026-12-04',
        result: 'Agreed next steps',
      },
    ],
    history: [],
  },
  visit: {
    course: 'Programming Fundamentals — Practical class',
    date: '2026-11-13',
    location: '10:00 · Room 302',
    focus:
      'Student engagement, active learning and differentiation. Record specific observations and timestamps during the visit.',
  },
  assignments: {},
  enrollments: [],
  audit: [],
});
