import {defineConfig} from 'vite';

// Private organizer inputs and backend artifacts must never be served by Vite.
export default defineConfig({
  // GitHub Actions supplies the Pages project path; local development stays at /.
  base: process.env.PAGES_BASE_PATH || '/',
  server: {fs: {deny: [
    '.env', '.env.*', '*.{crt,pem}', '**/.git/**',
    '**/*.csv', '**/*.tsv', '**/*.xlsx', '**/*.xls',
    '**/outputs/**', '**/apps-script/**', '**/docs/**', '**/materials/**',
  ]}},
});
