from pathlib import Path
import json, os
ROOT=Path(__file__).resolve().parent
os.chdir(ROOT/'data')
n=json.loads((ROOT/'data/UniSkill_LogisticRegression.ipynb').read_text())
for i in [1,3,5,7,9]:
    exec(compile(''.join(n['cells'][i]['source']),f'cell_{i}','exec'))
def sparse(v):
    return {str(int(i)):float(x) for i,x in zip(v.indices,v.data)}
skill_rows=df.drop_duplicates(['skill_label','skill_description'])
course_rows=df.drop_duplicates(['course_title','matched_course_sentence'])
export={'threshold':float(threshold),'mean':model[0].mean_.tolist(),'scale':model[0].scale_.tolist(),'coef':model[1].coef_[0].tolist(),'intercept':float(model[1].intercept_[0]),'skills':[], 'courses':[], 'metrics':results[0]}
for k,(i,r) in enumerate(skill_rows.iterrows()):
    export['skills'].append({'id':k,'label':r.skill_label,'description':r.skill_description,'vector':sparse(skills.getrow(i))})
for k,(i,r) in enumerate(course_rows.iterrows()):
    export['courses'].append({'id':k,'title':r.course_title,'content':r.matched_course_sentence,'titleVector':sparse(titles.getrow(i)),'contentVector':sparse(sentences.getrow(i)),'mentor':k%3})
(ROOT/'../../src/prototype/matching/model.json').write_text(json.dumps(export,separators=(',',':')))
fixtures=[]
for i in test_idx[:30]:
    fixtures.append({'skillVector':sparse(skills.getrow(i)),'titleVector':sparse(titles.getrow(i)),'contentVector':sparse(sentences.getrow(i)),'skill':df.iloc[i].skill_label,'title':df.iloc[i].course_title,'content':df.iloc[i].matched_course_sentence,'features':X[i].tolist(),'probability':float(model.predict_proba(X[i:i+1])[0,1])})
(ROOT/'fixtures.json').write_text(json.dumps(fixtures))
import joblib
joblib.dump({'vectorizer':vectorizer,'model':model,'threshold':threshold},ROOT/'model.joblib')
print('EXPORTED',len(export['skills']),len(export['courses']))
