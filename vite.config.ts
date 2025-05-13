import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'lib/index.ts',
      fileName: (format) => `types-storage.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
