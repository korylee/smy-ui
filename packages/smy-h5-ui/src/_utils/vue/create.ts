import { isArray, isPlainObject, isString } from '../is'

type Mod = string | Record<string, any>
type Mods = Mod | Mod[]

function genBem(name: string, mods?: Mods): string {
  if (!mods) {
    return ''
  }
  if (isString(mods)) {
    return ` ${name}--${mods}`
  }
  if (isArray<Mod>(mods)) {
    return mods.reduce<string>((ret, item) => ret + genBem(name, item), '')
  }
  if (isPlainObject(mods)) {
    return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? genBem(name, key) : ''), '')
  }
  return ''
}

function createBem(name: string) {
  function bem(el?: Mods, mods?: Mods) {
    if (el && !isString(el)) {
      mods = el
      el = ''
    }
    el = el ? `${name}__${el}` : name
    return `${el}${genBem(el, mods)}`
  }
  return bem
}

type BEM = ReturnType<typeof createBem>

export function createNamespace<C extends string, D extends string>(name: C, prefix: D): [`${D}-${C}`, BEM]
export function createNamespace<C extends string>(name: C): [`smy-${C}`, BEM]
export function createNamespace(name: string, prefix = 'smy') {
  const componentName = `${prefix}-${name}` as const
  return [componentName, createBem(componentName)] as const
}
