import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const source=resolve(fileURLToPath(new URL('..',import.meta.url)));
const repo=resolve(process.argv[2]||'.');
const files=['app/page.jsx','app/game/page.jsx','app/game/game.css','app/game/academy.css','app/training/layout.jsx','lib/academy-data.js'];
try{execFileSync('git',['rev-parse','--show-toplevel'],{cwd:repo,stdio:'pipe'});}catch{console.error('ERROR: Run from inside your local fmflight Git repository, or supply its path.');process.exit(1)}
const originalBlob='dba7789ef0bba638fc8c4f3a7a89ba2d98f3ec9a';
const trainingPath=join(repo,'app/training/page.jsx');
let original='';
try{original=execFileSync('git',['show',originalBlob],{cwd:repo,encoding:'utf8',maxBuffer:5*1024*1024});}catch{
  // Fall back to walking page history if Git garbage collection removed the blob.
  try{
    const revisions=execFileSync('git',['log','--format=%H','--all','--','app/page.jsx'],{cwd:repo,encoding:'utf8'}).trim().split('\n');
    for(const rev of revisions){try{const candidate=execFileSync('git',['show',`${rev}:app/page.jsx`],{cwd:repo,encoding:'utf8',maxBuffer:5*1024*1024});if(candidate.includes('function FMJourney')&&candidate.includes("'use client'")){original=candidate;break;}}catch{}}
  }catch{}
}
if(!original.includes('function FMJourney')){
  console.error('ERROR: Could not locate the original FM Journey page in Git history. No files changed.');
  console.error('Please ensure this is the original kmetz-erau/fmflight clone with its history (not a shallow download).');
  process.exit(1);
}
for(const path of files){const from=join(source,path),to=join(repo,path);if(!existsSync(from))throw Error('Missing package file '+path);mkdirSync(resolve(to,'..'),{recursive:true});copyFileSync(from,to);console.log('Installed '+path)}
mkdirSync(resolve(trainingPath,'..'),{recursive:true});
if(existsSync(trainingPath)){
 const current=readFileSync(trainingPath,'utf8');
 if(!current.includes('function FMJourney')){writeFileSync(trainingPath,original);console.log('Restored original app/training/page.jsx');}
 else console.log('Kept existing original app/training/page.jsx');
}else{writeFileSync(trainingPath,original);console.log('Restored original app/training/page.jsx');}
console.log('\nDone. Run npm run build, then git add app lib && git commit && git push.');
