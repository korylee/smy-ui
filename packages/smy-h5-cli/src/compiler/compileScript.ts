import { transformAsync } from '@babel/core'
import {
  writeFileSync,
  readFileSync,
  removeSync,
  writeFile,
  existsSync,
  unlink,
  pathExistsSync,
  readdirSync,
} from 'fs-extra'
import { camelCase, upperFirst } from 'lodash'
import { isDir, isJsx, isTsx, replaceExt } from '../shared/fs-utils'
import { extractStyleDependencies } from './compileStyle'
import { dirname, extname, resolve } from 'path'
import logger from '../shared/logger'
import { CWD, SCRIPT_EXTENSIONS, STYLE_EXTENSIONS, UI_PACKAGE_JSON, VITE_RESOLVE_EXTENSION } from '../shared/constant'
import { getSmyConfig } from '../config/smyConfig'
import execa from 'execa'
import esbuild from 'esbuild'

// https://regexr.com/765a4
export const IMPORT_FROM_DEPENDENCE_RE = /import\s+?[\w\s{},$*]+\s+from\s+?(".*?"|'.*?')/g
// https://regexr.com/767e6
export const EXPORT_FROM_DEPENDENCE_RE = /export\s+?[\w\s{},$*]+\s+from\s+?(".*?"|'.*?')/g
// https://regexr.com/764ve
export const IMPORT_DEPENDENCE_RE = /import\s+(".*?"|'.*?')/g

export async function compileScript(script: string, file: string) {
  // ts -> js
  let code = isJsx(file) || isTsx(file) ? (await compileScriptByBabel(script, file))! : script

  if (!code) return

  code = await compileScriptByEsbuild(code)

  code = resolveDependence(file, code)
  code = extractStyleDependencies(file, code, { expect: 'css', self: true })
  code = extractStyleDependencies(file, code, { expect: 'less', self: true })

  removeSync(file)
  writeFileSync(replaceExt(file, '.js'), code, 'utf-8')
}

export async function compileScriptFile(file: string) {
  const sources = readFileSync(file, 'utf-8')

  await compileScript(sources, file)
}

export async function compileESEntry(dir: string, publicDirs: string[]) {
  const imports: string[] = []
  const plugins: string[] = []
  // const internalComponents: string[] = []
  const publicComponents: string[] = []
  const cssImports: string[] = []
  const lessImports: string[] = []
  const version = require(UI_PACKAGE_JSON).version
  // const { namespace = "smy" } = getSmyConfig();
  // const componentPrefix = upperFirst(namespace);

  publicDirs.forEach((dirname: string) => {
    if (dirname.startsWith('_')) return
    const publicComponent = upperFirst(camelCase(dirname))
    publicComponents.push(publicComponent)
    imports.push(`import ${publicComponent} from './${dirname}'`)
    plugins.push(`app.use(${publicComponent})`)
    if (!existsSync(resolve(dir, `./${dirname}/style`))) return
    cssImports.push(`import './${dirname}/style'`)
    lessImports.push(`import './${dirname}/style/less'`)
  })

  const install = `
function install(app) {
  ${plugins.join('\n  ')}
}
`

  const indexTemplate = `\
${imports.join('\n')}\n
const version = '${version}';\n
${install}
export {
  install,
  version,
  ${publicComponents.join(',\n  ')}
}

export default {
  install,
  version,
}
`

  const bundleTemplate = `\
${imports.join('\n')}\n
${cssImports.join('\n')}\n
const version = '${version}'\n
${install}
export {
  install,
  version,
  ${publicComponents.join(',\n  ')}
}

export default {
  install,
  version,
}
`

  const styleTemplate = `\
${cssImports.join('\n')}
`

  const lessTemplate = `\
${lessImports.join('\n')}
`
  await Promise.all([
    writeFile(resolve(dir, 'index.js'), indexTemplate, 'utf-8'),
    writeFile(resolve(dir, 'index.bundle.mjs'), bundleTemplate, 'utf-8'),
    writeFile(resolve(dir, 'style.js'), styleTemplate, 'utf-8'),
    writeFile(resolve(dir, 'less.js'), lessTemplate, 'utf-8'),
  ])
}

export async function tsc(config: Record<string, any>) {
  const tsConfigPath = resolve(CWD, '_tsconfig.json')
  await writeFile(tsConfigPath, JSON.stringify(config, undefined, 2))
  const { stdout, stderr } = await execa('npx', ['tsc', '-p', tsConfigPath], {
    cwd: CWD,
  })
  stdout && logger.info(stdout)
  if (stderr) {
    throw new Error(stderr)
  }
  await unlink(tsConfigPath)
}

export async function compileScriptByBabel(script: string, file: string) {
  const result = await transformAsync(script, {
    filename: file,
  })
  if (!result?.code) {
    return logger.error(`${file} code is empty`)
  }
  return result.code
}

export async function compileScriptByEsbuild(script: string) {
  const smyConfig = await getSmyConfig()

  const { code } = await esbuild.transform(script, {
    loader: 'ts',
    target: smyConfig.esbuild?.target,
    format: 'esm',
  })

  return code
}

const STYLE_INDEXES = STYLE_EXTENSIONS.map((ext) => `index${ext}`)
const SCRIPT_INDEXES = SCRIPT_EXTENSIONS.map((ext) => `index${ext}`)

export function resolveDependence(file: string, script: string) {
  const replacer = (source: string, dependence: string) => {
    dependence = dependence.slice(1, dependence.length - 1)

    const ext = extname(dependence)
    const targetDependenceFile = resolve(dirname(file), dependence)
    const scriptExt = '.js'
    const inNodeModules = !dependence.startsWith('.')
    const done = (targetDependence: string) => source.replace(dependence, targetDependence)

    if (inNodeModules) {
      return source
    }
    if (ext) {
      if (VITE_RESOLVE_EXTENSION.includes(ext)) {
        // e.g. './a.vue' -> './a.js'
        return done(dependence.replace(ext, scriptExt))
      }
      if (STYLE_EXTENSIONS.includes(ext)) {
        // e.g. './a.css' -> './a.css'
        return source
      }
    }
    if (!ext) {
      // e.g. ../button/props -> ../button/props.mjs
      const matchedScript = tryMatchExtname(targetDependenceFile, VITE_RESOLVE_EXTENSION)
      if (matchedScript) {
        return done(`${dependence}${scriptExt}`)
      }
      const matchedStyle = tryMatchExtname(targetDependenceFile, STYLE_EXTENSIONS)
      if (matchedStyle) {
        return done(`${dependence}${matchedStyle}`)
      }

      if (isDir(targetDependenceFile)) {
        // e.g ../button
        const files = readdirSync(targetDependenceFile)
        const hasScriptIndex = files.some((file) => SCRIPT_INDEXES.some((index) => file.endsWith(index)))
        if (hasScriptIndex) {
          return done(`${dependence}/index${scriptExt}`)
        }

        const hasStyleIndex = files.find((file) => STYLE_INDEXES.some((index) => file.endsWith(index)))
        if (hasStyleIndex) {
          // e.g. -> ../button/index.css
          return done(`${dependence}/${hasStyleIndex}`)
        }
      }
    }
    return ''
  }

  return script
    .replace(IMPORT_FROM_DEPENDENCE_RE, replacer)
    .replace(EXPORT_FROM_DEPENDENCE_RE, replacer)
    .replace(IMPORT_DEPENDENCE_RE, replacer)
}

export function tryMatchExtname(file: string, extnames: string[]) {
  for (const ext of extnames) {
    const matched = `${file}${ext}`
    if (pathExistsSync(matched)) {
      return ext
    }
  }
}
