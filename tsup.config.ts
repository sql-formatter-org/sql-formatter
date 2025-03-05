import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/dialect.ts', 'src/languages/*/index.ts'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  dts: true,
});
