import {readFile,writeFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../data/legal.json',import.meta.url),'utf8'));
await writeFile(new URL('../public/legal-data.js',import.meta.url),'// Generated from data/legal.json — run npm run build after edits.\nglobalThis.HK_LEGAL = '+JSON.stringify(data)+';\n');
