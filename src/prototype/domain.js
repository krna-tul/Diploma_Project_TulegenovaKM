// This is a single-browser process prototype. Roles below are scenario guards, not authentication.
export const skills = [
  {id:'active',name:'Активное обучение',area:'Педагогика',description:'Вовлекать студентов в обсуждения, кейсы и совместную работу.'},
  {id:'assessment',name:'Оценивание и обратная связь',area:'Методика',description:'Создавать рубрики и давать обратную связь, которая помогает учиться.'},
  {id:'digital',name:'LMS и цифровые инструменты',area:'Цифровые навыки',description:'Организовать курс, задания и оценивание в цифровой среде.'},
  {id:'syllabus',name:'Разработка силлабуса',area:'Методика',description:'Связать цели дисциплины, результаты обучения и задания.'},
  {id:'research',name:'Action Research',area:'Исследования',description:'Исследовать свою практику и измерять изменения в преподавании.'},
  {id:'communication',name:'Работа с аудиторией',area:'Педагогика',description:'Разбирать педагогические ситуации и выстраивать взаимодействие.'}
];
export function initialState() {
  return {schema:1, mentors:[
    {id:'m1',name:'Демо-наставник А',school:'Школа цифровых технологий',experience:8,qualification:'Педагогическая и методическая экспертиза',evidence:'Демонстрационные сведения',expertise:'Активное обучение и рубрики',skills:['active','assessment'],formats:'Очный и смешанный',availability:'По согласованию',status:'published',trained:true},
    {id:'m2',name:'Демо-наставник Б',school:'Школа цифровых технологий',experience:5,qualification:'Разработка цифровых курсов',evidence:'Демонстрационные сведения',expertise:'LMS и силлабусы',skills:['digital','syllabus'],formats:'Онлайн и очный',availability:'По согласованию',status:'published',trained:true}
  ],requests:[],pairs:[],events:[
    {id:'e1',title:'От лекции к активному занятию',skills:['active','communication'],date:'2026-10-19',time:'16:00',format:'Мастерская · очно',location:'Демо-аудитория',capacity:12},
    {id:'e2',title:'Рубрика, которая помогает учиться',skills:['assessment','syllabus'],date:'2026-10-21',time:'15:00',format:'Практикум · онлайн',location:'Ссылка после записи',capacity:10},
    {id:'e3',title:'Первый цикл Action Research',skills:['research'],date:'2026-10-23',time:'14:00',format:'Семинар · смешанный',location:'Демо-площадка',capacity:15}
  ],enrollments:[],audit:[]};
}
function requireValue(value,label) {if (!String(value ?? '').trim()) throw new Error(`Заполните поле «${label}».`);}
function requireRole(role,expected) {if(role !== expected) throw new Error('Переключитесь на соответствующую роль сценария.');}
function find(list,id) {const row=list.find(x=>x.id===id);if(!row) throw new Error('Запись не найдена.');return row;}
function validDate(value) {return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value+'T00:00:00Z').toISOString().slice(0,10) === value;}
function requireDate(value,label) {requireValue(value,label);if(!validDate(value))throw new Error(`Некорректная дата: ${label}.`);}
export function addWorkingDays(date,days,holidays=[]) {
  requireDate(date,'Дата назначения');
  const d=new Date(date+'T12:00:00Z');
  for(let n=0;n<days;) {d.setUTCDate(d.getUTCDate()+1);if(![0,6].includes(d.getUTCDay()) && !holidays.includes(d.toISOString().slice(0,10)))n++;}
  return d.toISOString().slice(0,10);
}
export function mentorLoad(state,id) {return state.pairs.filter(p=>p.mentorId===id && !['completed','ended'].includes(p.status)).length;}
export function summary(state) {return {published:state.mentors.filter(m=>m.status==='published').length,requests:state.requests.length,active:state.pairs.filter(p=>p.status==='active').length,completed:state.pairs.filter(p=>p.status==='completed').length};}
export function transition(state,action,data={},role='teacher') {
  const s=structuredClone(state);const id=data.id;
  const uid=()=>globalThis.crypto.randomUUID();
  const pair=()=>find(s.pairs,id);
  const participant=()=>{if(!['mentor','mentee'].includes(role))throw new Error('Действие доступно участникам пары.');};
  const active=()=>{const p=pair();if(p.status!=='active')throw new Error('Сначала утвердите индивидуальный план.');return p;};
  switch(action) {
    case 'mentor-submit': {
      requireRole(role,'teacher');
      for(const [k,l] of Object.entries({name:'Имя',school:'Школа',qualification:'Квалификация',evidence:'Подтвержденные результаты',expertise:'Экспертиза',formats:'Форматы',availability:'Доступность'}))requireValue(data[k],l);
      if(!Number.isFinite(Number(data.experience)) || Number(data.experience)<3)throw new Error('Для кандидата в наставники нужен стаж не менее 3 лет.');
      if(!data.skills?.length)throw new Error('Выберите хотя бы один навык.');
      if(!data.consent)throw new Error('Подтвердите готовность и согласие.');
      s.mentors.push({...data,id:uid(),status:'review',trained:false});break;
    }
    case 'mentor-review': {
      requireRole(role,'director');const m=find(s.mentors,id);if(m.status!=='review')throw new Error('Карточка уже рассмотрена.');
      if(!data.verified)throw new Error('Подтвердите проверку критериев положения.');
      m.status='training';break;
    }
    case 'mentor-return': {
      requireRole(role,'director');requireValue(data.reason,'Причина возврата');const m=find(s.mentors,id);
      if(!['review','training'].includes(m.status))throw new Error('Возврат недоступен.');m.status='returned';m.reason=data.reason;break;
    }
    case 'mentor-training': {
      requireRole(role,'department');const m=find(s.mentors,id);if(m.status!=='training')throw new Error('Сначала проверка Школы.');
      requireDate(data.date,'Дата инструктажа');m.trained=true;m.trainingDate=data.date;m.status='published';break;
    }
    case 'request-submit': {
      requireRole(role,'teacher');
      for(const [k,l] of Object.entries({name:'Имя',school:'Школа',need:'Профессиональный запрос',goal:'Ожидаемый результат',format:'Формат',period:'Период'}))requireValue(data[k],l);
      if(!data.consent)throw new Error('Подтвердите участие и конфиденциальность.');
      if(data.mentorId && find(s.mentors,data.mentorId).status!=='published')throw new Error('Этот наставник еще недоступен.');
      s.requests.push({...data,id:uid(),status:'submitted'});break;
    }
    case 'pair-propose': {
      requireRole(role,'director');const req=find(s.requests,id);if(req.status!=='submitted')throw new Error('Запрос уже обработан.');
      const m=find(s.mentors,data.mentorId);if(m.status!=='published'||!m.trained)throw new Error('Кандидат должен пройти проверку и инструктаж.');
      if(req.name.trim().toLowerCase()===m.name.trim().toLowerCase())throw new Error('Нельзя назначить себя собственным наставником.');
      req.status='matching';s.pairs.push({id:uid(),requestId:id,mentorId:m.id,status:'consents',consents:{mentor:false,mentee:false},plan:{version:1,items:[],consents:{mentor:false,mentee:false},approved:false},meetings:[],visits:[],evaluations:{},changeRequests:[]});break;
    }
    case 'pair-consent': {participant();const p=pair();if(p.status!=='consents')throw new Error('Согласование пары завершено.');p.consents[role]=true;break;}
    case 'pair-decline': {participant();requireValue(data.reason,'Причина отказа');const p=pair();if(p.status!=='consents')throw new Error('Используйте обращение о замене.');p.status='ended';p.reason=data.reason;find(s.requests,p.requestId).status='submitted';break;}
    case 'pair-present': {
      requireRole(role,'director');const p=pair();if(p.status!=='consents'||!p.consents.mentor||!p.consents.mentee)throw new Error('Нужны согласия обеих сторон.');
      if(!data.noConflict)throw new Error('Подтвердите отсутствие конфликта интересов.');
      p.noConflict=true;p.exceptionReason=data.exceptionReason||'';p.exceptionDirector=!!data.exceptionDirector;p.exceptionMentor=!!data.exceptionMentor;
      // Proposed pairs reserve capacity. The appointment rechecks the same invariant.
      if(mentorLoad(s,p.mentorId)>2 && !(p.exceptionReason.trim()&&p.exceptionDirector&&p.exceptionMentor))throw new Error('Лимит — два наставляемых. Для исключения нужны обоснование, согласие наставника и решение директора.');
      p.status='presented';break;
    }
    case 'pair-appoint': {
      requireRole(role,'rector');const p=pair();if(p.status!=='presented')throw new Error('Сначала представление директора.');
      requireValue(data.number,'Номер распоряжения');requireDate(data.date,'Дата распоряжения');requireDate(data.end,'Конец периода');if(data.end<=data.date)throw new Error('Конец периода должен быть после назначения.');
      if(mentorLoad(s,p.mentorId)>2 && !(p.exceptionReason.trim()&&p.exceptionDirector&&p.exceptionMentor))throw new Error('Превышена нагрузка наставника.');
      p.appointment={number:data.number,date:data.date,end:data.end,authority:'Проректор по академической работе'};p.planDeadline=addWorkingDays(data.date,10);p.status='planning';break;
    }
    case 'plan-save': {
      participant();const p=pair();if(!['planning','active'].includes(p.status))throw new Error('План доступен после назначения.');
      for(const [k,l] of Object.entries({goal:'Цель плана',frequency:'Периодичность встреч',format:'Формат встреч'}))requireValue(data[k],l);
      if(p.plan.approved){p.planHistory??=[];p.planHistory.push(structuredClone(p.plan));}
      p.plan={...p.plan,version:p.plan.version+1,goal:data.goal,frequency:data.frequency,format:data.format,approved:false,consents:{mentor:false,mentee:false}};p.status='planning';break;
    }
    case 'plan-item': {
      participant();const p=pair();if(!['planning','active'].includes(p.status))throw new Error('План недоступен.');
      for(const [k,l] of Object.entries({task:'Задача',support:'Поддержка наставника',expected:'Ожидаемый результат',evidence:'Фиксация прогресса'}))requireValue(data[k],l);
      requireDate(data.due,'Срок задачи');if(data.due<p.appointment.date || data.due>p.appointment.end)throw new Error('Срок задачи должен попадать в период наставничества.');
      if(p.plan.approved){p.planHistory??=[];p.planHistory.push(structuredClone(p.plan));}
      p.plan.items.push({...data,id:uid(),done:false});p.plan.version++;p.plan.consents={mentor:false,mentee:false};p.plan.approved=false;p.status='planning';break;
    }
    case 'plan-consent': {participant();const p=pair();if(p.status!=='planning'||!p.plan.goal||!p.plan.items.length)throw new Error('Добавьте цель и хотя бы одну задачу.');p.plan.consents[role]=true;break;}
    case 'plan-approve': {requireRole(role,'director');const p=pair();if(p.status!=='planning'||!p.plan.consents.mentor||!p.plan.consents.mentee)throw new Error('Нужны согласия обеих сторон на текущую версию.');p.plan.approved=true;p.plan.approvedAt=new Date().toISOString();p.status='active';break;}
    case 'item-complete': {participant();const p=active();const item=find(p.plan.items,data.itemId);requireValue(data.result,'Достигнутый результат');item.done=true;item.result=data.result;break;}
    case 'meeting-add': {participant();const p=active();requireDate(data.date,'Дата встречи');requireValue(data.format,'Формат');requireValue(data.result,'Результат');if(data.date<p.appointment.date||data.date>p.appointment.end)throw new Error('Встреча должна быть в периоде наставничества.');p.meetings.push({...data,id:uid()});break;}
    case 'visit-prepare': {
      participant();const p=active();for(const [k,l] of Object.entries({purpose:'Цель визита',course:'Дисциплина',topic:'Тема',time:'Время',location:'Место',lessonType:'Тип занятия',objectives:'Цели занятия',outcomes:'Результаты обучения',group:'Особенности группы',focus:'Фокус наблюдения'}))requireValue(data[k],l);
      requireDate(data.date,'Дата визита');if(data.date<p.appointment.date||data.date>p.appointment.end)throw new Error('Визит должен быть в периоде наставничества.');if(!Number.isInteger(Number(data.students))||Number(data.students)<1)throw new Error('Укажите число обучающихся.');if(!data.criteriaShared)throw new Error('Ознакомьте наставляемого с критериями карты.');p.visits.push({...data,id:uid(),status:'observation',observations:[]});break;
    }
    case 'visit-observe': {requireRole(role,'mentor');const v=find(active().visits,data.visitId);if(v.status==='complete')throw new Error('Визит уже завершен.');if(!/^\d{1,3}:[0-5]\d$/.test(data.timestamp||''))throw new Error('Таймкод должен иметь формат мм:сс.');for(const k of ['teacherAction','studentAction','criterion'])requireValue(data[k],k);v.observations.push({...data,id:uid()});break;}
    case 'visit-reflect': {
      participant();const v=find(active().visits,data.visitId);if(!v.observations.length)throw new Error('Сначала добавьте наблюдаемые факты.');for(const [k,l] of Object.entries({selfAnalysis:'Самоанализ',plus:'Сильные стороны',question:'Вопрос',recommendation:'Рекомендация',change:'Изменения следующего занятия',measurement:'Как измерить',observerReflection:'Рефлексия наблюдателя'}))requireValue(data[k],l);
      if(!data.shared)throw new Error('Подтвердите обсуждение карты с наставляемым.');v.reflection={...data};v.status='complete';break;
    }
    case 'evaluation-save': {participant();const p=active();if(!['start','middle','final'].includes(data.stage))throw new Error('Неизвестный этап оценки.');requireValue(data.text,'Рефлексия или отзыв');p.evaluations[data.stage]??={};p.evaluations[data.stage][role]=data.text;break;}
    case 'pair-complete': {requireRole(role,'director');const p=active();if(!p.evaluations.final?.mentor||!p.evaluations.final?.mentee)throw new Error('Нужны итоговый отзыв наставника и самооценка наставляемого.');p.status='completed';break;}
    case 'change-request': {participant();const p=pair();if(['completed','ended'].includes(p.status))throw new Error('Программа уже завершена.');requireValue(data.reason,'Причина обращения');p.changeRequests.push({id:uid(),reason:data.reason,type:data.type,status:'pending',author:role});break;}
    case 'change-resolve': {requireRole(role,'director');const p=pair();const c=find(p.changeRequests,data.changeId);if(c.status!=='pending')throw new Error('Обращение уже рассмотрено.');requireValue(data.reason,'Решение Школы');c.status='resolved';c.decision=data.reason;if(data.end){p.status='ended';find(s.requests,p.requestId).status='submitted';}break;}
    case 'event-enroll': {requireRole(role,'teacher');const e=find(s.events,id);requireValue(data.name,'Имя для записи');if(s.enrollments.some(x=>x.eventId===id&&x.name.trim().toLowerCase()===data.name.trim().toLowerCase()))throw new Error('Вы уже записаны на это мероприятие.');if(s.enrollments.filter(x=>x.eventId===id).length>=e.capacity)throw new Error('Свободных мест нет.');s.enrollments.push({id:uid(),eventId:id,name:data.name});break;}
    default:throw new Error('Неизвестное действие.');
  }
  s.audit.push({action,entityId:id||null,role,at:new Date().toISOString()});return s;
}
