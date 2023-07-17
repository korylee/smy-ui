import { isPlainObject, isString } from '../_utils/is'
import { kebabCase } from '../_utils/shared'
import { warn } from '../_utils/smy/warn'

const IconMap = new Map<string, any>()

const IconTimeMap = new Map<string, number>()

function register(name: string, IconComponent: any): typeof IconCache
function register(IconComponent: any): typeof IconCache
function register(...args: any[]) {
  const [name, IconComponent] = (args.length === 1 ? [args[0]?.name, args[0]] : args) as [string, any]
  if (!name || !isPlainObject(IconComponent) || !IconComponent.render) {
    warn('[IconCahce]', name + '不合法')
    return IconCache
  }

  const normalizedName = kebabCase(name)
  IconMap.set(normalizedName, IconComponent)
  IconTimeMap.set(normalizedName, (IconTimeMap.get(name) ?? 0) + 1)
  return IconCache
}

function unregister(name: string): boolean
function unregister(IconComponent: any): boolean
function unregister(arg: any) {
  const name = isString(arg) ? arg : arg.name
  const normalizedName = kebabCase(name)
  const times = IconTimeMap.get(normalizedName)
  if (!times) return true
  if (times === 1) {
    IconMap.delete(normalizedName)
    IconTimeMap.delete(normalizedName)
    return true
  }
  IconTimeMap.set(normalizedName, times - 1)
  return false
}

export const IconCache = {
  register,
  unregister,
  get(name: string) {
    return IconMap.get(name)
  },
}
