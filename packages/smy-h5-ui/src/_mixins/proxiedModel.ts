import { isString } from '@smy-h5/shared'
import { throwError } from '../_utils/smy/warn'

type TransformFunc = ((val: any) => any) | string

interface ProxiedModelOptions {
  passive?: boolean
  event?: string
  transformIn?: TransformFunc
  transformOut?: TransformFunc
}

const getTransformFunc = (func: TransformFunc = (v) => v) =>
  isString(func)
    ? function (this: any, ...args: any[]) {
        const vm = this
        return vm[func](...args)
      }
    : func

export function createProxiedModel(prop: string, proxy: string, options: ProxiedModelOptions = {}): any {
  const { passive = true, event = 'input', transformIn, transformOut } = options
  if (!prop) throwError('createProxiedModel', 'prop 不能为空')
  const getProp = (vm: any) => vm[prop]
  const get = getTransformFunc(transformIn)
  const set = getTransformFunc(transformOut)

  if (!passive) {
    return {
      computed: {
        [proxy]: {
          get() {
            return get.call(this, getProp(this))
          },
          set(val: unknown) {
            const vm: any = this
            if (val === get.call(this, getProp(this))) return
            vm.$emit(event, set.call(vm, val))
          },
        },
      },
    }
  }
  return {
    data: (vm: any) => ({
      [proxy]: get.call(vm, getProp(vm)),
    }),
    watch: {
      [prop](newVal: any) {
        const vm = this
        const value = get.call(vm, newVal)
        if (value === vm[proxy]) return

        vm[proxy] = value
      },
      [proxy]: {
        immediate: true,
        handler(val: unknown) {
          const vm: any = this
          const value = set.call(vm, val)
          if (value === getProp(vm)) return

          vm.$emit(event, value)
        },
      },
    },
  }
}
