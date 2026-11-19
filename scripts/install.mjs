import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(here, '..');
const target = path.resolve(process.argv[2] || process.cwd());
const packageFile = path.join(target, 'package.json');
if (!fs.existsSync(packageFile) || !fs.existsSync(path.join(target, 'app', 'page.jsx'))) {
  console.error('Target must be the FM Flight Next.js repository root with app/page.jsx.');
  process.exit(1);
}
const original = path.join(target, 'app', 'page.jsx');
const training = path.join(target, 'app', 'training', 'page.jsx');
const current = fs.readFileSync(original, 'utf8');
if (!current.includes("redirect('/game')")) {
  if (fs.existsSync(training)) {
    console.error('app/training/page.jsx already exists. Move or back it up before installing.');
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(training), { recursive: true });
  fs.copyFileSync(original, training);
  console.log('Preserved original homepage at /training');
} else if (!fs.existsSync(training)) {
  console.error('Homepage already redirects but /training is missing. Restore the original app/page.jsx before installing.');
  process.exit(1);
}
for (const relative of ['app/page.jsx', 'app/game/page.jsx', 'app/game/game.css', 'lib/game-data.js']) {
  const dst = path.join(target, relative);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(path.join(source, relative), dst);
  console.log('Installed ' + relative);
}
console.log('Ready. Run npm run dev, then open / and /training. Commit changes and deploy to Vercel.');
