(function(root){
const words=s=>new Set((s.toLowerCase().replace(/ß/g,'ss').replace(/ς/g,'σ').match(/[\p{L}\p{N}_]+/gu)||[]));
function jac(a,b){a=words(a);b=words(b);let common=0;for(const w of a)if(b.has(w))common++;return a.size+b.size-common?common/(a.size+b.size-common):0;}
function dot(a,b){let sum=0;for(const k in a)sum+=a[k]*(b[k]||0);return sum;}
function score(m,s,c){const a=dot(s.vector,c.contentVector),b=dot(s.vector,c.titleVector);const features=[a,b,Math.min(a,b),jac(c.content,s.label),jac(c.title,s.label)];const z=features.reduce((v,x,i)=>v+(x-m.mean[i])/m.scale[i]*m.coef[i],m.intercept);const probability=1/(1+Math.exp(-z));return {features,probability,match:probability>=m.threshold};}
root.Matching={score,jac,dot};if(typeof module!=='undefined')module.exports=root.Matching;
})(globalThis);
