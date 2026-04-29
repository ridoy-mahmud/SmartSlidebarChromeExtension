import fs from 'fs';
import { execSync } from 'child_process';

execSync('npx --yes sharp-cli@3.0.0 resize 48 48 -i icon.svg -o icon48.png');
const base64 = fs.readFileSync('icon48.png', 'base64');
console.log('BASE64_START' + base64 + 'BASE64_END');
