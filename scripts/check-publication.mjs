import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {publicationFiles} from './publication-files.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const allowed = new Set(publicationFiles);
const findings = [];
async function walk(dir) {
  return (await Promise.all((await fs.readdir(path.join(root, dir), {withFileTypes:true})).map(
    entry => entry.isDirectory() ? walk(dir + '/' + entry.name) : [dir + '/' + entry.name],
  ))).flat();
}
function inspect(name, bytes) {
  if (/\.(?:webp|mp4)$/.test(name)) return; // Media receives separate visual review.
  const value = bytes.toString('utf8');
  const rules = [
    ['invitation token', /\b[a-f0-9]{64}\b/i],
    ['bank account', /\b[A-Z]{2}\s?\d{2}(?:[\s-]?[A-Z0-9]){11,30}\b/],
    ['credential', /(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AIza[\w-]{30,})/],
    ['private workbook reference', /docs\.google\.com\/spreadsheets\/d\//],
  ];
  for (const [label, expression] of rules) if (expression.test(value)) findings.push(name + ': ' + label);
}
const dist = process.argv.includes('--dist');
const files = dist ? await walk('dist') : publicationFiles;
for (const name of files) {
  if (dist && !/^dist\/(?:index\.html|assets\/[\w.-]+\.(?:js|css)|venue\/[\w.-]+\.(?:webp|mp4))$/.test(name)) findings.push(name + ': unexpected deployment file');
  inspect(name, await fs.readFile(path.join(root,name)));
}
if (!dist) {
  for (const name of await walk('public')) if (!allowed.has(name)) findings.push(name + ': unreviewed public asset');
}
if (process.argv.includes('--staged')) {
  const names = execFileSync('git',['diff','--cached','--name-only','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
  for (const name of names) {
    if (!allowed.has(name)) findings.push(name + ': outside publication list');
    if (!/\.(?:webp|mp4)$/.test(name)) inspect(name, execFileSync('git',['show',':' + name],{cwd:root,maxBuffer:16*1024*1024}));
  }
}
if (findings.length) {
  console.error('Publication check failed (values withheld):\n' + findings.join('\n'));
  process.exitCode = 1;
} else console.log(`Publication check passed: ${files.length} ${dist ? 'deployment' : 'reviewed source'} files; no detected tokens, account numbers, credentials or workbook URLs. Visual/media and private-value checks remain separate.`);
