import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(process.argv[2] || '.');
const target = join(root, 'lib/academy-data.js');
const patch = join(resolve(fileURLToPath(new URL('.', import.meta.url))), 'workorder-patch.txt');
if (!existsSync(target)) throw new Error(`Cannot find ${target}. Run against the fmflight repository.`);
const old = readFileSync(target, 'utf8');
const start = '// FMFLIGHT_REALISTIC_WORKORDERS_V1';
const end = '// END_FMFLIGHT_REALISTIC_WORKORDERS_V1';
let cleaned = old;
if (cleaned.includes(start)) {
  const a = cleaned.indexOf(start), b = cleaned.indexOf(end, a);
  if (b < 0) throw new Error('Existing patch marker is incomplete; refusing to modify.');
  cleaned = cleaned.slice(0, a).trimEnd() + '\n' + cleaned.slice(b + end.length).trimStart();
}
if (!cleaned.includes('export const MISSIONS=')) throw new Error('Expected MISSIONS export not found; refusing to modify.');
copyFileSync(target, `${target}.before-realistic-workorders.bak`);
writeFileSync(target, cleaned.trimEnd() + '\n\n' + readFileSync(patch, 'utf8'));
console.log('Updated 12 AI Quest work orders. Backup saved alongside academy-data.js.');
