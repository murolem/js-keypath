/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
    ],
    clearScreen: false,
    test: {
        typecheck: {
            // enabled: true,
            ignoreSourceErrors: true,
            // include: [
            //     '**/*.{test,spec}-d.?(c|m)[jt]s?(x)',
            //     '**/*.{test,spec}.?(c|m)[jt]s?(x)'
            // ]
        }
    }
});