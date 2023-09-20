import { CodeFile } from './store'
import { transformRef, shouldTransformRef, SFCDescriptor, BindingMetadata } from '@vue/compiler-sfc'
import { transform } from 'sucrase'
import hashId from 'hash-sum'

export const COMP_IDENTIFIER = `__sfc__`

export function compileTs(src: string) {
  return transform(src, { transforms: ['typescript'] }).code
}

export async function compileFile(store: any, file: CodeFile) {
  const { filename, compiledResult: result } = file
  let { code } = file
  const { state, compiler, options } = store

  if (!code.trim()) {
    state.errors = []
    return
  }
  if (filename.endsWith('.css')) {
    result.css = code
    state.errors = []
    return
  }
  const isTsFile = filename.endsWith('.ts')
  if (filename.endsWith('.js') || isTsFile) {
    if (shouldTransformRef(code)) {
      code = transformRef(code, { filename }).code
    }
    if (isTsFile) {
      code = compileTs(code)
    }
    result.js = result.ssr = code
    state.errors = []
    return
  }
  if (!filename.endsWith('.vue')) {
    state.errors = []
    return
  }
  const { errors, descriptor } = compiler.parse(code, { filename, sourceMap: true })
  if (errors.length) {
    state.errors = errors
    return
  }
  if (descriptor.styles.some((s: any) => s.lang) || (descriptor.template && descriptor.template.lang)) {
    state.errors = [`lang="x" pre-processors for <template> or <style> are currently not ` + `supported.`]
    return
  }
  const scriptLang = descriptor.script?.lang || descriptor.scriptSetup?.lang
  const isTs = scriptLang === 'ts'
  if (scriptLang && !isTs) {
    state.errors = [`Only lang="ts" is supported for <script> blocks.`]
    return
  }

  let cliendCode = ''
  let ssrCode = ''

  const id = hashId(filename)
  const clientScriptResult = await compileScript(store, descriptor, {
    id,
    ssr: false,
    isTs,
  })
  if (!clientScriptResult) {
    return
  }
  const [clientScript, bindings] = clientScriptResult
  cliendCode += clientScript

  if (descriptor.scriptSetup) {
    const ssrScriptResult = await compileScript(store, descriptor, {
      id,
      ssr: true,
      isTs,
    })
    if (ssrScriptResult) {
      ssrCode += ssrScriptResult[0]
    } else {
      ssrCode = `/* SSR compile error: ${state.errors[0]} */`
    }
  } else {
    ssrCode += clientScript
  }
  if (descriptor.template && (!descriptor.scriptSetup || options?.script?.inlineTemplate === false)) {
    const clientTemplateResult = await compileTemplate(store, descriptor, {
      id,
      bindingMetadata: bindings,
      ssr: false,
      isTs,
    })
    if (!clientTemplateResult) {
      return
    }
    cliendCode += clientScriptResult
    const ssrTemplateResult = await compileTemplate(store, descriptor, {
      id,
      bindingMetadata: bindings,
      ssr: true,
      isTs,
    })
    if (ssrTemplateResult) {
      ssrCode += ssrTemplateResult
    } else {
      ssrCode = `/* SSR compile error: ${state.errors[0]} */`
    }
  }
  const hasScoped = descriptor.styles.some((s: any) => s.scoped)
  const appendSharedCode = (code: string) => {
    cliendCode += code
    ssrCode += code
  }
  if (hasScoped) {
    appendSharedCode(`\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`)
  }
  if (cliendCode || ssrCode) {
    appendSharedCode(`\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}\nexport default ${COMP_IDENTIFIER}`)
    result.js = cliendCode.trimStart()
    result.ssr = ssrCode.trimStart()
  }

  let css = ''
  for (const style of descriptor.styles) {
    if (style.module) {
      state.errors = [`<style module> is not supported in the playground.`]
      return
    }
    const styleResult = await compiler.compileStyleAsync({
      ...options?.style,
      source: style.content,
      filename,
      id,
      scoped: style.scoped,
      modules: !!style.module,
    })
    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) {
        store.state.errors = styleResult.errors
      }
      // proceed even if css compile errors
    } else {
      css += styleResult.code + '\n'
    }
  }
  if (css) {
    result.css = css.trim()
  } else {
    result.css = `/** No <style> tags present */`
  }

  state.errors = []
}

async function compileScript(
  store: any,
  descriptor: SFCDescriptor,
  opts: { isTs?: boolean; id?: string; ssr?: boolean } = {}
) {
  if (!descriptor?.script && !descriptor.scriptSetup) {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined]
  }
  const { isTs, id, ssr } = opts
  const { compiler, options, state } = store
  try {
    const expressionPlugins = isTs ? ['typescript'] : undefined
    const compiledScript = compiler.compileScript(descriptor, {
      inlineTemplate: true,
      ...options?.script,
      id,
      templateOptions: {
        ...options?.template,
        ssr,
        ssrCssVars: descriptor.cssVars,
        compilerOptions: {
          ...options?.template?.compilerOptions,
          expressionPlugins,
        },
      },
    })
    let code = ''
    if (compiledScript.bindings) {
      code += `\n/* Analyzed bindings: ${JSON.stringify(compiledScript.bindings, null, 2)} */`
    }
    code += '\n' + compiler.rewriteDefault(compiledScript.content, COMP_IDENTIFIER, expressionPlugins)
    if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts') {
      code = await compileTs(code)
    }
    return [code, compiledScript.bindings]
  } catch (e: any) {
    state.errors = [e.stack.split('\n').slice(0, 12).join('\n')]
    return
  }
}

async function compileTemplate(
  store: any,
  descriptor: SFCDescriptor,
  opts: { isTs?: boolean; id?: string; ssr?: boolean; bindingMetadata?: BindingMetadata } = {}
) {
  const { compiler, options, state } = store
  const { id, isTs, ssr, bindingMetadata } = opts
  const templateResult = compiler.compileTemplate({
    ...options?.template,
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some((s) => s.scoped),
    slotted: descriptor.slotted,
    ssr,
    ssrCssVars: descriptor.cssVars,
    isProd: false,
    compileOptions: {
      ...options?.template?.compilerOptions,
      bindingMetadata,
      expressionPlugins: isTs ? ['typescript'] : undefined,
    },
  })

  if (templateResult.errors.length) {
    state.errors = templateResult.errors
    return
  }
  const fnName = ssr ? 'ssrRender' : 'render'
  const prefix = templateResult.code.replace(/\nexport (function|const) (render|ssrRender)/, `$1 ${fnName}`)

  let code = `\n${prefix}\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`

  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts') {
    code = await compileTs(code)
  }

  return code
}
