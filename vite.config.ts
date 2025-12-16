import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const PACKAGE_NAME = 'types-storage';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: 'lib/index.ts',
      fileName: (format) => `${PACKAGE_NAME}.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
  },
});
