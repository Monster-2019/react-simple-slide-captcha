import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

function insertConsoleLog() {
    return {
        name: 'insert-console-log',
        renderChunk(code: any, chunk: any, options: any, meta: any) {
            return {
                code: `import "./style.css";` + code
            }
        }
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, './lib/index.ts'),
            name: 'react-simple-slide-captcha',
            formats: ['es'],
            fileName: format => `index.${format}.js`
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            },
            plugins: [insertConsoleLog()]
        }
    },
    plugins: [
        react(),
        dts({ rollupTypes: true, include: ['./lib'], tsconfigPath: './tsconfig.app.json' }),
        svgr()
    ]
})
