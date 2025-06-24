import { defineConfig, mergeConfig } from 'vitest/config';
import conf from './vite.config';

export default mergeConfig(
    conf,
    defineConfig({
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/__test__/setUp.ts'],
            coverage: {
                include: ['src'],
            },
        },
    }),
);
