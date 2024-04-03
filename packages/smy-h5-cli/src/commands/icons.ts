import { ensureDir, removeSync, readdirSync, writeFile, readFile, mkdir, remove } from 'fs-extra'
import { getSmyConfig } from '../config/smyConfig'
import {
  ICONS_STYLE_DIR,
  ICONS_DIST_DIR,
  ICONS_FONT_DIR,
  ICONS_PNG_DIR,
  ICONS_SVG_DIR,
  ICONS_SVG_DIR_NAME,
} from '../shared/constant'
import webfont from 'webfont'
import { resolve } from 'path'
import logger from '../shared/logger'
import { camelCase, upperFirst } from 'lodash'
import { compileSFCFile } from '../compiler/compileSFC'
import { tsc } from '../compiler/compileScript'

async function removeDir() {
  removeSync(ICONS_DIST_DIR)
  await Promise.all([ensureDir(ICONS_FONT_DIR), ensureDir(ICONS_STYLE_DIR), ensureDir(ICONS_PNG_DIR)])
}

function buildWebFont(name: string) {
  return webfont({
    files: `${ICONS_SVG_DIR_NAME}/*.svg`,
    fontName: name,
    formats: ['ttf'],
    fontHeight: 512,
    descent: 64,
  })
}

// async function buildPng(svgFiles: string[]) {
//   return await Promise.all(svgFiles.map((svg) => {
//     return new Promise(resolve => {
//       const {name} = parse(svg)
//       // sharp
//     })
//   }))
// }

async function generateIndex(names: string[], indexExt: string, componentExt: string, outPath: string) {
  const exportsStmts =
    names.map((name) => `export {default as ${name} } from './${name}${componentExt}'`).join('\n') + '\n'

  await writeFile(resolve(outPath, `index${indexExt}`), exportsStmts)
}

async function generateAsyncIndex(names: string[], indexExt: string, componentExt: string, outPath: string) {
  const exportsStmts =
    names.map((name) => `export const ${name} = () => import('./${name}${componentExt}')`).join('\n') + '\n'

  await writeFile(resolve(outPath, `async-index${indexExt}`), exportsStmts)
}

async function buildComponents() {
  const svgFiles = readdirSync(ICONS_SVG_DIR)
  const TEMP_DIR_NAME = '_vue'
  const tempPath = resolve(ICONS_DIST_DIR, TEMP_DIR_NAME)
  await mkdir(tempPath)
  const paths: string[] = []
  const names: string[] = []
  await Promise.all(
    svgFiles.map(async (svgFile) => {
      const index = svgFile.indexOf('.')
      const name = svgFile.slice(0, index)
      const componentName = upperFirst(camelCase(name))
      const file = await readFile(resolve(ICONS_SVG_DIR, svgFile), 'utf-8')

      const vueTemplate = `\
<template>
  ${file}
</template>
<script>
export default { name: "${componentName}" }
</script>
`
      const path = resolve(tempPath, `${componentName}.vue`)
      await writeFile(path, vueTemplate)
      paths.push(path)
      names.push(componentName)
    }),
  )
  await generateIndex(names, '.js', '', tempPath)
  await generateAsyncIndex(names, '.js', '', tempPath)

  await Promise.all(paths.map((path) => compileSFCFile(path)))

  const compilerOptionsBase = {
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'node',
    target: 'ES5',
    lib: ['ESNext', 'DOM'],
    allowJs: true,
    checkJs: false,
  }

  await tsc({
    include: [`${tempPath}/**/*`],
    compilerOptions: {
      ...compilerOptionsBase,
      outDir: `${ICONS_DIST_DIR}/lib`,
      module: 'CommonJS',
    },
  })
  await tsc({
    include: [`${tempPath}/**/*`],
    compilerOptions: {
      ...compilerOptionsBase,
      outDir: `${ICONS_DIST_DIR}/es`,
      module: 'ESNext',
    },
  })

  await remove(tempPath)
}

// [Unicode4.0规范](http://www.unicode.org/versions/Unicode4.0.1/)
export async function icons() {
  try {
    const smyConfig = getSmyConfig()
    const {
      name,
      namespace,
      base64 = true,
      fontFamilyClassName,
      fontWeight = 'normal',
      publicPath,
      fontStyle = 'normal',
    } = smyConfig?.icons ?? {}

    await removeDir()

    const { ttf, glyphsData } = await buildWebFont(name!)
    const icons = glyphsData?.map((item) => ({
      name: item.metadata!.name,
      pointCode: item.metadata!.unicode![0].charCodeAt(0).toString(16),
    }))

    if (!ttf || !icons) {
      throw new Error('[@smy-h5/cli]: build:icon')
    }

    const cssTemplate = `\
@font-face {
  font-family: "${name}";
  src: url("${
    base64 || !publicPath
      ? `data:font/truetype;charset=utf-8;base64,${ttf.toString('base64')}`
      : `${publicPath}${name}-webfont.ttf`
  }") format("truetype");
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
}

.${fontFamilyClassName} {
  font-family: "${name}";
}

${icons
  .map(
    (icon) => `\
.${namespace}-${icon.name}::before {
  content: "\\${icon.pointCode}";
}
`,
  )
  .join('\n\n')}

`

    await Promise.all([
      buildComponents(),
      writeFile(resolve(ICONS_FONT_DIR, `${name}-webfont.ttf`), ttf),
      writeFile(resolve(ICONS_STYLE_DIR, `${name}.css`), cssTemplate),
      writeFile(resolve(ICONS_STYLE_DIR, `${name}.less`), cssTemplate),
    ])
    logger.success('build success!')
  } catch (e: any) {
    logger.error(e.toString())
    process.exit(1)
  }
}
