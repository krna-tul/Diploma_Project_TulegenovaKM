export const demoMentors = [
  {
    name: 'Aigerim S.',
    initials: 'AS',
    school: 'School of Computing',
    tags: ['Active learning', 'Lesson design'],
  },
  {
    name: 'Daniyar N.',
    initials: 'DN',
    school: 'School of Engineering',
    tags: ['Digital teaching', 'Assessment'],
  },
  {
    name: 'Madina K.',
    initials: 'MK',
    school: 'School of Computing',
    tags: ['Action Research', 'Feedback'],
  },
];
export const demoEvents = [
  {
    type: 'WORKSHOP',
    title: 'Make learning active',
    description: 'Explore group activities and practical ways to engage every student.',
    tags: 'Active learning · Lesson design',
    card: {
      icon: 'presentation',
      preview: 'A practical session on group work and short activities for every student.',
      blocks: [
        {
          icon: 'calendar-check',
          title: 'Before the session:',
          text: 'Choose one course where you would like to try a new activity.',
        },
        {
          icon: 'building',
          title: 'During the workshop:',
          text: 'Try three techniques in pairs and adapt one for your class.',
        },
      ],
    },
    details: [
      'A practical session on group work and short activities that keep every student involved.',
      'What you will do:',
      '• Try three active learning techniques in pairs\n• Adapt one activity for your own course\n• Agree a small change to test in your next class',
      'Format: 90 minutes, up to 16 participants.',
    ].join('\n\n'),
  },
  {
    type: 'OPEN LESSON',
    title: 'See good teaching in action',
    description: 'Observe a live lesson, ask questions and discuss the choices behind it.',
    tags: 'Observation · Student engagement',
    card: {
      icon: 'eye',
      preview: 'Visit a real class led by an experienced colleague.',
      emphasisIcon: 'alert-circle',
      emphasizedTitle: 'Please note:',
      bullets: [
        'the observation focus is agreed in advance;',
        'observers do not interrupt the lesson.',
      ],
      footerText: 'A short discussion with the lecturer follows.',
    },
    details: [
      'Visit a real class led by an experienced colleague and see how students are engaged step by step.',
      'What you will do:',
      '• Observe one focus agreed in advance\n• Note moments of strong student engagement\n• Discuss the teaching choices with the lecturer',
      'Format: one lesson and a 30-minute discussion.',
    ].join('\n\n'),
  },
  {
    type: 'MENTOR ROUNDTABLE',
    title: 'Turn feedback into progress',
    description: 'Discuss classroom challenges and learn how to plan an Action Research cycle.',
    tags: 'Feedback · Action Research',
    card: {
      icon: 'message-circle',
      preview: 'An open conversation with mentors about turning feedback into a plan.',
      emphasizedTitle: 'You will get:',
      bullets: [
        'the four steps of an Action Research cycle;',
        'a first question to investigate;',
        'ideas from colleagues.',
      ],
      footerNotice: 'Classroom examples stay within the group.',
    },
    details: [
      'An open conversation with mentors about turning feedback into a clear plan for change.',
      'What you will do:',
      '• Share one classroom challenge\n• Learn the four steps of an Action Research cycle\n• Draft a first question to investigate',
      'Format: 60 minutes, small groups of five.',
    ].join('\n\n'),
  },
  {
    type: 'PEER CIRCLE',
    title: 'Learn from a colleague’s class',
    description: 'Join a small group, observe a colleague and share what worked for students.',
    tags: 'Peer observation · Reflection',
    card: {
      icon: 'users',
      preview: 'A small circle of colleagues who visit each other’s classes.',
      emphasizedTitle: 'How it works:',
      bullets: [
        'visit one class of a colleague;',
        'share a plus, a question and a recommendation.',
      ],
      scheduleText: 'Three meetings during the semester.',
    },
    details: [
      'A small circle of colleagues who visit each other’s classes and reflect together.',
      'What you will do:',
      '• Visit one class of a colleague\n• Use the Plus, Question, Recommendation format\n• Reflect on one idea for your own teaching',
      'Format: three meetings during the semester.',
    ].join('\n\n'),
  },
];
