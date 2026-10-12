import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const demoDir = path.resolve(rootDir, 'demo');
const distCssPath = path.resolve(rootDir, 'dist/cinnamon.css');

console.log('Building Cinnamon CSS library...');
execSync('node scripts/bundle.js', { cwd: rootDir, stdio: 'inherit' });

const targetCssPath = path.resolve(demoDir, 'cinnamon.css');
fs.copyFileSync(distCssPath, targetCssPath);
console.log(`Copied: ${distCssPath} -> ${targetCssPath}`);
