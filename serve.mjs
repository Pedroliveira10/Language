import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = join(projectRoot, 'src');
const publicRoot = join(projectRoot, 'public');
const assetsRoot = join(publicRoot, 'assets');
const allowedExtensions = new Set(['.js', '.json', '.css', '.md']);

function extension(path) {
  const match = path.match(/\.[^.\\/]+$/);
  return match?.[0]?.toLowerCase() || '';
}

async function copySourceDirectory(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) await copySourceDirectory(from, to);
    else if (allowedExtensions.has(extension(entry.name))) {
      await mkdir(dirname(to), { recursive: true });
      await copyFile(from, to);
    }
  }
}

await mkdir(publicRoot, { recursive: true });
await copyFile(join(sourceRoot, 'index.html'), join(publicRoot, 'index.html'));
await copyFile(
  join(sourceRoot, 'index.html'),
  join(publicRoot, 'dutch_polish_portuguese_mobile_learning_studio.html')
);
await copySourceDirectory(sourceRoot, assetsRoot);
console.log('Built the public entry points and public/assets from src.');

