import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const arg = (process.argv[2] || '').toLowerCase();

// Map release aliases
let releaseType = arg;
if (releaseType === 'feature') {
  releaseType = 'minor';
}

const validTypes = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];

if (!validTypes.includes(releaseType)) {
  console.error(`\x1b[31mError:\x1b[0m Invalid or missing release type "${arg}".\n`);
  console.log('Usage:');
  console.log('  npm run bump <minor|feature|major|patch>');
  console.log('\nOr use shortcut commands:');
  console.log('  npm run bump:patch    (e.g. 0.0.1 -> 0.0.2)');
  console.log('  npm run bump:minor    (e.g. 0.0.1 -> 0.1.0)');
  console.log('  npm run bump:feature  (alias for minor: 0.0.1 -> 0.1.0)');
  console.log('  npm run bump:major    (e.g. 0.0.1 -> 1.0.0)');
  process.exit(1);
}

try {
  console.log(`Bumping version (${arg === 'feature' ? 'feature -> minor' : releaseType})...`);
  const output = execSync(`npm version ${releaseType}`, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit']
  });
  const newVersion = output.trim();
  console.log(`\x1b[32m✔ Version successfully bumped to ${newVersion}\x1b[0m`);
  console.log(`\nNext steps:`);
  console.log(`  1. Push commits and tags: git push && git push --tags`);
  console.log(`  2. Publish to npm:        npm run publish:npm`);
} catch (err) {
  console.error('\x1b[31mFailed to bump version:\x1b[0m', err.message);
  process.exit(1);
}
