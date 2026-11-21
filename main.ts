import { cp, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const root = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
await mkdir(output, { recursive: true });
await cp(resolve(root, 'game'), resolve(output, 'game'), { recursive: true, force: true });
await cp(resolve(root, 'screenshots'), resolve(output, 'screenshots'), { recursive: true, force: true });
const dossierBytes = buildDossier(output, { text_max_bytes: 163840 });
await writeFile(resolve(output, 'dossier.json'), dossierBytes);
