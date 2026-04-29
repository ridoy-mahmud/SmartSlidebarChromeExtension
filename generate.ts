import fs from 'fs';
import { execSync } from 'child_process';

execSync('npx --yes sharp-cli@3.0.0 -i icon.svg -o icon.png');
const base64 = fs.readFileSync('icon.png', 'base64');
console.log('BASE64_START' + base64 + 'BASE64_END');
