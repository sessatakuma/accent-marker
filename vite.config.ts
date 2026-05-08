import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const DEFAULT_DEV_MARK_ACCENT_PROXY_TARGET = 'https://accent-marker.hsichen.dev';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const devMarkAccentProxyTarget =
        env.VITE_MARK_ACCENT_API_URL?.trim() || DEFAULT_DEV_MARK_ACCENT_PROXY_TARGET;

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
                    target: devMarkAccentProxyTarget,
                    changeOrigin: true,
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
