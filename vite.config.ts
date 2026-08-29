import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ylk0tk34'

    return {
        plugins: [
            react(),
        ],
        envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
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
            rolldownOptions: {
                output: {
                    manualChunks(id) {
                        if (!id.includes('/node_modules/')) return

                        if (['react', 'react-dom', 'react-router', 'react-router-dom'].some(
                            (dependency) => id.includes(`/node_modules/${dependency}/`),
                        )) {
                            return 'vendor'
                        }

                        if (['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'].some(
                            (dependency) => id.includes(`/node_modules/${dependency}/`),
                        )) {
                            return 'ui'
                        }
                    },
                },
            },
        },
    }
})
