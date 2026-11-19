import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const repo = resolve(process.argv[2] || '.');
const target = join(repo, 'app/training/page.jsx');
const blob = 'dba7789ef0bba638fc8c4f3a7a89ba2d98f3ec9a';
function git(...args) { return execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }); }
try {
  const root = resolve(git('rev-parse', '--show-toplevel').trim());
  if (root !== repo) throw new Error('Use the root of the fmflight Git repository.');
  let original;
  try { original = git('show', blob); } catch {
    const commits = git('log', '--all', '--format=%H', '--', 'app/page.jsx').trim().split('\n');
    for (const commit of commits) {
      try {
        const content = git('show', `${commit}:app/page.jsx`);
        if (content.includes('function FMJourney') && content.length > 30000) { original = content; break; }
      } catch {}
    }
  }
  if (!original || original.length < 30000 || !original.includes('function FMJourney')) {
    throw new Error('Original full training source not found in local Git history. No changes made. Clone the full repository (not a shallow or ZIP download) and retry.');
  }
  mkdirSync(join(repo, 'app/training'), { recursive: true });
  if (existsSync(target)) writeFileSync(`${target}.pre-restore-backup`, readFileSync(target));
  writeFileSync(target, original);
  const layout = `export default function TrainingLayout({ children }) {\n  return (\n    <>\n      <nav aria-label="Training navigation" style={{position:'sticky',top:0,zIndex:1000,display:'flex',gap:12,alignItems:'center',padding:'12px 20px',background:'#0e2333',borderBottom:'1px solid #426275'}}>\n        <a href="/game?chooseTrade=1" style={{display:'inline-block',background:'#5de1aa',color:'#092c2d',padding:'10px 17px',borderRadius:9,fontWeight:800,textDecoration:'none'}}>Home / Choose trade</a>\n        <span style={{color:'#e3f5ff',fontSize:14}}>Original FM Journey Training</span>\n      </nav>\n      {children}\n    </>\n  );\n}\n`;
  writeFileSync(join(repo, 'app/training/layout.jsx'), layout);
  console.log(`Restored the full original training page (${original.length} characters).`);
  console.log('Kept the new Academy and homepage unchanged.');
  console.log('Next: npm run build; git add app/training/page.jsx app/training/layout.jsx; git commit -m "Restore full original FM Journey"; git push');
} catch (error) { console.error('RESTORE FAILED:', error.message); process.exitCode = 1; }
