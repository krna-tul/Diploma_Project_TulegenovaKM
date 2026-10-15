import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialState,transition as t,addWorkingDays,summary} from '../src/prototype/domain.js';
const req={name:'Демо-преподаватель',school:'Школа цифровых технологий',need:'Освоить рубрики',goal:'Разработать рубрику',format:'Очный',period:'Один триместр',consent:true,skills:['assessment']};
function proposed(){let s=t(initialState(),'request-submit',req);s=t(s,'pair-propose',{id:s.requests[0].id,mentorId:'m1'},'director');return s;}
function assigned(){let s=proposed(),id=s.pairs[0].id;s=t(s,'pair-consent',{id},'mentor');s=t(s,'pair-consent',{id},'mentee');s=t(s,'pair-present',{id,noConflict:true},'director');return t(s,'pair-appoint',{id,number:'DEMO-01',date:'2026-10-12',end:'2026-12-31'},'rector');}
function active(){let s=assigned(),id=s.pairs[0].id;s=t(s,'plan-save',{id,goal:'Разработать рубрику',frequency:'Раз в две недели',format:'Очный'},'mentee');s=t(s,'plan-item',{id,task:'Разработать критерии',due:'2026-11-01',support:'Консультация',expected:'Рубрика',evidence:'Версия документа'},'mentor');s=t(s,'plan-consent',{id},'mentor');s=t(s,'plan-consent',{id},'mentee');return t(s,'plan-approve',{id},'director');}
test('request allows no preferred mentor, preserves original state',()=>{const s=initialState();const next=t(s,'request-submit',req);assert.equal(s.requests.length,0);assert.equal(next.requests.length,1);});
test('mentor experience and candidate consent are required',()=>{const data={name:'М',school:'Ш',experience:2,qualification:'К',evidence:'Р',expertise:'Э',formats:'Очный',availability:'Раз в неделю',skills:['active'],consent:true};assert.throws(()=>t(initialState(),'mentor-submit',data),/3 лет/);data.experience=3;let s=t(initialState(),'mentor-submit',data);const id=s.mentors.at(-1).id;assert.throws(()=>t(s,'mentor-training',{id,date:'2026-10-12'},'department'),/проверка/);s=t(s,'mentor-review',{id,verified:true},'director');s=t(s,'mentor-training',{id,date:'2026-10-12'},'department');assert.equal(s.mentors.at(-1).status,'published');});
test('both participants must consent before presentation',()=>{const s=proposed();assert.throws(()=>t(s,'pair-present',{id:s.pairs[0].id,noConflict:true},'director'),/обеих сторон/);});
test('appointment requires presentation and registrar scenario role',()=>{const s=proposed(),id=s.pairs[0].id;assert.throws(()=>t(s,'pair-appoint',{id},'rector'),/представление/);assert.throws(()=>t(s,'pair-consent',{id},'director'),/участникам/);});
test('third reserved pair requires recorded exception',()=>{let s=initialState();for(let n=0;n<3;n++){s=t(s,'request-submit',{...req,name:'Mentee '+n});s=t(s,'pair-propose',{id:s.requests.at(-1).id,mentorId:'m1'},'director');const id=s.pairs.at(-1).id;s=t(s,'pair-consent',{id},'mentor');s=t(s,'pair-consent',{id},'mentee');if(n<2)s=t(s,'pair-present',{id,noConflict:true},'director');else{assert.throws(()=>t(s,'pair-present',{id,noConflict:true},'director'),/Лимит/);s=t(s,'pair-present',{id,noConflict:true,exceptionReason:'Университетская необходимость',exceptionDirector:true,exceptionMentor:true},'director');}}assert.equal(s.pairs.at(-1).status,'presented');});
test('weekends and explicit holidays are excluded from deadline',()=>{assert.equal(addWorkingDays('2026-10-09',10),'2026-10-23');assert.equal(addWorkingDays('2026-10-09',10,['2026-10-12']),'2026-10-26');});
test('out of period plan tasks are rejected',()=>{const s=assigned();assert.throws(()=>t(s,'plan-item',{id:s.pairs[0].id,task:'Т',due:'2027-01-01',support:'П',expected:'Р',evidence:'Д'},'mentor'),/период/);});
test('editing approved plan invalidates both consents and retains history',()=>{const s=active(),id=s.pairs[0].id;const next=t(s,'plan-save',{id,goal:'Другая цель',frequency:'Раз в неделю',format:'Онлайн'},'mentor');assert.equal(next.pairs[0].status,'planning');assert.equal(next.pairs[0].plan.approved,false);assert.deepEqual(next.pairs[0].plan.consents,{mentor:false,mentee:false});assert.equal(next.pairs[0].planHistory[0].approved,true);assert.throws(()=>t(next,'plan-approve',{id},'director'),/согласия/);});
test('completion requires final feedback from both participants',()=>{let s=active(),id=s.pairs[0].id;assert.throws(()=>t(s,'pair-complete',{id},'director'),/итоговый/i);s=t(s,'evaluation-save',{id,stage:'final',text:'Задача выполнена'},'mentor');s=t(s,'evaluation-save',{id,stage:'final',text:'Освоены критерии'},'mentee');s=t(s,'pair-complete',{id},'director');assert.equal(summary(s).completed,1);});
test('meeting dates must lie inside program',()=>{const s=active();assert.throws(()=>t(s,'meeting-add',{id:s.pairs[0].id,date:'2027-01-01',format:'Очный',result:'Встреча'},'mentor'),/период/);});
test('visit preparation, timestamped observation and shared reflection',()=>{let s=active(),id=s.pairs[0].id;const prep={id,purpose:'Вовлеченность',course:'SE',topic:'Критерии',time:'15:00',location:'Демо',lessonType:'Семинар',objectives:'Цель',outcomes:'Результат',group:'Группа',focus:'Активность',students:12,date:'2026-10-20',criteriaShared:true};s=t(s,'visit-prepare',prep,'mentor');const visitId=s.pairs[0].visits[0].id;assert.throws(()=>t(s,'visit-reflect',{id,visitId},'mentee'),/факты/);assert.throws(()=>t(s,'visit-observe',{id,visitId,timestamp:'12:99'},'mentor'),/Таймкод/);s=t(s,'visit-observe',{id,visitId,timestamp:'12:30',teacherAction:'Задал вопрос',studentAction:'Обсуждают',criterion:'Активность'},'mentor');const ref={id,visitId,selfAnalysis:'Я заметил',plus:'Работа в парах',question:'Как вовлечь всех?',recommendation:'Новые роли',change:'Роли в группе',measurement:'Число участников',observerReflection:'Положительный эффект',shared:true};s=t(s,'visit-reflect',ref,'mentee');assert.equal(s.pairs[0].visits[0].status,'complete');});
test('enrollment is unique ignoring case and respects capacity',()=>{let s=initialState();s.events[0].capacity=1;s=t(s,'event-enroll',{id:'e1',name:'Демо'});assert.throws(()=>t(s,'event-enroll',{id:'e1',name:'демо'}),/уже записаны/);assert.throws(()=>t(s,'event-enroll',{id:'e1',name:'Другой'}),/мест нет/);});
test('replacement closes existing pair and reopens request while retaining history',()=>{let s=active(),id=s.pairs[0].id;s=t(s,'change-request',{id,type:'replacement',reason:'Изменился запрос'},'mentee');s=t(s,'change-resolve',{id,changeId:s.pairs[0].changeRequests[0].id,reason:'Подобрать новую экспертизу',end:true},'director');assert.equal(s.pairs[0].status,'ended');assert.equal(s.requests[0].status,'submitted');assert.ok(s.pairs[0].plan.items.length);});
test('summary never returns private observations or reflection',()=>{const s=active();s.pairs[0].visits=[{private:'SECRET'}];s.pairs[0].evaluations={final:{mentor:'SECRET'}};assert.ok(!JSON.stringify(summary(s)).includes('SECRET'));});

test('plan return requires a comment and invalidates version consents',()=>{
  let s=assigned(),id=s.pairs[0].id;
  s=t(s,'plan-save',{id,goal:'Цель',frequency:'Раз в неделю',format:'Очный'},'mentor');
  s=t(s,'plan-item',{id,task:'Задача',due:'2026-11-01',support:'Помощь',expected:'Итог',evidence:'Документ'},'mentor');
  s=t(s,'plan-consent',{id},'mentor');s=t(s,'plan-consent',{id},'mentee');
  assert.throws(()=>t(s,'plan-return',{id},'director'),/Комментарий/);
  s=t(s,'plan-return',{id,reason:'Уточнить измеримый результат'},'director');
  assert.equal(s.pairs[0].plan.returns[0].reason,'Уточнить измеримый результат');
  assert.throws(()=>t(s,'plan-approve',{id},'director'),/согласия/);
});
test('meeting requires the other participant and cannot be confirmed twice',()=>{
  let s=active(),id=s.pairs[0].id;
  s=t(s,'meeting-add',{id,date:'2026-10-20',format:'Очный',result:'Обсудили рубрику'},'mentor');
  const meetingId=s.pairs[0].meetings[0].id;
  assert.throws(()=>t(s,'meeting-confirm',{id,meetingId},'mentor'),/второй участник/);
  assert.throws(()=>t(s,'meeting-confirm',{id,meetingId},'director'),/участникам/);
  s=t(s,'meeting-confirm',{id,meetingId},'mentee');
  assert.equal(s.pairs[0].meetings[0].confirmedBy,'mentee');
  assert.throws(()=>t(s,'meeting-confirm',{id,meetingId},'mentee'),/уже подтверждена/);
});
test('invalid calendar dates produce validation errors',()=>{
  assert.throws(()=>addWorkingDays('2026-99-01',10),/Некорректная дата/);
  assert.throws(()=>addWorkingDays('2026-02-30',10),/Некорректная дата/);
});
