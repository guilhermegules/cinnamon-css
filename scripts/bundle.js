import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Order of CSS files to concatenate
const files = [
  'src/tokens/colors.css',
  'src/tokens/typography.css',
  'src/tokens/elevation.css',
  'src/base/reset.css',
  'src/base/layout.css',
  'src/components/window.css',
  'src/components/panel.css',
  'src/components/menu.css',
  'src/components/buttons.css',
  'src/components/switch.css',
  'src/components/forms.css',
  'src/components/tabs.css',
  'src/components/sidebar.css',
  'src/components/dialogs.css',
  'src/components/lists.css'
];

let bundleContent = `/**\n * Cinnamon CSS v0.1.0\n * Linux Mint Cinnamon & Mint-Y Design System for the Web\n * License: MIT\n */\n\n`;

for (const relPath of files) {
  const fullPath = path.resolve(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Remove @import statements
    content = content.replace(/@import\s+['"][^'"]+['"];?\n?/g, '');
    bundleContent += `/* --- ${relPath} --- */\n` + content + '\n\n';
  } else {
    console.warn(`Warning: File not found: ${fullPath}`);
  }
}

// Write unminified dist
const outCss = path.resolve(distDir, 'cinnamon.css');
fs.writeFileSync(outCss, bundleContent, 'utf8');
console.log(`Generated: ${outCss} (${(bundleContent.length / 1024).toFixed(2)} KB)`);

// Simple minification (strip comments and whitespace)
const minified = bundleContent
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([:;{}])\s*/g, '$1')
  .trim();

const outMinCss = path.resolve(distDir, 'cinnamon.min.css');
fs.writeFileSync(outMinCss, minified, 'utf8');
console.log(`Generated: ${outMinCss} (${(minified.length / 1024).toFixed(2)} KB)`);

// Copy JS companion
const srcJs = path.resolve(rootDir, 'src/js/cinnamon.js');
const outJs = path.resolve(distDir, 'cinnamon.js');
if (fs.existsSync(srcJs)) {
  fs.copyFileSync(srcJs, outJs);
  console.log(`Copied: ${outJs}`);
}
