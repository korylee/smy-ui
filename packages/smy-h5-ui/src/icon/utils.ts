import { isPlainObject, isString } from '../_utils/is'
import { kebabCase } from '../_utils/shared'
import { throwError, warn } from '../_utils/smy/warn'
import type Vue from 'vue'

type SmyIconComponent = any

const IconMap = new Map<string, any>()
const IconTimesMap = new Map<string, number>()

function register(name: string, icon: SmyIconComponent): typeof IconCache
function register(icon: SmyIconComponent): typeof IconCache
function register(...args: any[]) {
  const [name, icon] = (args.length === 1 ? [args[0]?.name, args[0]] : args) as [string, any]
  if (!name || !isPlainObject(icon) || !icon.render) {
    warn('IconCahce', name + '不合法')
    return IconCache
  }

  const normalizedName = kebabCase(name)
  IconMap.set(normalizedName, icon)
  IconTimesMap.set(normalizedName, (IconTimesMap.get(name) ?? 0) + 1)
  return IconCache
}

function unregister(name: string): boolean
function unregister(icon: SmyIconComponent): boolean
function unregister(arg: any) {
  const name = isString(arg) ? arg : arg.name
  const normalizedName = kebabCase(name)
  const times = IconTimesMap.get(normalizedName)
  if (!times) return true
  if (times === 1) {
    IconMap.delete(normalizedName)
    IconTimesMap.delete(normalizedName)
    return true
  }
  IconTimesMap.set(normalizedName, times - 1)
  return false
}

export const IconCache = {
  register,
  unregister,
  get(name: string) {
    if (!name) return undefined
    return IconMap.get(kebabCase(name))
  },
}

export function useIconCache(vm: Vue, icon: SmyIconComponent) {
  if ((vm as any)._isMounted) {
    throwError('useIconCache', '请在mounted之前的生命周期调用')
  }

  IconCache.register(icon)
  vm.$on('hook:beforeDestroy', () => {
    IconCache.unregister(icon)
  })
}
