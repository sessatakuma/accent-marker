import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        resolve: {
            alias: {
                components: '/src/components',
                utilities: '/src/utilities',
            },
        },
        server: {
            port: 3000,
            open: true,
            proxy: {
                '/api/mark-accent': {
                    target: 'https://api.sessatakuma.dev',
                    changeOrigin: true,
                    rewrite: path => path.replace('/api/mark-accent', '/api/MarkAccent/'),
                    headers: env.MARK_ACCENT_API_KEY
                        ? { 'X-API-KEY': env.MARK_ACCENT_API_KEY }
                        : undefined,
                },
            },
        },
        build: {
            outDir: 'dist',
            chunkSizeWarningLimit: 1000, // Export libs (jspdf+deps) are large but lazy-loaded
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('scheduler')) {
                                return 'vendor-react';
                            }
                            // jspdf + html-to-image + their deps (canvg, dompurify, html2canvas)
                            // These are lazy-loaded together when user exports
                            if (
                                id.includes('jspdf') ||
                                id.includes('canvg') ||
                                id.includes('dompurify') ||
                                id.includes('html2canvas') ||
                                id.includes('html-to-image')
                            ) {
                                return 'vendor-export';
                            }
                            if (id.includes('lucide')) {
                                return 'vendor-icons';
                            }
                        }
                    },
                },
            },
        },
    };
});
