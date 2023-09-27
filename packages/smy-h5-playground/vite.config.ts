import { copyFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { ensureDirSync } from 'fs-extra'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createVuePlugin({
      include: [/\.vue$/],
      jsx: true,
    }),
    copyDependencies(),
  ],
  build: {
    outDir: 'site',
  },
})

const toPath = (path: string) => fileURLToPath(new URL(path, import.meta.url))

function copyDependencies() {
  return {
    name: 'copy-varlet-dependencies',
    buildStart() {
      ensureDirSync('./public')
      copyFileSync(toPath('../smy-h5-ui/es/smy.esm.js'), toPath('./public/smy.esm.js'))
      copyFileSync(toPath('../smy-h5-ui/es/style.css'), toPath('./public/smy.css'))
      copyFileSync(toPath('../smy-h5-touch-emulator/iife.js'), toPath('./public/smy-touch-emulator.js'))
    },
  }
}
