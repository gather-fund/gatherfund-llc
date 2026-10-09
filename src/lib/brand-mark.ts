import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// The brand mark as a data URI, for images rendered with next/og at build time.
export async function brandMarkDataUri(): Promise<string> {
  const svg = await readFile(join(process.cwd(), 'public/assets/gatherfund-icon.svg'));
  return `data:image/svg+xml;base64,${svg.toString('base64')}`;
}
