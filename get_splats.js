import fs from 'fs';
const data = fs.readFileSync('/tmp/file_attachments/splat-dive (1)/src/lib/splatData.ts', 'utf-8');

let out = [];
let lines = data.split('\n');
for (let line of lines) {
  if (line.includes('splatSource:')) {
    out.push(line.trim());
  }
}
console.log(out.join('\n'));
