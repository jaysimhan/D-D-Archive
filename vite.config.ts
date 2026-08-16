import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ylk0tk34'

    return {
        plugins: [
            react(),
            nodePolyfills({
                // Whether to polyfill `node:` protocol imports.
                protocolImports: true,
            }),
        ],
        server: {
            proxy: {
                // Sanity's CORS allow-list only covers a couple of localhost
                // ports, and the dev server rarely lands on a free one. Proxying
                // keeps content queries same-origin so any port works.
                // See the matching apiHost override in src/lib/sanity.ts.
                '/sanity': {
                    target: `https://${projectId}.apicdn.sanity.io`,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/sanity/, ''),
                },
            },
        },
        build: {
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom', 'react-router-dom'],
                        ui: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
                    },
                },
            },
        },
    }
})
