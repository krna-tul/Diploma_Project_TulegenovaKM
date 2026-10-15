import {readdir, readFile, access} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
let failures=0, checked=0;
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  if(['.git','node_modules'].includes(entry.name))continue;
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){await walk(file);continue;}
  if(!file.endsWith('.md'))continue;
  const content=await readFile(file,'utf8');
  for(const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){
    const target=match[1].split('#')[0];
    if(!target||/^[a-z]+:/i.test(target))continue;
    checked++;
    try{await access(path.resolve(path.dirname(file),decodeURIComponent(target)));}
    catch{console.error(`${path.relative(root,file)}: missing ${target}`);failures++;}
  }
}}
await walk(root);
console.log(`Local documentation links: ${checked}; missing: ${failures}`);
process.exitCode=failures?1:0;
