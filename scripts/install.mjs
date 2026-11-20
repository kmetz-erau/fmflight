import {readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync} from 'node:fs';
import {resolve, join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const source = resolve(fileURLToPath(new URL('..', import.meta.url)));
const repo = resolve(process.argv[2] || '.');
const data = join(repo,'lib/academy-data.js');
const css = join(repo,'app/quest/quest.css');
if (!existsSync(data) || !existsSync(css)) {console.error('Cannot find FM Flight project files. Pass the path to your local repository.');process.exit(1)}
const original=readFileSync(data,'utf8');
if (!original.includes('export const MISSIONS') || !original.includes('export const TRADES')) {console.error('Unexpected academy-data.js format; refusing to overwrite.');process.exit(1)}
const newData=readFileSync(join(source,'lib/academy-data.js'),'utf8');
const oldCss=readFileSync(css,'utf8');
const cssPatch=readFileSync(join(source,'workorders.css'),'utf8');
const backupDir=join(repo,'.fmflight-backups');mkdirSync(backupDir,{recursive:true});
const stamp=Date.now();
copyFileSync(data,join(backupDir,`academy-data-${stamp}.js`));
copyFileSync(css,join(backupDir,`quest-${stamp}.css`));
writeFileSync(data,newData);
writeFileSync(css,oldCss.includes('FMFLIGHT_WORKORDER_DISPLAY_V2')?oldCss:oldCss+'\n'+cssPatch);
console.log('Installed realistic work orders in lib/academy-data.js and ticket styling in app/quest/quest.css.');
console.log('VERIFY: grep -n FMFLIGHT_REALISTIC_WORKORDERS_V1 lib/academy-data.js');
console.log('VERIFY: grep -n FMFLIGHT_WORKORDER_DISPLAY_V2 app/quest/quest.css');
console.log('Then npm run build, git add lib/academy-data.js app/quest/quest.css, commit, and push.');
