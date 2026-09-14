import fs from 'fs';
import path from 'path';

let filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node get_splats.js <file_path>');
  process.exit(1);
}

filePath = path.normalize(filePath);

if (!fs.existsSync(filePath)) {
  console.error(`Error: File does not exist: ${filePath}`);
  process.exit(1);
}

if (!fs.statSync(filePath).isFile()) {
  console.error(`Error: Path is not a regular file: ${filePath}`);
  process.exit(1);
}

const data = fs.readFileSync(filePath, 'utf-8');

let out = [];
let lines = data.split('\n');
for (let line of lines) {
  if (line.includes('splatSource:')) {
    out.push(line.trim());
  }
}
console.log(out.join('\n'));
